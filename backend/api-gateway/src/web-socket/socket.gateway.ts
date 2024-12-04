import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway(83, {
  cors: {
    origin: '*',
    namespace: 'chat',
  },
})

export class ScoketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server;

  // Mantener un registro de usuarios conectados
  private connectedUsers: { [room: string]: any[] } = {};

  /*

  const connectedUsers: { [room: string]: any[] } = {
    "room1": [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" }
    ],
    "room2": [
        { id: 3, name: "Charlie" }
    ],
    "room3": []
  };

  */

  afterInit(server: any) {}

  handleConnection(client: Socket, ...args: any[]) {
    console.log('Usuario nuevo conectado');
    console.log('ID del cliente:', client.id);
    console.log('Salas a las que está suscrito:', client.rooms);
    console.log('Handshake:', client.handshake);
  }

  handleDisconnect(client: any) {
    console.log('Usuario desconectado');
    // Eliminar usuario de la lista de conectados cuando se desconecta
    Object.keys(this.connectedUsers).forEach(room => {
      this.connectedUsers[room] = this.connectedUsers[room].filter(user => user.socketId !== client.id);
    });
  }

  // EVENTO DE ENVIAR MENSAJE 
  @SubscribeMessage('event_message')
  handleIncomingMessage(
    client: Socket,
    payload: { room: string; user: any, message: any },
  ) {
    const { room, user, message } = payload;
    console.log("[socket] mensaje enviado");
    this.server.to('room_' + room).emit('new_message', {user: user, message: message});
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
    console.log("[socket] recargar pagina web");
    this.server.to('room_' + room).emit('new_reload', user);
  }

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
    payload: { room: string; user: any, topic: string },
  ) {
    const { room, user, topic } = payload;
    console.log("[socket] se ha creado un tema");
    this.server.to('room_' + room).emit('new_topic', { user, topic });
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
    console.log("[socket] usuario: " + payload2.user.name + ' ha salido de la sección: ' + payload2.room);
    client.leave('room_' + payload2.room);

    // Eliminar usuario de la lista de conectados
    if(this.connectedUsers[payload2.room]){
      this.connectedUsers[payload2.room] = this.connectedUsers[payload2.room].filter(user => user.socketId !== client.id);
      this.server.to('room_' + payload2.room).emit('left_user', payload2.user);
    }
    this.server.to('room_' + payload2.room).emit('left_user', payload2.user);
  }

  // EVENTO DE USUARIO UNIENDOSE A LA SECCIÖN
  @SubscribeMessage('event_join')
  handleJoinRoom(client: Socket, payload: { room: string; user: any }) {
    console.log("[socket] usuario: " + payload.user.name + ' ha unido a la sección: ' + payload.room);
    client.join('room_' + payload.room);
    // Guardar el usuario conectado
    if (!this.connectedUsers[payload.room]) {  // Si no existe la sala, crearla
      this.connectedUsers[payload.room] = [];
    }
    this.connectedUsers[payload.room].push({ user: payload.user, socketId: client.id });
    // Enviar la lista de usuarios conectados al nuevo usuario
    client.emit('connected_users', this.connectedUsers[payload.room].map(entry => entry.user));

    this.server.to('room_' + payload.room).emit('new_user', payload.user);
  }

  // EVENTO DE USUARIO CAMBIANDO EL ESTADO DE LA REUNIÓN
  @SubscribeMessage('event_set_new_state')
  handlePreMeeting(client: Socket, payload: { room: string, user: any}) {
    console.log("[socket] usuario: " + payload.user.name + ' ha cambiado actualizado el estado de la reunión');
    this.server.to('room_' + payload.room).emit('new_state', payload.user);
  }

  // EVENTO DE USUARIO AÑADIENDO UN ELEMENTO DIALÓGICO
  @SubscribeMessage('event_add_element')
  handleAddElement(client: Socket, payload: { room: string, user: any, element: any }) {
    this.server.to('room_' + payload.room).emit('new_element', payload.element);
  }

  // EVENTO DE USUARIO ACTUALIZANDO UN ELEMENTO DIALÓGICO
  @SubscribeMessage('event_update_element')
  handleUpdateElement(client: Socket, payload: { room: string, user: any, element: any }) {
    console.log("[socket] usuario: " + payload.user.name + ' ha actualizado un elemento');
    this.server.to('room_' + payload.room).emit('element_updated', {element: payload.element, user: payload.user});
  }

  // EVENTO DE USUARIO ELIMINANDO UN ELEMENTO DIALÓGICO
  @SubscribeMessage('event_delete_element')  // Evento que escucha el servidor y que emite el cliente
  handleDeleteElement(client: Socket, payload: { room: string, user: any, element: any }) {
    console.log("[socket] usuario: " + payload.user.name + ' ha eliminado un elemento');
    this.server.to('room_' + payload.room).emit('element_deleted', {element: payload.element, user: payload.user});  // Los clientes escuchan este evento
  }

  // EVENTO DE USUARIO BLOQUEANDO UN ELEMENTO DIALÓGICO
  @SubscribeMessage('event_block_element')
  handleBlockElement(client: Socket, payload: { room: string, user: any, element: any }) {
    console.log("[socket] usuario: " + payload.user.name + ' ha bloqueado un elemento');
    this.server.to('room_' + payload.room).emit('element_blocked', {element: payload.element, user: payload.user});
  }

  // EVENTO DE USUARIO DESBLOQUEANDO UN ELEMENTO DIALÓGICO
  @SubscribeMessage('event_unblock_element')
  handleUnblockElement(client: Socket, payload: { room: string, user: any, element: any }) {
    console.log("[socket] usuario: " + payload.user.name + ' ha desbloqueado un elemento');
    this.server.to('room_' + payload.room).emit('element_unblocked', {element: payload.element, user: payload.user});
  }
}
