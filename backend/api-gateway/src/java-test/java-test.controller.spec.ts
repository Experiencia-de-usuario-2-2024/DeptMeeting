import { Test, TestingModule } from '@nestjs/testing';
import { JavaTestController } from './java-test.controller';

describe('JavaTestController', () => {
  let controller: JavaTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JavaTestController],
    }).compile();

    controller = module.get<JavaTestController>(JavaTestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
