import { Module } from '@nestjs/common';
import { KanbanPlusController } from './kanban-plus.controller';
import { ProxyModule } from 'src/common/proxy/proxy.module';

@Module({
  imports: [ProxyModule],
  controllers: [KanbanPlusController]
})
export class KanbanPlusModule {}
