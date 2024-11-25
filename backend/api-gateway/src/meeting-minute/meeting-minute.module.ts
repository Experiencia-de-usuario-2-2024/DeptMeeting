import { Module } from '@nestjs/common';
import { MeetingMinuteController } from './meeting-minute.controller';
import { ProxyModule } from 'src/common/proxy/proxy.module';
import { MeetingMinuteService } from './meeting-minute.service';

@Module({
  imports: [ProxyModule],
  controllers: [MeetingMinuteController],
  providers: [MeetingMinuteService ],
  exports: [MeetingMinuteService]

})
export class MeetingMinuteModule {}
