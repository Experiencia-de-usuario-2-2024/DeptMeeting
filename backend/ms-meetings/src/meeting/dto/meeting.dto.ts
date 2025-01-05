export class MeetingDTO {
  name: string; // nombre de la reunión (reunion n, donde n incremental positivo)
  description: string; // descripción de la reunión
  number: number; // numbero de la reunión
  googleMeetLink: string; // link de la reunión en google meet
  googleCalendarEvent: string; // evento en google calendar
  state: string; // estado de la reunión (new, pre-meeting, in-meeting, post-meeting, finish)
  project: string[]; // id del proyecto asociado
  createdAt: Date; // fecha de creación
  updatedAt: Date; // fecha de actualización
}
