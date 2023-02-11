import {
	date_to_keyString,
	EntityIdKeyString,
	is_entity_id,
	is_timestamp,
	keyString_to_timestamp,
	TimestampKeyString,
	timestamp_to_keyString,
} from '@bugbytes/hapi-util';
import { MirrorError, MirrorRestClient } from '@bugbytes/hapi-mirror';
import { ConfigService } from '@nestjs/config';
import { TokenSummary } from './token-summary';
import { Logger } from '@nestjs/common';
import { RulesDefinition } from './rules-definition';
/**
 * Service instance that parses and validates configuration information
 * used during startup and for other system functions.
 */
export class AppConfiguration {
	/**
	 * A short title describing this HCS voting stream.
	 */
	public readonly title: string;
	/**
	 * A short description of the purpose of this HCS voting stream.
	 */
	public readonly description: string;
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
	 * The Voting Token Information.
	 */
	public readonly hcsToken: TokenSummary;
	/**
	 * The consensus time at which to start processing HCS messages.
	 */
	public readonly hcsStartDate: TimestampKeyString;
	/**
	 * The minimum fraction of eligible balance that must vote for or
	 * against a proposal.  (the sum of the balance of ineligible
	 * accounts does not count in the quorum computation).
	 *
	 * Each proposal definition may, in turn, specify a higher threshold
	 * value than what is specified here, but may not specify a value
	 * lower than what is defined here.  If a proposal does not specify
	 * a threshold value in its definition, the value defined here will
	 * apply.
	 */
	public readonly minVotingThreshold: number;
	/**
	 * An array of crypto and/or contract accounts that are not allowed to
	 * participate in voting.  The proposals threshold will not consider
	 * their balances when computing quorom requirements.  The HCS
	 * protocol allows each proposal to define a a list of inelegible
	 * accounts in addition to what is defined here for each proposed ballot.
	 * The resulting list of inelegible accounts will be the union of
	 * the two lists.
	 */
	public readonly ineligibleAccounts: EntityIdKeyString[];
	/**
	 * The list of contracts or accounts that are allowed to
	 * post ballot proposals into this stream.  If specified, only
	 * ballot proposal definitions posted by accounts in this list
	 * will be considered valid.  Validators must reject ballot
	 * proposals not created by one of these listed accounts (in
	 * other words, one of these accounts must be the payer of
	 * the transaction submitting the HCS create ballot message)
	 *
	 * An empty list indicates that any account or contract may
	 * create a ballot for this voting stream.
	 */
	public readonly ballotCreators: EntityIdKeyString[];
	/**
	 * The minimum voting window allowed (in days) for a ballot
	 * proposal to be considered valid.  If not specified the
	 * creator of the ballot may specify any voting window as
	 * small or large as desired.
	 */
	public readonly minimumVotingPeriod: number;
	/**
	 * The minimum standoff for the beginning a voting window
	 * (in days) from the creation of a ballot.  If not specified
	 * a ballot window can open immediately upon creation of
	 * a proposal ballot, otherwise to be considered valid,
	 * the ballot's voting start period must be at least the
	 * specified abount of days after the creation of the ballot.
	 */
	public readonly minimumStandoffPeriod: number;
}
/**
 * Loads the configuration properties for this HCS voting stream.
 * Retrieves the HCS mirror gRPC endpoint (MIRROR_GRPC), mirror
 * REST endpoint (MIRROR_REST) and the HCS topic (HCS_TOPIC), and
 * optional starting time filter (HCS_START_DATE) from the environment.
 * The method retrieves the remainder of the voting stream configuration
 * from message one of the HCS topic.  If the first message of the
 * stream is not identifiable as a configuration message, an error is
 * thrown.  This is intended to cause server startup to fail as the
 * process can not validate ballots and votes without configuration rules.
 *
 * @param configService The nestjs configuration service providing access
 * to the proper environmental variables.
 * 
 * @returns the application configuration.
 */
