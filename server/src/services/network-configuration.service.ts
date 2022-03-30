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
	public readonly hcsTopic: string;
	/**
	 * The Voting Token Address, in 0.0.123 format.
	 */
	public readonly hcsToken: string;
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
		this.mirrorGrpc = configService.get<string>('MIRROR_GRPC');
		this.mirrorRest = configService.get<string>('MIRROR_REST');
		this.hcsTopic = configService.get<string>('HCS_TOPIC');
		this.hcsToken = configService.get<string>('HTS_TOKEN');
		const errors = [];
		if (!/^\d+\.\d+\.\d+$/.test(this.hcsTopic)) {
			errors.push('Invalid HCS Topic in configuration.');
		}
		if (!/^\d+\.\d+\.\d+$/.test(this.hcsToken)) {
			errors.push('Invalid HCS Token in configuration.');
		}
		if (errors.length > 0) {
			throw Error(`Invalid Configuration: ${errors.join(', ')}`);
		}
		this.logger.log('Network Configuration Parsed Successfully.');
		this.logger.log(`Mirror Node GRPC: ${this.mirrorGrpc}`);
		this.logger.log(`Mirror Node REST: ${this.mirrorRest}`);
		this.logger.log(`HCS Topic: ${this.hcsTopic}`);
		this.logger.log(`HTS Token: ${this.hcsToken}`);
	}
}
