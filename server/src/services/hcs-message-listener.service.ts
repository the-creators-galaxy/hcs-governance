import { Injectable, Logger } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';
import { Client, ChannelCredentials } from '@grpc/grpc-js';
import * as proto from '@hashgraph/proto';
import { NetworkConfigurationService } from './network-configuration.service';
import { topicIdFromString } from 'src/util/proto';
import { HcsMessageProcessingService } from './hcs-message-processing.service';
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
	 * Public constructor, called by the NextJS runtime dependency services.
	 *
	 * @param network The network configuration service, providing configuration details
	 * such as the id of the voting token.
	 *
	 * @param processor The root message processing service, it makes decisions
	 * on message validity and forwards valid messages to other services for processing.
	 */
	constructor(private readonly network: NetworkConfigurationService, private readonly processor: HcsMessageProcessingService) {}
	/**
	 * The root method call initiating the HCS message listening process,
	 * the `Timeout` attribute instructs the NestJS framework to call this
	 * message upon startup.  When called, it connects to the identified
	 * Hedera Mirror Node and requests the message stream for the
	 * configured topic.  It will attempt to reconnect if/when disconnected.
	 */
	@Timeout(2500)
	processHcsMessages(): void {
		this.logger.log('Starting HCS Topic Listener');
		const topicQuery = proto.com.hedera.mirror.api.proto.ConsensusTopicQuery.encode({
			topicID: topicIdFromString(this.network.hcsTopic),
			consensusStartTime: { seconds: null },
			consensusEndTime: null,
			limit: null,
		}).finish();
		const credentials = this.network.mirrorGrpc.endsWith(':443') ? ChannelCredentials.createSsl() : ChannelCredentials.createInsecure();
		new Client(this.network.mirrorGrpc, credentials)
			.makeServerStreamRequest(
				'/com.hedera.mirror.api.proto.ConsensusService/subscribeTopic',
				(query) => Buffer.from(query),
				proto.com.hedera.mirror.api.proto.ConsensusTopicResponse.decode,
				topicQuery,
			)
			.on('data', this.onData.bind(this))
			.on('status', this.onFinished.bind(this))
			.on('error', this.onError.bind(this));
		this.heartbeatTimer = setInterval(this.onHeartbeat.bind(this), 600000);
	}
	/**
	 * Processes messages that are received from the mirror node,
	 * dispatching them to the root processing pipeline service.
	 *
	 * @param hcsMessage The raw message received from the mirror node.
	 */
	private onData(hcsMessage: proto.com.hedera.mirror.api.proto.ConsensusTopicResponse): void {
		this.processor.processMessage(hcsMessage);
	}
	/**
	 * Processes error messages from the mirror node stream.
	 * Presently only logs errors.
	 *
	 * @param error error details.
	 */
	private onError(error: any): void {
		this.logger.error('Topic Subscription Error', error);
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
		this.logger.log('Topic Subscription Unexpectedly Finished', details);
		setTimeout(this.processHcsMessages.bind(this), 10000);
	}
}
