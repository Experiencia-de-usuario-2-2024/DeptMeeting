import { Test, TestingModule } from '@nestjs/testing';
import { DoodleController } from './doodle.controller';

describe('DoodleController', () => {
  let controller: DoodleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoodleController],
    }).compile();

    controller = module.get<DoodleController>(DoodleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
