import { Module } from '@nestjs/common';
import { TextEditorController } from './text-editor.controller';
import { ProxyModule } from 'src/common/proxy/proxy.module';

@Module({
  imports: [ProxyModule],
  controllers: [TextEditorController]
})
export class TextEditorModule {}
