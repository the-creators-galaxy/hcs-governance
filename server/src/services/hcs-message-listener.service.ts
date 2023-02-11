import { EntityIdKeyString, keyString_to_timestamp, keyString_to_topicID, TimestampKeyString, timestamp_to_keyString } from '@bugbytes/hapi-util';
import { Injectable, Logger } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';
import { Client, ChannelCredentials } from '@grpc/grpc-js';
import { HcsMessageProcessingService } from './hcs-message-processing.service';
import { ConsensusTopicQuery, ConsensusTopicResponse } from '@bugbytes/hapi-proto';
import { AppConfiguration } from 'src/models/app-configuration';
import { MirrorClientService } from './mirror-client.service';

/**
 * The heartbeat interval (ms), used to invoke checks on
 * processing and pinging the mirror node to confirm
 * it is still up.
 */
const HEARTBEAT_INTERVAL = 600000;
/**
 * The amount of time (ms) that the service waits before
 * closing the gRPC HCS stream and opening a fresh one.
 * Unfortunately this is necessary as the gRPC mirror will
 * eventually close the connection on its side due to 
 * inactivity and the service will fail to be notified
 * when new messages arrive.  This is a workaround for
 * ensuring the connection stays active 24x7.
 */
const RECONNECT_INTERVAL = 1500000;
/**
 * The pause (ms) to wait after a gRPC stream is closed before
 * attempting to re-estabish a new stream.
 */
const RECONNECT_WAIT_INTERVAL = 10000;
/**
 * Receives raw HCS messages from a mirror node for a given
 * topic and dispatches the incoming messages to the message
 * processing pipeline.  Monitors for disconnections and
 * reconnects as appropriate.  Also produces a heartbeat timer
 * (only when connected) to invoke background processing at
 * given intervals.
 */
