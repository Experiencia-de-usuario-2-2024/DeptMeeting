

export class MeetingDTO {
    name: string; // nombre de la reunión (reunion n, donde n incremental positivo)
    description: string; // descripción de la reunión
    number: number; // numbero de la reunión
    state: string; // estado de la reunión (new, pre-meeting, in-meeting, post-meeting, finish)
    project: string[]; // id del proyecto asociado
    createdAt: Date; // fecha de creación
    updatedAt: Date; // fecha de actualización
    invitados: string[]; // correos de los invitados
    anfitrion: string; // correo del anfitrión
    secretario: string // correo del secretario
    fecha: Date; // fecha de la reunión
    horaInicio: string; // hora de la reunión
    horaFinal: string; // duración de la reunión
}