import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ClientProxyMeetflow } from 'src/common/proxy/client-proxy';
import { MeetingMinuteDTO } from './dto/meeting-minute.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { MeetingMinuteMSG } from 'src/common/constants';
import { IMeetingMinute } from 'src/common/interfaces/meeting-minute.interface';
import { Observable } from 'rxjs';
import { MeetingMinuteService } from './meeting-minute.service';

@ApiTags('Microservicio de actas dialógicas (microservice-meetingminutes)')
@UseGuards(JwtAuthGuard)
@Controller('api/meeting-minute')
export class MeetingMinuteController {

  // Entrada: cliente proxy global
  constructor(private readonly clientProxy: ClientProxyMeetflow, private readonly meetingMinuteService: MeetingMinuteService) { }

  // cliente proxy de actas dialógicas
  private _clientProxyMeetingMinute =
    this.clientProxy.clientProxyMeetingMinute();

  // cliente proxy de notificaciones
  private _clientProxyNotifications =
    this.clientProxy.clientProxyNotification();

  /* 
  Modelo estructural de datos:

      1. IMeetingMinute:    Interface

      2. MeetingMinuteMSG:  Mensajeria por RabbitMQ

      3. meetingMinuteDTO:  MeetingMinuteDTO: Objeto de transferencia de datos 

  */

  // METODOS CRUD para actas dialógicas

  /*  
   Metodo para crear una nueva acta dialógica.
   entrada: datos del acta dialógica. 
   salida: objeto de nueva acta dialógica.  
  */
  @Post()
  @ApiOperation({ summary: 'Crear una acta dialógica' })
  create(@Body() meetingMinuteDTO: MeetingMinuteDTO, @Req() req: any): Observable<IMeetingMinute> {
    const params = {
      meetingMinuteDTO: meetingMinuteDTO,
      user: req.user
    }
    return this._clientProxyMeetingMinute.send(MeetingMinuteMSG.CREATE, params);
  }

  /*  
  Metodo para obtener todas las actas dialógicas.
  salida: objeto de actas dialógicas encontradas. 
  */
  @Get()
  @ApiOperation({ summary: 'Obtener todas las actas dialógicas' })
  findAll(): Observable<IMeetingMinute> {
    return this._clientProxyMeetingMinute.send(MeetingMinuteMSG.FIND_ALL, '');
  }

  /*  
  Metodo para  obtener una acta dialógica a partir del id.
  entrada: id de la acta dialógica. 
  salida: objeto de la acta dialógica encontrada.  
  */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener acta dialógica por id' })
  findOne(@Param('id') id: string): Observable<IMeetingMinute> {
    return this._clientProxyMeetingMinute.send(MeetingMinuteMSG.FIND_ONE, id);
  }

  /*  
  Metodo para actualizar una acta dialógica a partir del id.
  entrada: id de la acta dialógica y nuevos datos de la acta dialógica. 
  salida: objeto de la acta dialógica actualizada.
  */
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar acta dialógica por id' })
  update(@Param('id') id: string, @Body() meetingMinuteDTO: MeetingMinuteDTO): Observable<IMeetingMinute> {
    const params = {
      id: id,
      meetingMinuteDTO: meetingMinuteDTO
    }
    return this._clientProxyMeetingMinute.send(MeetingMinuteMSG.UPDATE, params);
  }

  /*  
   Metodo para borrar permanentemente una acta dialógica a partir del id.
   entrada: id de la acta dialógica.
   salida: valor booleano de confirmación.
  */
  @Delete(':id')
  @ApiOperation({ summary: 'Borrar permanentemente una acta dialógica por id' })
  delete(@Param('id') id: string): Observable<any> {
    return this._clientProxyMeetingMinute.send(MeetingMinuteMSG.DELETE, id);
  }

  /*  
  Metodo para notificar sobre un cambio de estado del acta dialógica.
  entrada: id de la acta dialógica y nuevos datos de la acta dialógica. 
  salida: objeto de la acta dialógica actualizada.
  */
  @Post('/notify/state/change')
  @ApiOperation({ summary: 'Notificar cambio de estado del acta dialógica' })
  sendNotification(@Body() meetingMinuteDTO: any, @Req() req: any) {
    const params = {
      meetingMinuteDTO: meetingMinuteDTO,
      user: req.user
    }
    console.log("Notificando cambio de estado de acta dialogica: ", meetingMinuteDTO)
    return this._clientProxyNotifications.send('sendNotification', params);
  }

  /*  
  Metodo para notificar sobre un recordatorio de un elemento dialogico.
  entrada: id del recordatorio y nuevos datos del recordatorio. 
  salida: objeto de la notificacion del recordatorio actualizada.
  */
  @Post('/notify/reminder')
  @ApiOperation({ summary: 'notificar recordatorio de elemento dialógico' })
  sendNotificationRemember(@Body() remember: any, @Req() req: any) {
    const params = {
      remember: remember,
      user: req.user
    }
    return this._clientProxyNotifications.send('sendNotificationRemember', params);
  }

  /*  
  Metodo para notificar sobre un recordatorio de una tarea .
  entrada: id del recordatorio y nuevos datos de la tarea . 
  salida: objeto de la tarea y norificaion actualizada.
  */
  @Post('/notify/reminder/task')
  @ApiOperation({ summary: 'notificar recordatorio de tarea' })
  sendNotificationRememberTask(@Body() remember: any, @Req() req: any) {
    const params = {
      remember: remember,
      user: req.user
    }
    return this._clientProxyNotifications.send('sendNotificationRememberTask', params);
  }

  /*  
  Metodo para notificar a invitado externo para que registre e ingrese a la reunión.
  entrada: acta dialogica completa . 
  salida: correo electronico enviado a invitado externo.
  */
  @Post('/notify/user/invited/external')
  @ApiOperation({ summary: 'notificar al invitado externo con su nueva cuenta creada' })
  sendNotificationExternal(@Body() meetingMinuteDTO: any, @Req() req: any) {
   console.log("Invitando a usuario: ",meetingMinuteDTO.emailExternal + " con contraseña: "+ meetingMinuteDTO.passTemp  )
    const params = {
      meetingMinuteDTO: meetingMinuteDTO,
      user: req.user
    }
    return this._clientProxyNotifications.send('sendNotificationExternal', params);
  }


  // METODOS NUEVOS

  // metodo para encontrar actas dialogicas por id de reunion
  @Get('reunion/:idReunion')
  @ApiOperation({ summary: 'Obtener acta dialógica por id de la reunión a la que pertenece' })
  encontrarPorReunion(@Param('idReunion') idReunion: string): Observable<IMeetingMinute> {
    return this._clientProxyMeetingMinute.send("encontrarPorReunion", idReunion);
  }



}