export async function loadAppConfiguration(configService: ConfigService): Promise<AppConfiguration> {
	const logger = new Logger(AppConfiguration.name);
	try {
		logger.log('Loading Configuration from Environment');
		const mirrorGrpc = configService.get<string>('MIRROR_GRPC');
		const mirrorRest = configService.get<string>('MIRROR_REST');
		const hcsTopic = configService.get<string>('HCS_TOPIC');
		if (!is_entity_id(hcsTopic)) {
			throw new Error('Invalid HCS Topic in configuration.');
		}
		const client = new MirrorRestClient(mirrorRest);
		const rules = await getRules();
		const hcsToken = await getHcsTokenInfo();

		const title = rules.title || hcsToken.symbol;
		const description = rules.description || hcsToken.name;
		const hcsStartDate = computeStartDateFilter();
		const ineligibleAccounts = verifyAccountList(rules.ineligibleAccounts);
		const ballotCreators = verifyAccountList(rules.ballotCreators);
		const minVotingThreshold = verifyMinVotingThreshold();
		const minimumVotingPeriod = verifyMinimumVotingPeriod();
		const minimumStandoffPeriod = verifyMinimumStandoffPeriod();

		// For good measure, echo the computed
		// configuration into the startup log
		// to help troubleshooting when thing
		// don't work as expected.
		logger.log(`Configuration Loaded`);
		logger.log(`Title: ${title}`);
		logger.log(`Description: ${description}`);
		logger.log(`HCS Topic: ${hcsTopic}`);
		logger.log(`Voting Token: ${hcsToken.id}`);
		if(hcsStartDate !== "0.0") {
			logger.log(`Starting Timestamp: ${hcsStartDate}`);
		} else {
			logger.log('Starting Timestamp: none, replay entier stream');
		}
		logger.log(`Ballot Creators: ${ballotCreators.length > 0 ? ballotCreators : 'any account may submit a proposal'}`);
		logger.log(`Ineligible Accounts: ${ineligibleAccounts.length > 0 ? ineligibleAccounts : 'none, all accounts may vote'}`);
		logger.log(`Minimum Voting Threshold: ${minVotingThreshold > 0 ? minVotingThreshold.toString() : 'no quoroum required'}`);
		logger.log(`Minimum Voting Period (days): ${minimumVotingPeriod > 0 ? minimumVotingPeriod.toString() : 'any length'}`);
		logger.log(`Minimum Standoff Period (days): ${minimumStandoffPeriod > 0 ? minimumStandoffPeriod.toString() : 'no limit'}`);
		logger.log(`GRPC Mirror Endpoint: ${mirrorGrpc}`);
		logger.log(`REST Mirror Endpoint: ${mirrorRest}`);

		return {
			title,
			description,
			mirrorGrpc,
			mirrorRest,
			hcsTopic,
			hcsToken,
			hcsStartDate,
			minVotingThreshold,
			ineligibleAccounts,
			ballotCreators,
			minimumVotingPeriod,
			minimumStandoffPeriod,
		};
		/**
		 * Helper function to retrieve the defined rules for this HCS voting stream.
		 * To be valid, the rules definition must be placed as the first message in
		 * the stream and must conform to the `RulesDefinition` schema.
		 */
		async function getRules(): Promise<RulesDefinition> {
			logger.log(`Retrieving rules configuration for hcs stream ${hcsTopic}.`);
			const firstMessage = await getFirstMessage();
			if (!firstMessage.message) {
				throw new Error('First message in topic does not appear to define the voting rules, it is empty.');
			}
			const rules = extractPayload();
			if (rules.type !== 'define-rules') {
				throw new Error('First message in topic does not appear to define the voting rules.');
			}
			return rules;
			/**
			 * Attempts to retrieve the first message in an HCS
			 * message stream, if it exists.
			 */
			async function getFirstMessage() {
				try {
					return await client.getMessage(hcsTopic as EntityIdKeyString, 1);
				} catch (ex) {
					if (ex instanceof MirrorError && ex.status === 400) {
						throw new Error(`Topic ${hcsTopic} does not contain a configuration message.`);
					}
					throw ex;
				}
			}
			/**
			 * Attempts to extract the Rules Definition from the base64
			 * encoded HCS message payload.
			 */
			function extractPayload(): RulesDefinition {
				try {
					const jsonMessage = Buffer.from(firstMessage.message, 'base64');
					return JSON.parse(jsonMessage.toString('ascii')) as RulesDefinition;
				} catch (ex) {
					if (ex instanceof SyntaxError) {
						throw new Error('First message in topic does not appear to define the voting rules, it is not parsable.');
					}
					throw ex;
				}
			}
		}
		/**
		 * Helper function that queries the designated REST Mirror node for
		 * information describing the HCS token representing voting weights.
		 */
		async function getHcsTokenInfo(): Promise<TokenSummary> {
			logger.log(`Retrieving information for voting token ${rules.tokenId}.`);
			if (!rules.tokenId) {
				throw new Error('Voting Token ID is missing from configuration.');
			}
			if (!is_entity_id(rules.tokenId)) {
				throw new Error(`The value ${rules.tokenId} is not a valid token ID.`);
			}
			try {
				const record = await client.getTokenInfo(rules.tokenId);
				return {
					id: record.token_id as unknown as EntityIdKeyString,
					symbol: record.symbol,
					name: record.name,
					decimals: parseInt(record.decimals, 10),
					circulation: parseInt(record.total_supply, 10),
					modified: record.modified_timestamp as unknown as TimestampKeyString,
				};
			} catch (ex) {
				if (ex instanceof MirrorError && ex.status === 404) {
					throw new Error(`Voting Token with id ${hcsTopic} does not appear to exist.`);
				}
				throw ex;
			}
		}
		/**
		 * Helper function that computes the starting date/time filter for the processing
		 * the HCS voting stream, it is the later of either the time of message one
		 * (the configuration) or (if specified) the time designated in the environment
		 * variable (HCS_START_DATE).  The system will ignore all ballots created before
		 * the computed starting filter time.
		 */
		function computeStartDateFilter(): TimestampKeyString {
			const override = configService.get<string>('HCS_START_DATE');
			if (override) {
				if (!is_timestamp(override)) {
					throw new Error('Invalid HCS Starting Date in configuration.');
				}
				if (override > date_to_keyString(new Date())) {
					throw new Error('Invalid HCS Starting Date, value can not be in the future.');
				}
				return override;
			}
			return "0.0";
		}
		/**
		 * Helper function that examines a list of addresses to ensure
		 * they conform to the 0.0.123 hedera addressing format.
		 */
		function verifyAccountList(accounts: string[] | null | undefined): EntityIdKeyString[] {
			if (!accounts) {
				return [];
			}
			if (Array.isArray(accounts)) {
				for (const account of accounts) {
					if (!is_entity_id(account)) {
						throw new Error(`${account} is not a valid account id.`);
					}
				}
				return accounts as EntityIdKeyString[];
			}
			throw new Error(`${JSON.stringify(accounts)} is not a valid list of account ids.`);
		}
		/**
		 * Helper function that validates the minimum voting threshold
		 * value (if specified), returns zero if not specified.
		 */
		function verifyMinVotingThreshold(): number {
			if (!rules.minVotingThreshold) {
				return 0;
			}
			if (Number.isNaN(rules.minVotingThreshold)) {
				throw new Error(`${rules.minVotingThreshold} is not a valid voting threshold value.`);
			}
			if (rules.minVotingThreshold < 0 || rules.minVotingThreshold > 1) {
				throw new Error('Voting threshold must be within the range of zero to one inclusive.');
			}
			return rules.minVotingThreshold;
		}
		/**
		 * Helper function that validates the minimum voting period
		 * (if specified), returns zero if not specified.
		 */
		function verifyMinimumVotingPeriod(): number {
			if (!rules.minimumVotingPeriod) {
				return 0;
			}
			if (Number.isNaN(rules.minimumVotingPeriod)) {
				throw new Error(`${rules.minimumVotingPeriod} is not a valid minimum voting period.`);
			}
			if (rules.minimumVotingPeriod < 0) {
				throw new Error('If specified, the minimum voting period must be non negative.');
			}
			return rules.minimumVotingPeriod;
		}
		/**
		 * Helper function that validates the minimum stand-off period
		 * (if specified), returns zero if not specified.
		 */
		function verifyMinimumStandoffPeriod(): number {
			if (!rules.minimumStandoffPeriod) {
				return 0;
			}
			if (Number.isNaN(rules.minimumStandoffPeriod)) {
				throw new Error(`${rules.minimumStandoffPeriod} is not a valid voting starting standoff period.`);
			}
			if (rules.minimumStandoffPeriod < 0) {
				throw new Error('If specified, the voting starting standoff period must be non negative.');
			}
			return rules.minimumStandoffPeriod;
		}
	} catch (configError) {
		logger.error('Loading Configuration Failed.', configError);
		throw configError;
	}
}
