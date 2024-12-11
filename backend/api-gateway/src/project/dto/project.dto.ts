import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class ProjectDTO {
  shortName: string; // Nombre corto del proyecto
  name: string; // nombre extendido del proyecto
  description: string; // descripción del proyecto
  projectDateI: string; // fecha de inicio del proyecto
  projectDateT: string; // fecha de termino del proyecto
  userOwner: string[]; // emails de usuarios jefes de proyecto
  userMembers: string[]; // emails de usuarios miembros
  _id: string; // id
  createdAt: Date; // fecha de creación
  updatedAt: Date; // fecha de actualización
  kanbanColumns: string[]; // columnas del kanban
  metrics: any; // Métricas del proyecto
  status: string; // estado del proyecto
  options: any; // opciones del proyecto -> isAgile, useKanban, etc
  sprints: any; // sprints del proyecto, aqui va el puntaje x dia de cada sprint
  iconUrl: string; // url del icono del proyecto
  pages: any; // páginas del proyecto
  projectFrom: string; // Proyecto padre
}
