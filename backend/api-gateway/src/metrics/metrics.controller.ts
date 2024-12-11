import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ClientProxyMeetflow } from 'src/common/proxy/client-proxy';
import * as CONSTANTS from 'src/common/constants';

@Controller('api/metrics')
export class MetricsController {
  // Entrada: cliente proxy global
  constructor(private readonly clientProxy: ClientProxyMeetflow) {}

  // Cliente proxy de metricas
  private _clientProxyUser = this.clientProxy.clientProxyMetrics();

  // Meeting engine
  @Get('/project/:id/get-assists')
  @ApiOperation({summary: 'Obtener la cantidad de asistencias de los integrantes de un proyecto'})
  getAssistsByProject(@Param('id') id: string) {
    console.log(`canal de mensaje: ${CONSTANTS.ProjectMetricsMSG.FIND_ASSISTS_BY_ID}`);
    return this._clientProxyUser.send(CONSTANTS.ProjectMetricsMSG.FIND_ASSISTS_BY_ID, id);
  }

  @Get('/project/:id/get-meetings')
  @ApiOperation({summary: 'Obtener las reuniones de un proyecto'})
  getMeetingsByProject(@Param('id') id: string) {
    return this._clientProxyUser.send('GET_PROJECT_MEETINGS_IDS', id);
  }

  @Get('/project/:id/get-meetingminutes')
  @ApiOperation({summary: 'Obtener las reuniones de un proyecto'})
  getMeetingMinutesByIdMeeting(@Param('id') id: string) {
    return this._clientProxyUser.send('GET_PROJECT_MEETINGMINUTES', id);
  }
}
