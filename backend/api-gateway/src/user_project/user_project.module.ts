import { Module } from '@nestjs/common';
import { UserProjectService } from './user_project.service';
import { UserProjectController } from './user_project.controller';
import { ProxyModule } from 'src/common/proxy/proxy.module';

@Module({
  controllers: [UserProjectController],
  providers: [UserProjectService],
  imports: [ProxyModule]
})
export class UserProjectModule {}
