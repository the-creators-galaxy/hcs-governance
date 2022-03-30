import type { IConsensusTopicResponse } from '@hashgraph/proto';
import { Injectable, Logger } from '@nestjs/common';
import { HcsMessageMirrorRecord } from 'src/models/hcs-message-mirror-record';
import { Vote } from 'src/models/vote';
import { noop } from 'src/util/noop';
import { DataService } from './data.service';
import { MirrorClientService } from './mirror-client.service';
/**
 * Specialized service instance that validates a cast-vote HCS message,
 * and records validated votes with the data storage service.
 */
@Injectable()
export class HcsVoteProcessingService {
	/**
	 * The service's logger instance.
	 */
	private readonly logger = new Logger(HcsVoteProcessingService.name);
	/**
	 * Public constructor, called by the NextJS runtime dependency injection services.
	 *
	 * @param mirrorClient Data service for retrieving additional information
	 * from the mirror node via its REST interface.
	 *
	 * @param dataService The proposal ballot data storage (state) service.
	 */
	constructor(private readonly mirrorClient: MirrorClientService, private readonly dataService: DataService) {}
	/**
	 * Process a potential cast-vote HCS native message.  If the message
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
	processMessage(hcsMessage: IConsensusTopicResponse, hcsMirrorRecord: HcsMessageMirrorRecord, hcsPayload: any): () => Promise<void> {
		const ballotId = hcsPayload.ballotId;
		const vote: Vote = {
			consensusTimestamp: hcsMirrorRecord.consensus_timestamp,
			payerId: hcsMirrorRecord.payer_account_id,
			vote: hcsPayload.vote,
			tokenBalance: 0,
		};
		if (!/^\d+\.\d+$/.test(ballotId)) {
			this.logger.verbose(`Message ${hcsMessage.sequenceNumber} failed vote validation: Invalid Ballot ID.`);
		} else if (typeof vote.vote !== 'number' || vote.vote < 0) {
			this.logger.verbose(`Message ${hcsMessage.sequenceNumber} failed vote validation: Vote must be a non-negative number.`);
		} else {
			return async () => {
				const ballot = this.dataService.getBallot(ballotId);
				if (!ballot) {
					this.logger.verbose(`Message ${hcsMessage.sequenceNumber} failed vote validation: Valid ballot does not exist.`);
				} else if (ballot.startTimestamp > vote.consensusTimestamp) {
					this.logger.verbose(`Message ${hcsMessage.sequenceNumber} failed vote validation: Vote was cast before voting started.`);
				} else if (ballot.endTimestamp < vote.consensusTimestamp) {
					this.logger.verbose(`Message ${hcsMessage.sequenceNumber} failed vote validation: Vote was cast after voting was finished.`);
				} else if (!ballot.choices[vote.vote]) {
					this.logger.verbose(`Message ${hcsMessage.sequenceNumber} failed vote validation: Vote did not match any valid vote option.`);
				} else {
					const tokenBalance = await this.mirrorClient.getTokenBalance(vote.payerId, ballot.tokenId, ballot.startTimestamp);
					if (tokenBalance.balance === 0) {
						this.logger.verbose(`Message ${hcsMessage.sequenceNumber} failed vote validation: Account has no voting token balance.`);
					} else {
						vote.tokenBalance = tokenBalance.balance;
						this.dataService.addVote(ballot.consensusTimestamp, vote);
						this.logger.verbose(
							`Message ${hcsMessage.sequenceNumber} recorded as vote for proposal ${ballot.consensusTimestamp} cast by ${vote.payerId}`,
						);
					}
				}
				return Promise.resolve();
			};
		}
		// Not a valid message, do nothing.
		return noop;
	}
}
