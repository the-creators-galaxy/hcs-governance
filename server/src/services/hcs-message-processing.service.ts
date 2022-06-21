import { Injectable, Logger } from '@nestjs/common';
import * as hapi from '@hashgraph/proto';
import { HcsBallotProcessingService } from './hcs-ballot-processing.service';
import { MirrorClientService } from './mirror-client.service';
import { HcsMessageMirrorRecord } from 'src/models/hcs-message-mirror-record';
import { HcsVoteProcessingService } from './hcs-vote-processing.service';
import { DataService } from './data.service';
/**
 * Root HCS message processing pipeline.  This service receives raw HCS
 * messages for the topic.  It validates each message, determining if
 * they are valid CGIP-4 messages.  Valid messages are forwarded to
 * additional pipelines designed to handle the type of message, the
 * others are ignored and no further action is taken on them.  The process
 * involves additional REST calls to the mirror node to retrieve additional
 * information for a message, such as the account paying for posting the
 * message to HCS.
 */
@Injectable()
export class HcsMessageProcessingService {
	/**
	 * The service's logger instance.
	 */
	private readonly logger = new Logger(HcsMessageProcessingService.name);
	/**
	 * The task sequencing promise.  The service relies on this promise to
	 * order the asynchronous processing of HCS messages.  HCS messages must
	 * ultimately be processed in sequential order to properly build up the
	 * state of the system, however some data gathering is not dependent on
	 * order and can be performed in parallel with other requests.  This
	 * tasks sequence acts as a regulator ensuring asynchronous promises
	 * complete before others, keeping the final processing of HCS messages
	 * in proper order.
	 */
	private currentTask = Promise.resolve();
	/**
	 * The current task count.  In order to remain performant and reduce
	 * excessive TCP connections to mirror nodes, the number of active tasks
	 * querying the mirror node is limited.  This counter tracks the current
	 * in-progress tasks processing HCS messages.  When the limit is reached,
	 * tasks are queued (fifo) and not processed until a processing slot
	 * becomes available.
	 */
	private activeCount = 0;
	/**
	 * When the number of pending HCS messages exceeds the current capacity
	 * limitations, HCS messages are added hear and processed first-in-first-out
	 * as soon as a processing task slot becomes available.
	 */
	private taskQueue = [];
	/**
	 * Public constructor, called by the NextJS runtime dependency injection services.
	 *
	 * @param hcsBallotProcessor Service that processes potential
	 * proposal ballot creation messages.
	 *
	 * @param hcsVoteProcessor Service that processes potential voting messages.
	 *
	 * @param mirrorClient Data service for retrieving additional information
	 * from the mirror node via its REST interface.
	 *
	 * @param dataService The proposal ballot data storage (state) service.
	 */
	constructor(
		private readonly hcsBallotProcessor: HcsBallotProcessingService,
		private readonly hcsVoteProcessor: HcsVoteProcessingService,
		private readonly mirrorClient: MirrorClientService,
		private readonly dataService: DataService,
	) {}
	/**
	 * Process (or Queues for processing) a raw HCS native message.
	 * If the message passes initial validation checks it is forwarded
	 * to the appropriate specialized processor.
	 *
	 * Note: the number of concurrent processing tasks is limited to 150.
	 * This helps reduce TCP congestion during startup/replay of the HCS messages.
	 *
	 * @param hcsMessage The raw hcsMessage to be processed.
	 */
	processMessage(hcsMessage: hapi.com.hedera.mirror.api.proto.IConsensusTopicResponse): void {
		this.taskQueue.push(hcsMessage);
		if (this.activeCount < 150) {
			this.processMessageTask(this.taskQueue.shift());
		}
	}
	/**
	 * When called, inserts a heartbeat message into the stream of tasks
	 * to process.  When processed, the task will update the timestamp
	 * in the data store if it happens to be the last task in the queue
	 * (possibly invoking background tasks such as computing voting checksums).
	 */
	processHeartbeat(): void {
		let thisHeartbeat: Promise<void>;
		let previousTask = this.currentTask;
		const thisTask = async () => {
			await previousTask;
			previousTask = null;
			// Only perform a ping if this task is at the end of the queue
			if (this.currentTask === thisHeartbeat) {
				const lastProcessedTimestamp = this.dataService.getLastUpdated();
				const lastHcsMessageTimestamp = await this.mirrorClient.getLatestMessageTimestamp();
				// If the data store is "behind", we do not want to do anything
				// at the moment, skip this heartbeat to let the hcs message queue
				// to catch up before updating to the current ledger timestamp.
				if (lastHcsMessageTimestamp <= lastProcessedTimestamp) {
					const ledgerTimestamp = await this.mirrorClient.getLatestTransactionTimestamp();
					this.dataService.setLastUpdated(ledgerTimestamp);
					this.logger.verbose(`Heartbeat ${ledgerTimestamp}: waiting for HCS Messages`);
				}
			}
		};
		this.currentTask = thisHeartbeat = thisTask();
	}
	/**
	 * Internal method for processing a raw HCS native message.
	 * If the message passes initial validation checks it is forwarded
	 * to the appropriate specialized processor.
	 *
	 * Note: processing of a message typically involves two parts.  The first
	 * part can be done asynchronously performed without referencing state of
	 * the data storage.  The second part must be done in sequential order of
	 * messages, and must wait for all other asynchronous processes of messages
	 * preceding this one to complete.  This method internally orchestrates
	 * this process, using the `currentTask` promise as a linked list of
	 * promise dependences to ensure processing order.  Additionall the number
	 * of concurrent processing tasks is limited to 150.  This helps reduce
	 * TCP congestion during startup/replay of the HCS messages.
	 *
	 * @param hcsMessage The raw hcsMessage to be processed.
	 */
	private processMessageTask(hcsMessage: hapi.com.hedera.mirror.api.proto.IConsensusTopicResponse): void {
		this.activeCount = this.activeCount + 1;
		let previousTask = this.currentTask;
		const thisTask = async () => {
			const nextTask = await this.getNextTask(hcsMessage);
			await previousTask;
			previousTask = null;
			await nextTask();
			if (hcsMessage.consensusTimestamp) {
				const timestamp = `${hcsMessage.consensusTimestamp.seconds}.${hcsMessage.consensusTimestamp.nanos.toString().padStart(6, '0')}`;
				this.dataService.setLastUpdated(timestamp);
			}
			this.activeCount = this.activeCount - 1;
			if (this.taskQueue.length > 0) {
				this.processMessageTask(this.taskQueue.shift());
			}
		};
		this.currentTask = thisTask();
	}
	/**
	 * Internal helper function returning a resolved promise for those HCS
	 * messages that did not pass validation.
	 *
	 * @returns resolved promise that performs no actions.
	 */
	private discardMessage() {
		// Do nothing, this was not a valid message
		// that can be dispatched to a handler.
		return Promise.resolve();
	}
	/**
	 * The first stage in the processing pipeline.  Since an HCS message does
	 * not include the payer information (and that is required for processing)
	 * it first makes an async call to retrieve the additional information
	 * from the record that created the HCS message.  With this information,
	 * the process can determine the basic validity of the message and which
	 * processor should continue processing the message.  It then invokes the
	 * appropriate specialized processor for each message type, each of which
	 * perform additional validation checks before returning the second stage
	 * function (the one that inserts the data into the data service).
	 *
	 * @param hcsMessage the raw HCS message.
	 *
	 * @returns The second stage function from the specialized pipeline
	 * processor.  This function is invoked in HCS sequential order, and
	 * while it is still asynchronous, processing of downstream messages
	 * will block until the returned method resolves its promise.
	 */
	private async getNextTask(hcsMessage: hapi.com.hedera.mirror.api.proto.IConsensusTopicResponse): Promise<() => Promise<void>> {
		const hcsPayload = this.parsePayload(hcsMessage);
		if (!hcsPayload) {
			return this.discardMessage;
		}
		const hcsMirrorRecord = await this.getMirrorRecord(hcsMessage.sequenceNumber);
		if (!hcsMirrorRecord) {
			return this.discardMessage;
		}
		switch (hcsPayload['type']) {
			case 'create-ballot':
				return this.hcsBallotProcessor.processMessage(hcsMessage, hcsMirrorRecord, hcsPayload);
			case 'cast-vote':
				return this.hcsVoteProcessor.processMessage(hcsMessage, hcsMirrorRecord, hcsPayload);
			default:
				this.logger.verbose(`Message ${hcsMessage.sequenceNumber} is not recognized as a valid hcs message for processing.`);
				return this.discardMessage;
		}
	}
	/**
	 * Validates the raw HCS message properties and attempts to decode the
	 * message payload, looking for valid CGIP-4 messages.
	 *
	 * @param hcsMessage The raw hcsMessage to be processed.
	 *
	 * @returns A JSON object representing the CGIP-4 message payload,
	 * or null if the message was invalid or no payload was found.
	 */
	private parsePayload(hcsMessage: hapi.com.hedera.mirror.api.proto.IConsensusTopicResponse): any | null {
		let hcsPayloadAsString: string;
		let hcsPayload: any;
		if (hcsMessage.chunkInfo) {
			this.logger.verbose(`Message ${hcsMessage.sequenceNumber} has chunks, which are not supported.`);
			return null;
		}
		const buffer = hcsMessage?.message as Buffer;
		if (!buffer) {
			this.logger.verbose(`Message ${hcsMessage.sequenceNumber} is not parsable as a buffer.`);
			return null;
		}
		try {
			hcsPayloadAsString = buffer.toString('utf8');
		} catch (error) {
			this.logger.verbose(`Message ${hcsMessage.sequenceNumber} is not readable as text (for JSON) ${error.message}`);
			return null;
		}
		try {
			hcsPayload = JSON.parse(hcsPayloadAsString);
		} catch (error) {
			this.logger.verbose(`Message ${hcsMessage.sequenceNumber} is not valid JSON ${error.message}`);
			return null;
		}
		const type = hcsPayload['type'];
		if (!type) {
			this.logger.verbose(`Message ${hcsMessage.sequenceNumber} does not have a type property.`);
			return null;
		}
		return hcsPayload;
	}
	/**
	 * Private helper function that retrieves the HCS Mirror Record
	 * (from the REST API) corresponding to a raw HCS stream message
	 * (from the gRPC stream).
	 *
	 * @param sequenceNumber The sequence number identifying the message
	 * data to retrieve.
	 *
	 * @returns An HCS Mirror Record Object, or null if there was an
	 * error or not found.
	 */
	private async getMirrorRecord(sequenceNumber: Long): Promise<HcsMessageMirrorRecord | null> {
		try {
			return await this.mirrorClient.getHcsMessageInfo(sequenceNumber);
		} catch (err) {
			this.logger.verbose(`Message ${sequenceNumber} record was not found on mirror node: ${err.message || JSON.stringify(err)}`);
			return null;
		}
	}
}
