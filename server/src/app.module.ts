import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { DataService } from './services/data.service';
import { HcsMessageListenerService } from './services/hcs-message-listener.service';
import { MirrorClientService } from './services/mirror-client.service';
import { HcsBallotProcessingService } from './services/hcs-ballot-processing.service';
import { HcsVoteProcessingService } from './services/hcs-vote-processing.service';
import { HcsMessageProcessingService } from './services/hcs-message-processing.service';
import { AppConfiguration, loadAppConfiguration } from './models/app-configuration';
/**
 * Main NestJS application module.
 */
@Module({
	imports: [ConfigModule.forRoot(), ScheduleModule.forRoot()],
	controllers: [AppController],
	providers: [
		{
			provide: AppConfiguration,
			useFactory: loadAppConfiguration,
			inject: [ConfigService],
		},
		HcsMessageListenerService,
		HcsMessageProcessingService,
		HcsBallotProcessingService,
		HcsVoteProcessingService,
		MirrorClientService,
		DataService,
	],
})
export class AppModule {}
