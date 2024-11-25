import { Test, TestingModule } from '@nestjs/testing';
import { CollaborativeChatController } from './collaborative-chat.controller';

describe('CollaborativeChatController', () => {
  let controller: CollaborativeChatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollaborativeChatController],
    }).compile();

    controller = module.get<CollaborativeChatController>(CollaborativeChatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
