import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/* Setup protobufjs to use the Long library */
/* eslint @typescript-eslint/no-var-requires: "off" */
const protobufJS = require('protobufjs/minimal');
protobufJS.util.Long = require('long');
protobufJS.configure();

/* Setup nodejs to use node-fetch */
if (!global.fetch) {
	global.fetch = require('node-fetch');
}

/**
 * Main entry point for NestJS based service.
 */
async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors();
	await app.listen(process.env.PORT || 80);
}
bootstrap();
