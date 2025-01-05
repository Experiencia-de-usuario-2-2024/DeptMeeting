export interface MeetingForm {
  objetivo: string;
  lugar: string; 
  fechaInicio: Date;
  fechaTermino: Date;
  participantes: string[];
  anfitriones: string[];
  secretario: string;
}

export interface MeetingState {
  verActaDialogica: boolean;
  iniciarFormulario: boolean;
  meetingMinute: MeetingMinute | null;
  participants: User[];
  messages: string[];
  googleMeet: string | null;
}
