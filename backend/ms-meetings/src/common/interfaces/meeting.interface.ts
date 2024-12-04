import { IProject } from "./project.interface";



export interface IMeeting extends Document {
   
    name: string;
    description: string;
    number: number;
    project: IProject;
    invitados: string[]; // correos de los invitados
    anfitrion: string; // correo del anfitrión
    secretario: string // correo del secretario
    fecha: Date; // fecha de la reunión
    horaInicio: string; // hora de la reunión
    horaFinal: string; // duración de la reunión

}