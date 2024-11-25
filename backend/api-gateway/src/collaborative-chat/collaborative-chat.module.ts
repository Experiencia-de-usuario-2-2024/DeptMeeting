import { Module } from '@nestjs/common';
import { CollaborativeChatService } from './collaborative-chat.service';
import { CollaborativeChatController } from './collaborative-chat.controller';
import { ProxyModule } from 'src/common/proxy/proxy.module';

@Module({
  imports: [ProxyModule],
  providers: [CollaborativeChatService],
  controllers: [CollaborativeChatController]
})
export class CollaborativeChatModule {}
