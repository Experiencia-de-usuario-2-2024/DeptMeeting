import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { ProxyModule } from 'src/common/proxy/proxy.module';
@Module({
  imports: [ProxyModule],
  controllers: [MetricsController],
})
export class MetricsModule {}
