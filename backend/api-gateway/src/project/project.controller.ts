import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ProjectMSG } from 'src/common/constants';
import { IProject } from 'src/common/interfaces/project.interface';
import { ClientProxyMeetflow } from 'src/common/proxy/client-proxy';
import { ProjectDTO } from './dto/project.dto';
import { firstValueFrom, Observable } from 'rxjs';

@ApiTags('Microservicio de proyectos (microservice-projects)')
@UseGuards(JwtAuthGuard)
@Controller('api/project')
export class ProjectController {
  // Entrada: cliente proxy global
  constructor(private readonly clientProxy: ClientProxyMeetflow) {}

  // Proyectos
  private _clientProxyProject = this.clientProxy.clientProxyProject();

  // Invitados
  /*   private _clientProxyGuest = this.clientProxy.clientProxyGuest(); */

  // cliente proxy de notificaciones
  private _clientProxyNotifications =
    this.clientProxy.clientProxyNotification();

  /* 
  Modelo estructural de datos:

    1. IProject:    Interface

    2. ProjectMSG:  Mensajeria por RabbitMQ

    3. projectDTO:  ProjectDTO: Objeto de transferencia de datos 

  */

  // METODOS CRUD para proyectos

  /*  
  Método para crear un nueva proyecto a partir de un usuario. 
  (se autoasigna como jefe de proyecto al usuario que crea el proyecto)
  entrada: datos del proyecto (nombre corto). 
  salida: objeto de nueva proyecto.  
  */
  @Post('create')
  @ApiOperation({ summary: 'Crear un proyecto' })
  async addProject(@Body() projectDTO: ProjectDTO, @Req() req: any) {
    const userEmail = req.user.email;
    projectDTO.userOwner = userEmail;
    projectDTO.userMembers = userEmail;
    return this._clientProxyProject.send(ProjectMSG.CREATE, projectDTO);
  }

  /*  
  Método para  obtener un proyecto a partir del id.
  entrada: id del proyecto. 
  salida: objeto del proyecto encontrada.  
  */
  @Get('/getProjectbyID/:id')
  @ApiOperation({ summary: 'Obtener proyecto por id' })
  async findOne(@Param('id') id: string) {
    return this._clientProxyProject.send(ProjectMSG.FIND_ONE, id);
  }

  /*  
  Método para  obtener un proyecto a partir del id.
  entrada: id del proyecto. 
  salida: objeto del proyecto encontrada.  
  */
  @Get('/get/all')
  @ApiOperation({ summary: 'Obtener todos los proyectos' })
  async findAll() {
    return this._clientProxyProject.send(ProjectMSG.FIND_ALL, '');
  }

  /*  
  Método para actualizar un proyecto a partir del id.
  entrada: id del proyecto y nuevos datos del proyecto. 
  salida: objeto del proyecto actualizada.
  */
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar proyecto por id' })
  async update(
    @Param('id') id: string,
    @Body() projectDTO: ProjectDTO,
  ): Promise<Observable<IProject>> {
    return this._clientProxyProject.send(ProjectMSG.UPDATE, { id, projectDTO });
  }

  /*  
  Método para borrar permanentemente un proyecto a partir del id.
  entrada: id del proyecto.
  salida: valor booleano de confirmación.
  */
  @Delete(':id')
  @ApiOperation({ summary: 'Borrar permanentemente un proyecto por id' })
  delete(@Param('id') id: string): Observable<any> {
    return this._clientProxyProject.send(ProjectMSG.DELETE, id);
  }

  /*  
  Método para obtener todos los proyectos de un usuario por su id
  entrada: id del usuario que solicita
  salida: objeto del proyecto encontrado.  
  */
  @Get('/get/findByUser')
  @ApiOperation({ summary: 'encuentra proyect' })
  async findAllForUser(@Req() req: any) {
    return await firstValueFrom(
      this._clientProxyProject.send('LIST_PROJECTS', req.user),
    );
  }

  /*  
  Método para añadir un miembro al proyecto
  entrada: email del usuario a añadir
  salida: objeto del proyecto encontrado.  
  */
  @Post(':projectId/add/member/:memberEmail')
  async addMember(
    @Param('projectId') projectId: string,
    @Param('memberEmail') memberEmail: string,
  ) {
    const params = {
      projectId: projectId,
      memberEmail: memberEmail,
    };
    return this._clientProxyProject.send(ProjectMSG.ADD_MEMBER, params);
  }

  /*  
Metodo para notificar un usuario que ha sido invitado a un proyecto
entrada: id de la acta dialógica y nuevos datos de la acta dialógica. 
salida: objeto de la acta dialógica actualizada.
*/
  @Post('/notify/invite/member')
  @ApiOperation({
    summary: 'Notificar al usuario que ha sido invitado a un proyecto',
  })
  sendNotification(@Body() project: any, @Req() req: any) {
    console.log('Solicitando enviar notificación', project);
    console.log('desde', req.user);
    const params = {
      project: project,
      user: req.user,
    };
    return this._clientProxyNotifications.send('SEND_INVITE_MEMBER', params);
  }
}
