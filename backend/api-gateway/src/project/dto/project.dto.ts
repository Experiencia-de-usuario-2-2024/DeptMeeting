
export class ProjectDTO {

  shortName: string; // Nombre cordo del proyecto
  name: string; // nombre extendido del proyecto
  description: string; // descripción del proyecto
  projectDateI: string; // fecha de inicio del proyecto
  projectDateT: string; // fecha de termino del proyecto
  userOwner: string[]; // emails de usuarios jefes de proyecto
  userMembers: string[]; // emails de usuarios miembros
  userMembersOriginal: string[]; // emails de usuarios miembros VERSION ORIGINAL -> atributo nuevo. Su funcion es restaurar los usuarios originales una vez finalice la reunion en la que se invito gente externa al proyecto
  _id: string; // id
  createdAt: Date; // fecha de creación
  updatedAt: Date; // fecha de actualización
}
