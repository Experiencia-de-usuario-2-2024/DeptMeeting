import { Test, TestingModule } from '@nestjs/testing';
import { CollaborativeChatService } from './collaborative-chat.service';

describe('CollaborativeChatService', () => {
  let service: CollaborativeChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CollaborativeChatService],
    }).compile();

    service = module.get<CollaborativeChatService>(CollaborativeChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
