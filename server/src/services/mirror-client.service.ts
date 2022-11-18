import { Injectable, Logger } from '@nestjs/common';
import { NetworkConfigurationService } from './network-configuration.service';
import { MessageInfo, MirrorError, MirrorRestClient, TokenBalanceInfo } from '@bugbytes/hapi-mirror';
import { EntityIdKeyString, TimestampKeyString } from '@bugbytes/hapi-util';
import { TokenSummary } from 'src/models/token-summary';
/**
 * Provides various methods for retrieving information from a remote
 * Hedera Mirror Node REST API.
 */
@Injectable()
export class MirrorClientService {
	/**
	 * The service's logger instance.
	 */
	private readonly logger = new Logger(MirrorClientService.name);
	/**
	 * A common mirror node rest client.
	 */
	private readonly client: MirrorRestClient;
	/**
	 * Public constructor, called by the NextJS runtime dependency injection services.
	 *
	 * @param network The network configuration service, providing configuration details
	 * such as the id of the voting token.
	 */
	constructor(private readonly network: NetworkConfigurationService) {
		this.client = new MirrorRestClient(this.network.mirrorRest);
	}
	/**
	 * Retrieves the token information for the token identified in the
	 * system-wide configuration.
	 *
	 * @returns A `TokenSummary` object describing the voting token to be
	 * used in processing.  If not found, an error is raised.
	 */
	async getHcsTokenSummary(timestamp: TimestampKeyString | undefined = undefined): Promise<TokenSummary> {
		const record = await this.client.getTokenInfo(this.network.hcsToken as unknown as EntityIdKeyString, timestamp);
		return {
			id: record.token_id as unknown as EntityIdKeyString,
			symbol: record.symbol,
			name: record.name,
			decimals: parseInt(record.decimals, 10),
			circulation: parseInt(record.total_supply, 10),
			modified: record.modified_timestamp as unknown as TimestampKeyString,
		};
	}
	/**
	 * Retrieves the corresponding mirror node record for a given HCS
	 * message by its configured topic and given sequence.  Assumes
	 * the message exists and will wait for the mirror node to have
	 * the information before returning (within reason).
	 *
	 * @param sequenceNumber The sequence number of the HCS message to
	 * retrieve.  The system-wide configuration identifies which topic
	 * is queried.
	 *
	 * @returns The HCS Message Mirror Record information if found,
	 * otherwise an error is raised after a reasonable wait.
	 */
	async waitForHcsMessageInfo(sequenceNumber: number): Promise<MessageInfo> {
		let count = 0;
		while (true) {
			try {
				return await this.client.getMessage(this.network.hcsTopic as unknown as EntityIdKeyString, sequenceNumber);
			} catch (ex) {
				count++;
				if (ex instanceof MirrorError && ex.status === 404 && count < 30) {
					this.logger.verbose(`HCS Message no. ${sequenceNumber} for topic ${this.network.hcsTopic} is not yet available, will Retry.`);
					await new Promise((resolve) => setTimeout(resolve, 7000));
				} else {
					this.logger.error(
						`Error fetching HCS Message no. ${sequenceNumber} for topic ${this.network.hcsTopic}, failed with code: ${ex.status || ex.message}`,
					);
					throw ex;
				}
			}
		}
	}
	/**
	 * Retrieves the token balance at the specified time for a given account.
	 *
	 * @param accountId The associated account identifier.
	 *
	 * @param tokenId The associated token identifier.
	 *
	 * @param timestamp The timestamp at which the balance value is requested.
	 *
	 * @returns The latest known token balance (and the timestamp of the
	 * balance) for the specified account occurring before the specified
	 * input timestamp value.
	 */
	async getTokenBalance(accountId: EntityIdKeyString, tokenId: EntityIdKeyString, timestamp: TimestampKeyString): Promise<TokenBalanceInfo> {
		try {
			return await this.client.getTokenBalance(accountId, tokenId, timestamp);
		} catch (ex) {
			return { timestamp, account: accountId, token: tokenId, balance: 0 };
		}
	}
	/**
	 * Retrieves the latest consensus timestamp known by the ledger
	 * (the consensus timestamp of the very latest recorded transaction).
	 *
	 * @returns The latest known consensus timestamp,
	 * in Hedera Epoch string form (0000.0000).
	 */
	async getLatestTransactionTimestamp(): Promise<TimestampKeyString> {
		return (await this.client.getLatestTransaction()).consensus_timestamp as unknown as TimestampKeyString;
	}
	/**
	 * Retrieves the latest message timestamp for the system-wide
	 * configured HCS topic (the consensus timestamp of the last
	 * HCS message in the topic).
	 *
	 * @returns The consensus timestamp for the last message in the
	 * topic, in Hedera Epoch string form (0000.0000).
	 */
	async getLatestMessageTimestamp(): Promise<TimestampKeyString> {
		return (await this.client.getLatestMessage(this.network.hcsTopic as unknown as EntityIdKeyString)).consensus_timestamp as unknown as TimestampKeyString;
	}
}
