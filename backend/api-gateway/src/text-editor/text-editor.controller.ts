import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { ClientProxyMeetflow } from 'src/common/proxy/client-proxy';

@ApiTags('Microservicio editor de texto (microservice-text-edit)')
@Controller('api/text-editor')
export class TextEditorController {

constructor(private readonly clientProxy: ClientProxyMeetflow) { }

private _clientProxyTextEditor = this.clientProxy.clientProxyTextEditor();

  @Post('create')
  @ApiOperation({ summary: 'Crear texto colaborativo' })
  async addProject(@Body() textEditor: any, @Req() req: any) {
    console.log("creando text editor");
    return await this._clientProxyTextEditor.send('CREAR_TEXT_EDITOR', textEditor);
  }

  @Get('/get/:id')
  @ApiOperation({ summary: 'obtener texto colaborativo por id' })
  async findOne(@Param('id') id: string) {
    console.log("obteniendo text editor por id");
    return await this._clientProxyTextEditor.send('BUSCAR_UN_TEXT_EDITOR', id);
  }

  @Get('/get-all')
  @ApiOperation({ summary: 'obtener todos los textos colaborativos' })
  async findAll() {
    console.log("obteniendo todos los text editor");
    return await this._clientProxyTextEditor.send('BUSCAR_TODOS_TEXT_EDITOR', '');
  }

  @Put(':id')
  @ApiOperation({ summary: 'actualizar texto colaborativo por id' })
  async update(
    @Param('id') id: string,
    @Body() textEditor: any,
  ): Promise<Observable<any>> {
    console.log("solicitando text editor por id");
    return await this._clientProxyTextEditor.send("ACTUALIZAR_TEXT_EDITOR", { id, textEditor });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'borrar texto colaborativo por id' })
  delete(@Param('id') id: string): Observable<any> {
    return this._clientProxyTextEditor.send("BORRAR_TEXT_EDITOR", id);
  }

}
