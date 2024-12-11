import { Module } from '@nestjs/common';
import { DoodleController } from './doodle.controller';
import { ProxyModule } from 'src/common/proxy/proxy.module';

@Module({
  imports: [ProxyModule],
  controllers: [DoodleController]
})
export class DoodleModule {}
