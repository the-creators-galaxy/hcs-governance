import { request, Agent } from 'https';
import { Injectable, Logger } from '@nestjs/common';
import { NetworkConfigurationService } from './network-configuration.service';
import { HcsMessageMirrorRecord } from 'src/models/hcs-message-mirror-record';
import { TokenInfo } from 'src/models/token-info';
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
	 * A common http agent configured with `keepalive` to true, this attempts
	 * to reduce the I/O burden on the mirror node, increasing the reliability
	 * of connection.
	 */
	private readonly agent = new Agent({ keepAlive: true });
	/**
	 * Public constructor, called by the NextJS runtime dependency injection services.
	 *
	 * @param network The network configuration service, providing configuration details
	 * such as the id of the voting token.
	 */
	constructor(private readonly network: NetworkConfigurationService) {}
	/**
	 * Retrieves the token information for the token identified in the
	 * system-wide configuration.
	 *
	 * @returns A `TokenInfo` object describing the voting token to be
	 * used in processing.  If not found, an error is raised.
	 */
	async getHcsTokenInfo(): Promise<TokenInfo> {
		const options = {
			hostname: this.network.mirrorRest,
			path: `/api/v1/tokens/${this.network.hcsToken}`,
			method: 'GET',
			agent: this.agent,
		};
		const data = await this.executeRequestWithRetry(options);
		const json = JSON.parse(data.toString('ascii'));
		return {
			id: this.network.hcsToken,
			symbol: json.symbol,
			name: json.name,
			decimals: parseInt(json.decimals, 0),
		};
	}
	/**
	 * Retrieves the corresponding mirror node record for a given HCS
	 * message by its configured topic and given sequence.
	 *
	 * @param sequenceNumber The sequence number of the HCS message to
	 * retrieve.  The system-wide configuration identifies which topic
	 * is queried.
	 *
	 * @returns The HCS Message Mirror Record information if found,
	 * otherwise an error is raised.
	 */
	async getHcsMessageInfo(sequenceNumber: Long): Promise<HcsMessageMirrorRecord> {
		const options = {
			hostname: this.network.mirrorRest,
			path: `/api/v1/topics/${this.network.hcsTopic}/messages/${sequenceNumber}`,
			method: 'GET',
			agent: this.agent,
		};
		const data = await this.executeRequestWithRetry(options);
		return JSON.parse(data.toString('ascii'));
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
	async getTokenBalance(accountId: string, tokenId: string, timestamp: string): Promise<{ timestamp: string; balance: number }> {
		const options = {
			hostname: this.network.mirrorRest,
			path: `/api/v1/tokens/${tokenId}/balances?account.id=${accountId}&timestamp=lte:${timestamp}`,
			method: 'GET',
			agent: this.agent,
		};
		const data = await this.executeRequestWithRetry(options);
		const json = JSON.parse(data.toString('ascii'));
		if (json.balances && json.balances.length === 1) {
			return {
				timestamp: json.timestamp,
				balance: json.balances[0].balance,
			};
		}
		return {
			timestamp,
			balance: 0,
		};
	}
	/**
	 * Retrieves the latest consensus timestamp known by the ledger
	 * (the consensus timestamp of the very latest recorded transaction).
	 *
	 * @returns The latest known consensus timestamp,
	 * in Hedera Epoch string form (0000.0000).
	 */
	async getLatestTransactionTimestamp(): Promise<string> {
		const options = {
			hostname: this.network.mirrorRest,
			path: '/api/v1/transactions?limit=1&order=desc',
			method: 'GET',
			agent: this.agent,
		};
		const data = await this.executeRequestWithRetry(options);
		const json = JSON.parse(data.toString('ascii'));
		return json.transactions && json.transactions.length > 0 ? json.transactions[0].consensus_timestamp : '0.0';
	}
	/**
	 * Retrieves the latest message timestamp for the system-wide
	 * configured HCS topic (the consensus timestamp of the last
	 * HCS message in the topic).
	 *
	 * @returns The consensus timestamp for the last message in the
	 * topic, in Hedera Epoch string form (0000.0000).
	 */
	async getLatestMessageTimestamp(): Promise<string> {
		const options = {
			hostname: this.network.mirrorRest,
			path: `/api/v1/topics/${this.network.hcsTopic}/messages?limit=1&order=desc`,
			method: 'GET',
			agent: this.agent,
		};
		const data = await this.executeRequestWithRetry(options);
		const json = JSON.parse(data.toString('ascii'));
		return json.messages && json.messages.length > 0 ? json.messages[0].consensus_timestamp : '0.0';
	}
	/**
	 * Internal helper function that performs the actual REST API call to
	 * the mirror node.  It assumes input values are 'correct' such that
	 * it will retry the request upon any failure for set number of tries
	 * before raising an error.
	 *
	 * @param options The http request options of the request.
	 *
	 * @returns A buffer object containing the data returned from the request,
	 * or an error is thrown for non 200 responses.
	 */
	private async executeRequestWithRetry(options): Promise<Buffer> {
		let code;
		let data;
		for (let i = 0; i < 30; i++) {
			({ code, data } = await executeRequest(options));
			if (code === 200) {
				return data;
			} else if (code === 404) {
				this.logger.verbose(`${options.path} Not Available, will Retry.`);
				await new Promise((resolve) => setTimeout(resolve, 7000));
			}
		}
		this.logger.error(`Fetching mirror data failed with code: ${code}`);
		throw new Error(`Received error code: ${code}`);
	}
}
/**
 * Low level helper function implementing the call to the REST API.
 *
 * @param options HTTP options sent in from calling code.
 *
 * @returns An object containing the HTTP code returned (typically 200)
 * and the data from the body of the returned message.
 */
function executeRequest(options): Promise<{ code: number; data: Buffer }> {
	const data = [];
	return new Promise((resolve, reject) => {
		const req = request(options, (res) => {
			res.on('data', (chunk) => {
				data.push(chunk);
			});
			res.on('end', () => resolve({ code: res.statusCode, data: Buffer.concat(data) }));
		});
		req.on('error', (e) => reject(e));
		req.end();
	});
}
