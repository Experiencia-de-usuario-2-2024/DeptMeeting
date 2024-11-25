import { Test, TestingModule } from '@nestjs/testing';
import { TextEditorController } from './text-editor.controller';

describe('TextEditorController', () => {
  let controller: TextEditorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TextEditorController],
    }).compile();

    controller = module.get<TextEditorController>(TextEditorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
