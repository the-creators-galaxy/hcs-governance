import { date_to_keyString, EntityIdKeyString, is_entity_id, is_timestamp, TimestampKeyString } from '@bugbytes/hapi-util';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/**
 * Service instance that parses and validates configuration information
 * used during startup and for other system functions.
 */
@Injectable()
export class NetworkConfigurationService {
	/**
	 * The service's logger instance.
	 */
	private readonly logger = new Logger(NetworkConfigurationService.name);
	/**
	 * The Mirror Node’s gRPC endpoint.
	 */
	public readonly mirrorGrpc: string;
	/**
	 * The Mirror Node’s REST API endpoint.
	 */
	public readonly mirrorRest: string;
	/**
	 * The HCS Topic message stream source, in 0.0.123 format.
	 */
	public readonly hcsTopic: EntityIdKeyString;
	/**
	 * The Voting Token Address, in 0.0.123 format.
	 */
	public readonly hcsToken: EntityIdKeyString;
	/**
	 * The consensus time at which to start processing HCS messages.
	 */
	public readonly hcsStartDate: TimestampKeyString;
	/**
	 * A list of accounts that may not vote for or against a proposal.
	 * (only relevant when creating proposals)
	 */
	public readonly ineligibleAccounts: EntityIdKeyString[];
	/**
	 * The fraction of eligible balance that must vote for or
	 * against a proposal.  (the sum of the balance of ineligible
	 * accounts does not count in the quorum computation)  This
	 * value is only used when creating new ballots.
	 */
	public readonly minVotingThreshold: number;
	/**
	 * Public constructor, called by the NextJS runtime dependency
	 * injection services.  Validates basic configuration variables,
	 * throwing an error if any portion of the configuration is invalid
	 * (which should bubble up and cause process startup errors).
	 *
	 * @param configService Environmental configuration service provided
	 * by the NestJS framework, contains the configuration to be examined
	 * and parsed.
	 */
	constructor(configService: ConfigService) {
		const errors = [];
		this.mirrorGrpc = configService.get<string>('MIRROR_GRPC');
		this.mirrorRest = configService.get<string>('MIRROR_REST');
		const hcsTopic = configService.get<string>('HCS_TOPIC');
		if (is_entity_id(hcsTopic)) {
			this.hcsTopic = hcsTopic;
		} else {
			errors.push('Invalid HCS Topic in configuration.');
		}
		const hcsToken = configService.get<string>('HTS_TOKEN');
		if (is_entity_id(hcsToken)) {
			this.hcsToken = hcsToken;
		} else {
			errors.push('Invalid HCS Token in configuration.');
		}
		const hcsStartDate = configService.get<string>('HCS_START_DATE');
		if (!hcsStartDate) {
			this.hcsStartDate = undefined;
		} else if (!is_timestamp(hcsStartDate)) {
			errors.push('Invalid HCS Starting Date in configuration.');
		} else if (this.hcsStartDate > date_to_keyString(new Date())) {
			errors.push('Invalid HCS Starting Date, value can not be in the future.');
		} else {
			this.hcsStartDate = hcsStartDate;
		}
		if (errors.length > 0) {
			throw Error(`Invalid Configuration: ${errors.join(', ')}`);
		}
		const minVotingThreshold = configService.get<number>('MIN_VOTING_THRESHOLD');
		if (!minVotingThreshold) {
			this.minVotingThreshold = 0;
		} else if (isNaN(minVotingThreshold) || minVotingThreshold < 0 || minVotingThreshold > 1) {
			errors.push('Invalid Minimum Voting Threshold, must be a fraction between 0 and 1.0 inclusive.');
		} else {
			this.minVotingThreshold = minVotingThreshold;
		}
		const ineligibleAccountsList = configService.get<string>('INELEGIBLE_ACCOUNTS');
		if (ineligibleAccountsList) {
			const accounts = ineligibleAccountsList.split(',').map((w) => w.trim());
			const list: EntityIdKeyString[] = [];
			for (const account of accounts) {
				if (is_entity_id(account)) {
					list.push(account);
				} else {
					errors.push('Found invalid account id in list of inelegible accounts.');
					break;
				}
			}
			this.ineligibleAccounts = list.length === accounts.length ? list : [];
		} else {
			this.ineligibleAccounts = [];
		}
		if (errors.length > 0) {
			throw Error(`Invalid Configuration: ${errors.join(', ')}`);
		}
		this.logger.log('Network Configuration Parsed Successfully.');
		this.logger.log(`Mirror Node GRPC: ${this.mirrorGrpc}`);
		this.logger.log(`Mirror Node REST: ${this.mirrorRest}`);
		this.logger.log(`HCS Topic: ${this.hcsTopic}`);
		this.logger.log(`HTS Token: ${this.hcsToken}`);
		this.logger.log(`Minimum Voting Threshold: ${this.minVotingThreshold || 'No Minimum Threshold Required'}`);
		this.logger.log(`Ineligible Accounts: ${this.ineligibleAccounts.length > 0 ? this.ineligibleAccounts.join(', ') : 'None specified, all may vote.'}`);
		this.logger.log(`HTS Starting Date: ${this.hcsStartDate || 'Read Entire HCS Stream'}`);
		this.logger.log(`API Service Port: ${process.env.PORT || 80}`);
	}
}
