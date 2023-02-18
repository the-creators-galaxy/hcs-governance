import { MessageInfo } from '@bugbytes/hapi-mirror';
import { ConsensusTopicResponse } from '@bugbytes/hapi-proto';
import { EntityIdKeyString, is_entity_id, is_timestamp, keyString_to_timestamp, TimestampKeyString } from '@bugbytes/hapi-util';
import { Injectable, Logger } from '@nestjs/common';
import { AppConfiguration } from 'src/models/app-configuration';
import { Ballot } from 'src/models/ballot';
import { noop } from 'src/util/noop';
import { DataService } from './data.service';
/**
 * Specialized service instance that validates a create-ballot HCS message,
 * and records validated proposal ballots with the data storage service.
 */
@Injectable()
export class HcsBallotProcessingService {
	/**
	 * The service's logger instance.
	 */
	private readonly logger = new Logger(HcsBallotProcessingService.name);
	/**
	 * Public constructor, called by the NextJS runtime dependency injection services.
	 *
	 * @param config The application's configuration containing details
	 * such as the id of the voting token.
	 *
	 * @param dataService The data service storing proposal ballot information.
	 */
	constructor(private readonly config: AppConfiguration, private readonly dataService: DataService) {}
	/**
	 * Process a potential ballot-create HCS native message.  If the message
	 * passes validation it is forwarded to the data service for storage.
	 *
	 * Note: processing of a message typically involves two parts.  The first
	 * part can be done asynchronously performed without referencing state of
	 * the data storage.  The second part must be done in sequential order of
	 * messages, and must wait for all other asynchronous processes of messages
	 * preceding this one to complete.  (For example, don’t try to process a
	 * vote before the ballot has been recorded by the system.)  This method is
	 * expected to return a method returning a promise.  The method returned by
	 * this method call will not be invoked until after the completion of
	 * processing of previous HCS message.  This two-step process can increase
	 * performance of the system as a whole.
	 *
	 * @param hcsMessage The raw hcsMessage to be processed.
	 *
	 * @param hcsMirrorRecord The raw HCS mirror record associated with this
	 * message, useful for retrieving the payer account associated with the message.
	 *
	 * @param hcsPayload The parsed message payload of the raw message, should
	 * contain metadata defining the proposal ballot (to be validated by this method).
	 *
	 * @returns A promise that when completed indicates processing of this message
	 * is complete (regardless of whether it was found to be valid and added to the
	 * list of proposed ballots).
	 */
	processMessage(hcsMessage: ConsensusTopicResponse, hcsMirrorRecord: MessageInfo, hcsPayload: any): () => Promise<void> {
		const ballot: Ballot = {
			consensusTimestamp: hcsMirrorRecord.consensus_timestamp as unknown as TimestampKeyString,
			tokenId: hcsPayload.tokenId,
			payerId: hcsMirrorRecord.payer_account_id as unknown as EntityIdKeyString,
			title: hcsPayload.title,
			description: hcsPayload.description,
			discussion: hcsPayload.discussion,
			scheme: hcsPayload.scheme,
			choices: hcsPayload.choices,
			startTimestamp: hcsPayload.startTimestamp,
			endTimestamp: hcsPayload.endTimestamp,
			minVotingThreshold: hcsPayload.threshold || this.config.minVotingThreshold || 0,
			ineligibleAccounts: hcsPayload.ineligible || [],
			tally: new Array(hcsPayload.choices.length).fill(0),
			winner: undefined,
			checksum: undefined,
		};
		if (!is_timestamp(ballot.consensusTimestamp)) {
			this.logger.verbose(`Message ${hcsMessage.sequenceNumber} failed create-ballot validation: Invalid Consensus Timestamp.`);
		} else if (!is_entity_id(ballot.tokenId)) {
			this.logger.verbose(`Message ${hcsMessage.sequenceNumber} failed create-ballot validation: Invalid Token ID.`);
		} else if (ballot.tokenId !== this.config.hcsToken.id) {
			this.logger.verbose(`Message ${hcsMessage.sequenceNumber} failed create-ballot validation: contains a create-ballot for a different payment token ID.`);
		} else if (!is_entity_id(ballot.payerId)) {
			this.logger.verbose(`Message ${hcsMessage.sequenceNumber} failed create-ballot validation: Invalid Payer ID.`);
		} else if (this.config.ballotCreators.length > 0 && this.config.ballotCreators.indexOf(ballot.payerId) === -1) {
			this.logger.verbose(`Message ${hcsMessage.sequenceNumber} failed create-ballot validation: Payer ID is not on the allowed list.`);
		} else if (!ballot.title) {
			this.logger.verbose(`Message ${hcsMessage.sequenceNumber} failed create-ballot validation: Empty title.`);
		} else if (!ballot.description) {
			this.logger.verbose(`Message ${hcsMessage.sequenceNumber} failed create-ballot validation: Empty description url.`);
		} else if (!ballot.discussion) {
			this.logger.verbose(`Message ${hcsMessage.sequenceNumber} failed create-ballot validation: Empty discussion url.`);
		} else if (ballot.scheme !== 'single-choice') {
			this.logger.verbose(`Message ${hcsMessage.sequenceNumber} failed create-ballot validation: Unrecognized Voting Scheme.`);
		} else if (!Array.isArray(ballot.choices) || ballot.choices.length < 2) {
			this.logger.verbose(`Message ${hcsMessage.sequenceNumber} failed create-ballot validation: Ballot needs at least two Voting Choices.`);
		} else if (!is_timestamp(ballot.startTimestamp)) {
			this.logger.verbose(`Message ${hcsMessage.sequenceNumber} failed create-ballot validation: Invalid Voting Start Time.`);
		} else if (!is_timestamp(ballot.endTimestamp)) {
			this.logger.verbose(`Message ${hcsMessage.sequenceNumber} failed create-ballot validation: Invalid Voting Completion Time.`);
		} else if (ballot.startTimestamp >= ballot.endTimestamp) {
			this.logger.verbose(`Message ${hcsMessage.sequenceNumber} failed create-ballot validation: Voting ending time preceeds starting.`);
		} else if (computeDiffInDays(ballot.startTimestamp, ballot.endTimestamp) < this.config.minVotingThreshold) {
			this.logger.verbose(
				`Message ${hcsMessage.sequenceNumber} failed create-ballot validation: Voting ending time does not permit required voting windo of ${this.config.minVotingThreshold} days.`,
			);
		} else if (ballot.consensusTimestamp > ballot.startTimestamp) {
			this.logger.verbose(
				`Message ${hcsMessage.sequenceNumber} failed create-ballot validation: Proposal Voting Starting Time preceeds Proposal Creation Time.`,
			);
		} else if (computeDiffInDays(ballot.consensusTimestamp, ballot.startTimestamp) < this.config.minimumStandoffPeriod) {
			this.logger.verbose(
				`Message ${hcsMessage.sequenceNumber} failed create-ballot validation: Voting starting time is less than ${this.config.minimumStandoffPeriod} days from ballot creation.`,
			);
		} else if (isNaN(ballot.minVotingThreshold) || ballot.minVotingThreshold < 0 || ballot.minVotingThreshold > 1) {
			this.logger.verbose(
				`Message ${hcsMessage.sequenceNumber} failed create-ballot validation: Invalid Minimum Voting Threshold, must be a fraction between 0 and 1.0 inclusive.`,
			);
		} else if (ballot.minVotingThreshold < this.config.minVotingThreshold) {
			this.logger.verbose(
				`Message ${hcsMessage.sequenceNumber} failed create-ballot validation: Invalid Minimum Voting Threshold, must be equal to or greater than global configuration of ${this.config.minVotingThreshold}.`,
			);
		} else if (!Array.isArray(ballot.ineligibleAccounts)) {
			this.logger.verbose(`Message ${hcsMessage.sequenceNumber} failed create-ballot validation: Ineligible account list is not an array.`);
		} else if (ballot.ineligibleAccounts.find((a) => !is_entity_id(a))) {
			this.logger.verbose(`Message ${hcsMessage.sequenceNumber} failed create-ballot validation: Invalid account id found in Ineligible account list.`);
		} else if (-1 !== ballot.ineligibleAccounts.findIndex((a) => !is_entity_id(a))) {
			this.logger.verbose(`Message ${hcsMessage.sequenceNumber} failed create-ballot validation: Found invalid account id in list of inelegible accounts.`);
		} else {
			ballot.ineligibleAccounts = [...new Set([...ballot.ineligibleAccounts, ...this.config.ineligibleAccounts])];
			return async () => {
				if (await this.dataService.getBallot(ballot.consensusTimestamp)) {
					this.logger.verbose(`Message ${hcsMessage.sequenceNumber} failed create-ballot validation: Ballot with same consensus timestamp already exists.`);
				} else {
					this.dataService.setBallot(ballot);
					this.logger.verbose(`Message ${hcsMessage.sequenceNumber} added Ballot ${ballot.consensusTimestamp} to list.`);
				}
			};
		}
		// Do nothing, this was not a valid ballot.
		return noop;
	}
}
/**
 * Helper function to compute the difference in two
 * HAPI timestamps in fractional days.
 */
function computeDiffInDays(startingTime: TimestampKeyString, endingTime: TimestampKeyString) {
	const starting = keyString_to_timestamp(startingTime);
	const ending = keyString_to_timestamp(endingTime);
	const startSeconds = starting.seconds + starting.nanos / 1000000000.0;
	const endSeconds = ending.seconds + ending.nanos / 1000000000.0;
	return (endSeconds - startSeconds) / 86400.0;
}
