import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { ClientProxyMeetflow } from 'src/common/proxy/client-proxy';

@ApiTags('Microservicio doodle (microservice-doodle)')
@Controller('api/doodle')
export class DoodleController {
  constructor(private readonly clientProxy: ClientProxyMeetflow) {}

  private _clientProxyDoodle = this.clientProxy.clientProxyDoodle();

  @Post('/create')
  @ApiOperation({ summary: 'Crear doodle' })
  async addProject(@Body() doodle: any, @Req() req: any) {
    console.log('CREANDO DOODLE');
    return this._clientProxyDoodle.send('CREAR_DOODLE', doodle);
  }

  @Get('/get/:id')
  @ApiOperation({ summary: 'obtener doodle por id' })
  async findOne(@Param('id') id: string) {
    return this._clientProxyDoodle.send('BUSCAR_UN_DOODLE', id);
  }

  @Get('/get-all')
  @ApiOperation({ summary: 'obtener todos los doodle' })
  async findAll() {
    return this._clientProxyDoodle.send('BUSCAR_TODOS_DOODLE', '');
  }

  @Put(':id')
  @ApiOperation({ summary: 'actualizar doodle' })
  async update(
    @Param('id') id: string,
    @Body() doodle: any,
  ): Promise<Observable<any>> {
    return this._clientProxyDoodle.send('ACTUALIZAR_DOODLE', {
      id,
      doodle,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'borrar doodle' })
  delete(@Param('id') id: string): Observable<any> {
    return this._clientProxyDoodle.send('BORRAR_DOODLE', id);
  }
}
