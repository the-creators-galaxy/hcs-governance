import { TimestampKeyString } from '@bugbytes/hapi-util';
import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { Ballot } from './models/ballot';
import { TokenSummary } from './models/token-summary';
import { Votes } from './models/vote';
import { DataService } from './services/data.service';
import { NetworkConfigurationService } from './services/network-configuration.service';
/**
 * The central API App controller for this service.
 */
@Controller('api/v1')
export class AppController {
	/**
	 * Public constructor, called by the NextJS runtime dependency injection services.
	 *
	 * @param config Contains the configuration of the service, such as the Topic to
	 * monitor mirror node endpoint addresses.
	 *
	 * @param tokenSummary Details of the voting token.
	 *
	 * @param dataService The central data storage service, containing the listing
	 * of proposal ballots and votes.
	 */
	constructor(private readonly config: NetworkConfigurationService, private readonly tokenSummary: TokenSummary, private readonly dataService: DataService) {}
	/**
	 * @returns basic public configuration information for this service and the
	 * latest known timestamp, useful for displaying in the user interface.
	 */
	@Get('info')
	getInfo(): any {
		return {
			mirrorGrpc: this.config.mirrorGrpc,
			mirrorRest: this.config.mirrorRest,
			htsToken: this.tokenSummary,
			hcsTopic: this.config.hcsTopic,
			hcsStartDate: this.config.hcsStartDate,
			lastUpdated: this.dataService.getLastUpdated(),
			ineligible: this.config.ineligibleAccounts,
			threshold: this.config.minVotingThreshold,
			version: process.env.npm_package_version || 'unknown',
		};
	}
	/**
	 * @returns the list of ballots known by this system.
	 */
	@Get('ballots')
	async getBallots(): Promise<Ballot[]> {
		return await this.dataService.getBallots();
	}
	/**
	 * @param ballotId id of the ballot to retrieve.
	 *
	 * @returns Returns the details of a given ballot by id, including votes and tallies (if known).
	 */
	@Get('ballots/:ballotId')
	async getBallot(@Param('ballotId') ballotId: TimestampKeyString): Promise<(Ballot & Votes) | undefined> {
		const result = await this.dataService.getBallotAndVotes(ballotId);
		if (result) {
			return result;
		}
		throw new NotFoundException();
	}
}
