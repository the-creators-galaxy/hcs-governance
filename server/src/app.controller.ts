import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { Ballot } from './models/ballot';
import { TokenInfo } from './models/token-info';
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
	 * @param tokenInfo Details of the voting token.
	 *
	 * @param dataService The central data storage service, containing the listing
	 * of proposal ballots and votes.
	 */
	constructor(
		private readonly config: NetworkConfigurationService,
		private readonly tokenInfo: TokenInfo,
		private readonly dataService: DataService,
	) {}
	/**
	 * @returns basic public configuration information for this service and the
	 * latest known timestamp, useful for displaying in the user interface.
	 */
	@Get('info')
	getInfo(): any {
		return {
			mirrorGrpc: this.config.mirrorGrpc,
			mirrorRest: this.config.mirrorRest,
			htsToken: this.tokenInfo,
			hcsTopic: this.config.hcsTopic,
			hcsStartDate: this.config.hcsStartDate,			
			lastUpdated: this.dataService.getLastUpdated(),
			version: process.env.npm_package_version || 'unknown',
		};
	}
	/**
	 * @returns the list of ballots known by this system.
	 */
	@Get('ballots')
	getBallots(): Ballot[] {
		return this.dataService.getBallots();
	}
	/**
	 * @param ballotId id of the ballot to retrieve.
	 *
	 * @returns Returns the details of a given ballot by id, including votes and tallies (if known).
	 */
	@Get('ballots/:ballotId')
	getBallot(@Param('ballotId') ballotId: string): (Ballot & Votes) | undefined {
		const ballot = this.dataService.getBallot(ballotId);
		if (ballot) {
			const votes = this.dataService.getVotes(ballotId);
			return Object.assign({}, ballot, { votes });
		}
		throw new NotFoundException();
	}
}
