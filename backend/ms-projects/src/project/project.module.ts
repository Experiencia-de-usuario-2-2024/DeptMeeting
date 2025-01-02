import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GUEST, PROJECT, PERIOD } from 'src/common/models/models';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { GuestSchema } from './schema/guest.schema';
import { ProjectSchema } from './schema/project.schema';
import { PeriodSchema } from './schema/period.schema';
import { PeriodService } from './period.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: PROJECT.name,
        useFactory: () => ProjectSchema,
      },
      {
        name: GUEST.name,
        useFactory: () => GuestSchema,
      },
      {
        name: PERIOD.name,
        useFactory: () => PeriodSchema,
      },
    ]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService, PeriodService],
})
export class ProjectModule {}
