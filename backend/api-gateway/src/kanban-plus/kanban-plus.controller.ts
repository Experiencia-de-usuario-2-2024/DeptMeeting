import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { ClientProxyMeetflow } from 'src/common/proxy/client-proxy';

@ApiTags('Microservicio kanban plus (microservice-kanban-plus)')
@Controller('api/kanban-plus')
export class KanbanPlusController {

    
constructor(private readonly clientProxy: ClientProxyMeetflow) { }

private _clientProxyKanbanPluls = this.clientProxy.clientProxyKanbanPlus();

  @Post('create')
  @ApiOperation({ summary: 'Crear kanban plus' })
  async addProject(@Body() kanbanPlus: any, @Req() req: any) {
    console.log("CREANDO KANBAN PLUS");
    return await this._clientProxyKanbanPluls.send('CREAR_KANBAN_PLUS', kanbanPlus);
  }

  @Get('/get/:id')
  @ApiOperation({ summary: 'obtener kanban plus por id' })
  async findOne(@Param('id') id: string) {
    return await this._clientProxyKanbanPluls.send('BUSCAR_UN_KANBAN_PLUS', id);
  }

  @Get('/get-all')
  @ApiOperation({ summary: 'obtener todos los kanban plus' })
  async findAll() {
    return await this._clientProxyKanbanPluls.send('BUSCAR_TODOS_KANBAN_PLUS', '');
  }

  @Put(':id')
  @ApiOperation({ summary: 'actualizar kanban plus' })
  async update(
    @Param('id') id: string,
    @Body() kanbanPlus: any,
  ): Promise<Observable<any>> {
    return await this._clientProxyKanbanPluls.send("ACTUALIZAR_KANBAN_PLUS", { id, kanbanPlus });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'borrar kanban plus por id' })
  delete(@Param('id') id: string): Observable<any> {
    return this._clientProxyKanbanPluls.send("BORRAR_KANBAN_PLUS", id);
  }

}
