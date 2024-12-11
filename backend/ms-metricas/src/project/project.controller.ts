import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectService } from './project.service';
import { JwtService } from '@nestjs/jwt';
import { MessagePattern, Payload } from '@nestjs/microservices';
import * as CONSTANTS from 'src/common/constants';

@Controller()
export class ProjectController {
  constructor(private readonly projectService: ProjectService, private readonly jwtService: JwtService) {}

  @MessagePattern(CONSTANTS.ProjectMetricsMSG.FIND_ASSISTS_BY_ID)
  async findAssistsById(@Payload() id: string) {
    return await this.projectService.findAssistsById(id);
  }

  @MessagePattern('GET_PROJECT_MEETINGS_IDS')
  async getMeetingsByIdProject(@Payload() id: string) {
    return await this.projectService.getMeetingsByIdProject(id);
  }

  @MessagePattern('GET_PROJECT_MEETINGMINUTES')
  async getMeetingMinutesByIdMeeting(@Payload() id: string) {
    return await this.projectService.getMeetingMinutesByIdMeeting(id);
  }
}
