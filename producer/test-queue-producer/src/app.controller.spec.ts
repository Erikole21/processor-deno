import { Test, TestingModule } from '@nestjs/testing';
import { QueueController } from './app.controller';
import { QueueService } from './app.service';

describe('AppController', () => {
  let appController: QueueController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [QueueController],
      providers: [QueueService],
    }).compile();

    appController = app.get<QueueController>(QueueController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.addMessage({})).toBe('Hello World!');
    });
  });
});
