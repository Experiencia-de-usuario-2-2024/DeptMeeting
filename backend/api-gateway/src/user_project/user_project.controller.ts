import { Controller, Post, UseGuards, Body, Param } from '@nestjs/common';
import { ClientProxyMeetflow } from 'src/common/proxy/client-proxy';
import { ApiOperation } from '@nestjs/swagger';
import { UserDTO } from '../user/dto/user.dto';

@Controller('api/user-project')
export class UserProjectController {
  // Entrada: Cliente proxy global
  constructor(private readonly clientProxy: ClientProxyMeetflow) {}

  // Cliente proxy de proyectos
  private _clientProxy = this.clientProxy.clientProxyProject2();  // Va al ms-projects

  @Post('/login/:projectId')
  @ApiOperation({ summary: 'Loguear un usuario en un proyecto' })
  loginUserIntoProject(@Body() userDTO: UserDTO, @Param('projectId') projectId: string) {
    console.log('ProjectId Api gateway: ', projectId);
    return this._clientProxy.send('LOGIN_USER_INTO_PROJECT', {userDTO, projectId});
  }
}
