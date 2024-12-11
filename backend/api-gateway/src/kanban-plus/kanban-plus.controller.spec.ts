import { Test, TestingModule } from '@nestjs/testing';
import { KanbanPlusController } from './kanban-plus.controller';

describe('KanbanPlusController', () => {
  let controller: KanbanPlusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KanbanPlusController],
    }).compile();

    controller = module.get<KanbanPlusController>(KanbanPlusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
