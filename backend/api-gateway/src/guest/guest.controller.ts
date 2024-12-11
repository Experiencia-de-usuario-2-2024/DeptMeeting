import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GuestMSG } from 'src/common/constants';
import { IGuest } from 'src/common/interfaces/guest.interface';
import { ClientProxyMeetflow } from 'src/common/proxy/client-proxy';
import { GuestDTO } from './dto/guest.dto';

/* @ApiTags('guests') */
/* @UseGuards(JwtAuthGuard) */
@Controller('api/guest')
export class GuestController {
  constructor(private readonly clientProxy: ClientProxyMeetflow) {}

  // IMPORTANTE!!!! IMPLEMENTACIÖN HACIA MICROSERVICIO DE INVITADOS (GUEST) OBSOLETO
  // IMPORTANTE!!!! NO UTILIZAR MICROSERVICIO GUEST, PREFIERA USAR MICROSERIVICIO USERS

  // Invitados
/*   private _clientProxyGuest = this.clientProxy.clientProxyGuest(); */

 /*  @Post()
  create(@Body() guestDTO: GuestDTO): Observable<IGuest> {
    return this._clientProxyGuest.send(GuestMSG.CREATE, guestDTO);
  } */

  /* @Get()
  findAll(): Observable<IGuest[]> {
    return this._clientProxyGuest.send(GuestMSG.FIND_ALL, '');
  }
 */
  /* @Get('/remembers/:id')
  findOne(@Param('id') id: string): Observable<IGuest> {
    return this._clientProxyGuest.send(GuestMSG.FIND_ONE, id);
  } */

  /* @Put(':id')
  update(
    @Param('id') id: string,
    @Body() guestDTO: GuestDTO,
  ): Observable<IGuest> {
    return this._clientProxyGuest.send(GuestMSG.UPDATE, { id, guestDTO });
  } */

 /*  @Delete(':id')
  delete(@Param('id') id: string): Observable<any> {
    return this._clientProxyGuest.send(GuestMSG.DELETE, id);
  } */
}
