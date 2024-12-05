import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody, //nuevo
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway(Number(process.env.IO_PORT), {
  cors: {
    origin: '*',
    namespace: 'chat',
  },
})

export class ScoketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server;

  afterInit(server: any) {
  }
  handleConnection(client: Socket, ...args: any[]) {
    console.log('Usuario nuevo conectado');
  }
  handleDisconnect(client: any) {
    console.log('Usuario desconectado');
  }

  // EVENTO DE ENVIAR MENSAJE 
  @SubscribeMessage('event_message')
  handleIncomingMessage(
    client: Socket,
    payload: { room: string; user: any },
  ) {
    const { room, user } = payload;
    console.log("[socket] mensaje enviado");
    this.server.to('room_' + room).emit('new_message', user);
  }

  // EVENTO DE RECIBIR MENSAJE DE GUARDAR
  @SubscribeMessage('event_save')
  handleIncomingMessage2(
    client: Socket,
    payload: { room: string; user: any },
  ) {
    const { room, user } = payload;
    console.log("[socket] guardar");
    this.server.to('room_' + room).emit('new_save', user);
  }


  // EVENTO DE RECARGAR PAGINA
  @SubscribeMessage('event_reload')
  handleIncomingMessage3(
    client: Socket,
    payload: { room: string; user: any },
  ) {
    const { room, user } = payload;
    console.log("[socket] recargar pagina web para la sala: " + payload.room + " por el usuario " + payload.user.email);
    this.server.to('room_' + room).emit('new_reload', user);
  }







  // ************************************************************
  // ********************* NUEVO NUEVO NUEVO ********************
  // ********************* NUEVO NUEVO NUEVO ********************
  // ************************************************************

  // EVENTO DE RECARGAR PAGINA -> VERSION 2 (requiero que llegando al frontend realice una operacion adicional ademas de recargar la pagina)
  @SubscribeMessage('event_reload_ver2')
  handleIncomingMessage3Ver2(
    client: Socket,
    payload: { room: string; user: any },
  ) {
    const { room, user } = payload;
    console.log("[socket] recargar VER 2 pagina web para la sala: " + payload.room + " por el usuario " + payload.user.email);
    this.server.to('room_' + room).emit('new_reload_ver2', user);
  }

  // EVENTO DE RECARGAR PAGINA -> VERSION 3 (requiero que llegando al frontend realice una operacion adicional ademas de recargar la pagina)
  @SubscribeMessage('event_reload_ver3')
  handleIncomingMessage3Ver3(
    client: Socket,
    payload: { room: string; user: any },
  ) {
    const { room, user } = payload;
    console.log("[socket] recargar VER 3 pagina web para la sala: " + payload.room + " por el usuario " + payload.user.email);
    this.server.to('room_' + room).emit('new_reload_ver3', user);
  }


  // EVENTO DE NOTIFICAR PARTICIPANTES DE QUE UNO DE ELLOS ESTA EDITANDO EN POST-REUNION
  @SubscribeMessage('event_notificar_participante_editando')
  handleIncomingMessageNotificarParticipantes(
    client: Socket,
    payload: { room: string; user: any, tema:any},
  ) {
    const { room, user, tema } = payload;
    console.log("[socket] Usuario edita tema para la sala: " + payload.room + " por el usuario " + payload.user.email);
    this.server.to('room_' + room).emit('new_notificar_participante_editando', payload);
  }


  // EVENTO ACTUALIZAR LISTA DE PARTICIPANTES
  @SubscribeMessage('event_lista_participantes')
  handleIncomingMessageParticipantes(
    client: Socket,
    payload: { room: string; lista: any },
  ) {
    const { room, lista } = payload;
    console.log("[socket] LISTA DE PARTICIPANTES EN REUNION: " + payload.room + " LISTA " + payload.lista);
    this.server.to('room_' + room).emit('new_lista_participantes', lista);
  }

  // EVENTO ACTUALIZAR LISTA DE PARTICIPANTES
  @SubscribeMessage('event_lista_participantes_ver2')
  handleIncomingMessageParticipantesVer2(
    client: Socket,
    payload: { room: string; lista: any },
  ) {
    const { room, lista } = payload;
    console.log("[socket] LISTA DE PARTICIPANTES POST REUNION: " + payload.room + " LISTA " + payload.lista);
    this.server.to('room_' + room).emit('new_lista_participantes_ver2', lista);
  }


  // EVENTO COMENZAR REUNION
  @SubscribeMessage('event_comenzar_reunion')
  handleIncomingMessageComenzarReunion(
    client: Socket,
    payload: { room: string; valorIniciarReunion: any },
  ) {
    const { room, valorIniciarReunion } = payload;
    console.log("[socket] COMENZAR REUNION EN: " + payload.room + " valorIniciarReunion " + payload.valorIniciarReunion);
    this.server.to('room_' + room).emit('new_comenzar_reunion', valorIniciarReunion);
  }

  
  // PARA EL CHAT COLABORATIVO QUE EXISTE DENTRO DE LA REUNION
  // funciona separando el chat en salas
  @SubscribeMessage('messageVer2')
  handleMessageVer2(
    client: Socket,
    payload: { room: string; user: any, message: string},
  ): void {
    const { room, user, message } = payload;
    console.log("[socket] Sala: " + payload.room + " Usuario: " + payload.user + " Mensaje: " + payload.message);
    this.server.to('room_' + payload.room).emit('messageVer2', { room: payload.room, user: payload.user, message: payload.message});
  }


  // ESTE FUNCIONA PERO NO SEPARA LOS CHAT POR SALAS
  @SubscribeMessage('message')
  handleMessage(
    client: Socket,
    @MessageBody() message: string,
  ): void {
    console.log("[socket] Mensaje: " + message);
    this.server.emit('message', message);
  }

  // ************************************************************
  // ************************************************************
  // ************************************************************
  // ************************************************************







  

  // EVENTO DE CREAR REUNIÓN
  @SubscribeMessage('event_meet')
  handleIncomingMessage4(
    client: Socket,
    payload: { room: string; user: any },
  ) {
    const { room, user } = payload;
    console.log("[socket] se ha creado una reunión", payload.room);
    this.server.to('room_' + room).emit('new_meet', user);
  }

  // EVENTO DE CREAR ELEMENTO
  @SubscribeMessage('event_element')
  handleIncomingMessage5(
    client: Socket,
    payload: { room: string; user: any },
  ) {
    const { room, user } = payload;
    console.log("[socket] se ha creado un elemento");
    this.server.to('room_' + room).emit('new_element', user);
  }

  // EVENTO DE CREAR TEMA
  @SubscribeMessage('event_topic')
  handleIncomingMessage6(
    client: Socket,
    payload: { room: string; user: any },
  ) {
    const { room, user } = payload;
    console.log("[socket] se ha creado un tema");
    this.server.to('room_' + room).emit('new_topic', user);
  }

  // EVENTO DE CREAR PROYECTO
  @SubscribeMessage('event_project')
  handleIncomingMessage7(
    client: Socket,
    payload: { room: string; user: any },
  ) {
    const { room, user } = payload;
    console.log("[socket] se ha creado un proyecto");
    this.server.to('room_' + room).emit('new_project', user);
  }

  // EVENTO DE GUARDA PROJECTO
  @SubscribeMessage('event_save_project')
  handleIncomingMessage8(
    client: Socket,
    payload: { room: string; user: any },
  ) {
    const { room, user } = payload;
    console.log("[socket] se ha guardado el proyecto");
    this.server.to('room_' + room).emit('new_save_project', user);
  }

  // EVENTO DE USUARIO SALIENDO DE LA SECCIÖN
  @SubscribeMessage('event_leave')
  handleRoomLeave(client: Socket, payload2: { room: string; user: any }) {
    // console.log("[socket] usuario: " + payload2.user.name + ' ha salido de la sección: ' + payload2.room);
    console.log("[socket] usuario: " + payload2.user + ' ha salido de la sección: ' + payload2.room);
    client.leave('room_' + payload2.room);
    this.server.to('room_' + payload2.room).emit('left_user', payload2.user);
  }

  // EVENTO DE USUARIO UNIENDOSE A LA SECCIÖN
  @SubscribeMessage('event_join')
  handleJoinRoom(client: Socket, payload: { room: string; user: any }) {
    // console.log("[socket] usuario: " + payload.user.name + ' ha unido a la sección: ' + payload.room);
    console.log("[socket] usuario: " + payload.user.email + ' ha unido a la sección: ' + payload.room);
    client.join('room_' + payload.room);
    this.server.to('room_' + payload.room).emit('new_user', payload.user);
  }
}
