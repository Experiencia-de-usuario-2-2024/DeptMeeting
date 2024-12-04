import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { ClientProxyMeetflow } from 'src/common/proxy/client-proxy';

@ApiTags('Microservicio chat colaborativo (microservice-collaborative-chat)')
@Controller('api/collaborative-chat')
export class CollaborativeChatController {

 constructor(private readonly clientProxy: ClientProxyMeetflow) { }

private _clientProxyCollaborativeChat = this.clientProxy.clientProxyCollaborativeChat();

  @Post('create')
  @ApiOperation({ summary: 'Crear chat colaborativo' })
  async addProject(@Body() collaborativeChat: any, @Req() req: any) {
    console.log("CREAR_COLLABORATIVE_CHAT");
    return await this._clientProxyCollaborativeChat.send('CREAR_COLLABORATIVE_CHAT', collaborativeChat);
  }

  @Get('/get/:id')
  @ApiOperation({ summary: 'obtener chat colaborativo por id' })
  async findOne(@Param('id') id: string) {
    return await this._clientProxyCollaborativeChat.send('BUSCAR_UN_COLLABORATIVE_CHAT', id);
  }

  @Get('/get-all')
  @ApiOperation({ summary: 'obtener todos los chat colaborativo' })
  async findAll() {
    console.log("Solicitando todos los chat colaborativos");
    return await this._clientProxyCollaborativeChat.send('BUSCAR_TODOS_COLLABORATIVE_CHAT', '');
  }

  @Put(':id')
  @ApiOperation({ summary: 'actualizar chat colaborativo' })
  async update(
    @Param('id') id: string,
    @Body() collaborativeChat: any,
  ): Promise<Observable<any>> {
    return await this._clientProxyCollaborativeChat.send("ACTUALIZAR_COLLABORATIVE_CHAT", { id, collaborativeChat });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'borrrar chat colaborativo por id' })
  delete(@Param('id') id: string): Observable<any> {
    return this._clientProxyCollaborativeChat.send("BORRAR_COLLABORATIVE_CHAT", id);
  }
}
