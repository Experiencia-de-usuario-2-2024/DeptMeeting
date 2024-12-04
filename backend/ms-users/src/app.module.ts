import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from "./user/user.module";
import { MongooseModule } from "@nestjs/mongoose";
import { UserProjectModule } from './user_project/user_project.module';

@Module({
  imports: [UserModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.development'],
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.URI_MONGODB_USERS),
    UserProjectModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