@Injectable()
export class HcsMessageListenerService {
	/**
	 * The service's logger instance.
	 */
	private readonly logger = new Logger(HcsMessageListenerService.name);
	/**
	 * The heartbeat timer reference, this is only
	 * set while connected.
	 */
	private heartbeatTimer = null;
	/**
	 * The reconnect timer reference, this is only 
	 * set while connected and causes the connection
	 * to refresh at a given interval (because the mirror
	 * node has been known to stop working after an amount of time)
	 */
	private reconnectTimer = null;
	/**
	 * While this instance exist, the latest sequence
	 * number processed by the listener, this is used 
	 * when re-connecting to a mirror node to listen
	 * for new requests.
	 */
	private sequenceNumber = 1;
	/**
	 * Public constructor, called by the NextJS runtime dependency services.
	 *
	 * @param config The network configuration service, providing configuration details
	 * such as the id of the voting token.
	 * 
	 * @param mirror The mirror client service, necessary to retrieve some timing
	 * metadata for startup from the mirror node.
	 *
	 * @param processor The root message processing service, it makes decisions
	 * on message validity and forwards valid messages to other services for processing.
	 */
	constructor(
		private readonly config: AppConfiguration, 
		private readonly mirror: MirrorClientService,
		private readonly processor: HcsMessageProcessingService) { }
	/**
	 * The root method call initiating the HCS message listening process,
	 * the `Timeout` attribute instructs the NestJS framework to call this
	 * message upon startup.  When called, it connects to the identified
	 * Hedera Mirror Node and requests the message stream for the
	 * configured topic.  It will attempt to reconnect if/when disconnected.
	 */
	@Timeout(2500)
	async processHcsMessages(): Promise<void> {
		const consensusStartTime = await this.computeStreamStartingTimestamp();
		const consensusStartKeystring = timestamp_to_keyString(consensusStartTime);
		this.logger.log(`Starting HCS Topic Listener at ${consensusStartKeystring}`);
		this.processor.setStartupTimestamp(consensusStartKeystring);
		const topicQuery = ConsensusTopicQuery.encode(
			ConsensusTopicQuery.fromPartial({
				topicID: keyString_to_topicID(this.config.hcsTopic as EntityIdKeyString),
				consensusStartTime,
			}),
		).finish();
		const credentials = this.config.mirrorGrpc.endsWith(':443') ? ChannelCredentials.createSsl() : ChannelCredentials.createInsecure();
		const call = new Client(this.config.mirrorGrpc, credentials)
			.makeServerStreamRequest(
				'/com.hedera.mirror.api.proto.ConsensusService/subscribeTopic',
				(query) => Buffer.from(query),
				ConsensusTopicResponse.decode,
				topicQuery,
			)
			.on('data', this.onData.bind(this))
			.on('status', this.onFinished.bind(this))
			.on('error', this.onError.bind(this));
		this.heartbeatTimer = setInterval(this.onHeartbeat.bind(this), HEARTBEAT_INTERVAL);
		this.reconnectTimer = setTimeout(() => call.cancel(), RECONNECT_INTERVAL);
	}
	/**
	 * Processes messages that are received from the mirror node,
	 * dispatching them to the root processing pipeline service.
	 *
	 * @param hcsMessage The raw message received from the mirror node.
	 */
	private onData(hcsMessage: ConsensusTopicResponse): void {
		this.sequenceNumber = hcsMessage.sequenceNumber;
		this.processor.processMessage(hcsMessage);
	}
	/**
	 * Processes error messages from the mirror node stream.
	 * Presently only logs errors.
	 *
	 * @param error error details.
	 */
	private onError(error: any): void {
		if(error.code !== 1) {
			this.logger.error('Topic Subscription Error', error);
		}
	}
	/**
	 * Periodically invoked to generate a `heartbeat` message to
	 * the pipeline to potentially invoke certain background processing
	 * processes.
	 */
	private async onHeartbeat() {
		this.processor.processHeartbeat();
	}
	/**
	 * Invoked when the mirror node gRPC topic stream terminates for any
	 * reason.  When this happens, the process sets a timer to attempt
	 * a re-connect as this is an always-on service message processing
	 * loop.  It also turns off heartbeat method calls while offline.
	 *
	 * @param details An explanation for why the stream has closed.
	 */
	private onFinished(details: any): void {
		if (this.heartbeatTimer) {
			clearInterval(this.heartbeatTimer);
			this.heartbeatTimer = null;
		}
		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer);
			this.reconnectTimer = null;
		}
		if(details.code !== 1) {
			this.logger.log('Topic Subscription Unexpectedly Finished', details);
		}
		setTimeout(this.processHcsMessages.bind(this), RECONNECT_WAIT_INTERVAL);
	}
	/**
	 * Helper function that computes the desired timestamp filter when 
	 * connecting to the HCS message grpc stream.  If starting for the first
	 * time it returns that latest of the global configuration or a nanosecond
	 * after the first message's consensus timestamp (which is the HCS voting
	 * stream's configuration message by definition).  
	 * 
	 * If this is a reconnect after having processed one or more other messages 
	 * it returns the the latest of the global configuration or a nanosecond after
	 * the latest HCS message's consensus timestamp processed by this handler.
	 */
	private async computeStreamStartingTimestamp() {
		const latestMessage = await this.mirror.waitForHcsMessageInfo(this.sequenceNumber);
		const timestamp = keyString_to_timestamp(latestMessage.consensus_timestamp as TimestampKeyString);
		if(timestamp.nanos < 999999999 ) {
			timestamp.nanos = timestamp.nanos + 1;
		} else {
			timestamp.seconds = timestamp.seconds + 1;
			timestamp.nanos = 0;
		}
		const envTimestamp = keyString_to_timestamp(this.config.hcsStartDate);
		if(envTimestamp.seconds > timestamp.seconds) {
			return envTimestamp;
		} else if(timestamp.seconds > envTimestamp.seconds) {
			return timestamp;
		} else if(envTimestamp.nanos > timestamp.nanos) {
			return envTimestamp;
		}
		return timestamp;
	}
}
