export interface IUser {
  id: string; // id
  name: string; // nombre del usuario
  email: string; // email del usuario
  institution: string; // institución del usuario
  password: string; // contraseña del usuario
  color: string; //  tag color que aparece en las siglas del nombre como perfil
  currentProject: string; // nombre del último proyecto visitado
  currentProjectId: string; // id del último proyecto visitado
  currentMeeting: string; // nombre de la última reunion visitada
  currentMeetingId: string; // id de la última reunión visistada
  lastLink: string; // último link visitado dentro de la plataforma
  tagName: string; // 3 siglas que representan el nombre del usuario
  active: boolean; // si usuario esta bloqueado o no bloqueado dentro de la plataforma
  accessDateLimit: string; // fecha limite en que se da acceso a usuario
  createOn: Date; // fecha de creación del usuario
}
