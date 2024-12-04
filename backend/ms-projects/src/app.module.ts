import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectModule } from './project/project.module';
import { ScheduleModule } from '@nestjs/schedule';
import { JobsModule } from './jobs/points-perday.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    JobsModule,
    ProjectModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.development'],
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.URI_MONGODB_PROJECTS)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
