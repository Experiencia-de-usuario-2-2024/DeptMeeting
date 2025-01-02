import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {MEETINGMINUTE, TOPIC} from 'src/common/models/models';
import { MeetingMinuteController } from './meeting-minute.controller';
import { MeetingMinuteService } from './meeting-minute.service';
import { MeetingMinuteSchema } from './schema/meeting-minute.schema';
import {TopicSchema} from "./schema/topic.schema";

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: MEETINGMINUTE.name,
        useFactory: ()=> MeetingMinuteSchema,
      },
        {
        name: TOPIC.name,
        useFactory: ()=> TopicSchema,
        }
    ])
  ],
  controllers: [MeetingMinuteController],
  providers: [MeetingMinuteService],
  exports: [MeetingMinuteService]
})
export class MeetingMinuteModule {}
