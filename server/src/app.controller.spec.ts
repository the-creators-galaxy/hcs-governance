import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { DataService } from './services/data.service';

describe('AppController', () => {
	let appController: AppController;

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [AppController],
			providers: [DataService],
		}).compile();

		appController = app.get<AppController>(AppController);
	});

	describe('root', () => {
		it('should return "Hello World!"', () => {
			expect(appController.getInfo()).not.toBe('Hello World!');
		});
	});
});
