export class UserDTO {
  id: string; // id
  name: string; // nombre del usuario
  email: string; // email del usuario
  avatar: string; // avatar del usuario en formato url (imagen almacenada en la nube)
  asignado: string; // correo del usuario profesor al que esta asignado el usuario estudiante (en caso de que el sea profesor, este campo queda vacio)
  institution: string; // institución del usuario -> NO SE UTILIZA
  type: string; // tipo de usuario (profesor, estudiante, invitado -> ESTE ULTIMO NO SE ESTA UTILIZANDO)
  password: string; // contraseña del usuario
  color: string; //  tag color que aparece en las siglas del nombre como perfil --> NO SE UTILIZA
  currentProject: string; // nombre del último proyecto visitado
  currentProjectId: string; // id del último proyecto visitado
  currentMeeting: string; // nombre de la última reunion visitada //PARA PROPOSITOS DE ESTE TRABAJO: aqui se guardara el estado en el que se encuentra el acta dialogica (pre, en, post y finalizada)
  currentMeetingId: string; // id de la última reunión visistada -> id de la ultima acta dialogica
  proyectoPrincipal: string // nombre del proyecto principal del estudiante
  lastLink: string; // último link visitado dentro de la plataforma // PARA PROPOSITOS DE ESTE TRABAJO: aqui se guardara el id de la ultima reunion en la que participo el estudiante
  tagName: string; // 3 siglas que representan el nombre del usuario
  active: boolean; // si usuario esta bloqueado o no bloqueado dentro de la plataforma
  accessDateLimit: string; // fecha limite en que se da acceso a usuario
  createOn: Date; // fecha de creación del usuario
}
