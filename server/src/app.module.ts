import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { DataService } from './services/data.service';
import { NetworkConfigurationService } from './services/network-configuration.service';
import { HcsMessageListenerService } from './services/hcs-message-listener.service';
import { MirrorClientService } from './services/mirror-client.service';
import { HcsBallotProcessingService } from './services/hcs-ballot-processing.service';
import { HcsVoteProcessingService } from './services/hcs-vote-processing.service';
import { HcsMessageProcessingService } from './services/hcs-message-processing.service';
import { TokenInfo } from './models/token-info';
/**
 * Main NestJS application module.
 */
@Module({
	imports: [ConfigModule.forRoot(), ScheduleModule.forRoot()],
	controllers: [AppController],
	providers: [
		HcsMessageListenerService,
		NetworkConfigurationService,
		HcsMessageProcessingService,
		HcsBallotProcessingService,
		HcsVoteProcessingService,
		MirrorClientService,
		DataService,
		{
			provide: TokenInfo,
			useFactory: (mirrorClient: MirrorClientService) => mirrorClient.getHcsTokenInfo(),
			inject: [MirrorClientService],
		},
	],
})
export class AppModule {}
