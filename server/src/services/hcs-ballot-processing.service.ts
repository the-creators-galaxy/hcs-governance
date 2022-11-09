import { MessageInfo } from '@bugbytes/hapi-mirror';
import { ConsensusTopicResponse } from '@bugbytes/hapi-proto';
import { EntityIdKeyString, TimestampKeyString } from '@bugbytes/hapi-util';
import { Injectable, Logger } from '@nestjs/common';
import { Ballot } from 'src/models/ballot';
import { noop } from 'src/util/noop';
import { DataService } from './data.service';
import { NetworkConfigurationService } from './network-configuration.service';
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
	 * @param network The network configuration service, providing configuration details
	 * such as the id of the voting token.
	 *
	 * @param dataService The data service storing proposal ballot information.
	 */
	constructor(private readonly network: NetworkConfigurationService, private readonly dataService: DataService) { }
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
	processMessage(
		hcsMessage: ConsensusTopicResponse,
		hcsMirrorRecord: MessageInfo,
		hcsPayload: any,
	): () => Promise<void> {
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
			tally: new Array(hcsPayload.choices.length).fill(0),
			winner: undefined,
			checksum: undefined,
		};
		if (!/^\d+\.\d+\.\d+$/.test(ballot.tokenId)) {
			this.logger.verbose(`Message ${hcsMessage.sequenceNumber} failed create-ballot validation: Invalid Token ID.`);
		} else if (ballot.tokenId !== this.network.hcsToken) {
			this.logger.verbose(`Message ${hcsMessage.sequenceNumber} contains a create-ballot for a different payment token ID.`);
		} else if (!/^\d+\.\d+\.\d+$/.test(ballot.payerId)) {
			this.logger.verbose(`Message ${hcsMessage.sequenceNumber} failed create-ballot validation: Invalid Payer ID.`);
		} else if (!ballot.title) {
			this.logger.verbose(`Message ${hcsMessage.sequenceNumber} failed create-ballot validation: Empty title.`);
		} else if (!ballot.description) {
			this.logger.verbose(`Message ${hcsMessage.sequenceNumber} failed create-ballot validation: Empty description url.`);
		} else if (!ballot.discussion) {
			this.logger.verbose(`Message ${hcsMessage.sequenceNumber} failed create-ballot validation: Empty discussion url.`);
		} else if (ballot.scheme !== 'single-choice') {
			this.logger.verbose(`Message ${hcsMessage.sequenceNumber} failed create-ballot validation: Unrecognized Voting Scheme.`);
		} else if (!ballot.choices || ballot.choices.length < 2) {
			this.logger.verbose(`Message ${hcsMessage.sequenceNumber} failed create-ballot validation: Ballot needs at least two Voting Choices.`);
		} else if (!/^\d+\.\d+$/.test(ballot.consensusTimestamp)) {
			this.logger.verbose(`Message ${hcsMessage.sequenceNumber} failed create-ballot validation: Invalid Consensus Timestamp.`);
		} else if (!/^\d+\.\d+$/.test(ballot.startTimestamp)) {
			this.logger.verbose(`Message ${hcsMessage.sequenceNumber} failed create-ballot validation: Invalid Voting Start Time.`);
		} else if (!/^\d+\.\d+$/.test(ballot.endTimestamp)) {
			this.logger.verbose(`Message ${hcsMessage.sequenceNumber} failed create-ballot validation: Invalid Voting Completion Time.`);
		} else if (ballot.startTimestamp >= ballot.endTimestamp) {
			this.logger.verbose(`Message ${hcsMessage.sequenceNumber} failed create-ballot validation: Voting ending time preceeds starting.`);
		} else {
			return () => {
				if (this.dataService.getBallot(ballot.consensusTimestamp)) {
					this.logger.verbose(
						`Message ${hcsMessage.sequenceNumber} failed create-ballot validation: Ballot with same consensus timestamp already exists.`,
					);
				} else {
					this.dataService.setBallot(ballot);
					this.logger.verbose(`Message ${hcsMessage.sequenceNumber} added Ballot ${ballot.consensusTimestamp} to list.`);
				}
				return Promise.resolve();
			};
		}
		// Do nothing, this was not a valid ballot.
		return noop;
	}
}
