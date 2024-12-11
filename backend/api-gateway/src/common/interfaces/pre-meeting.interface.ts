import { IMeetingMinute } from "./meeting-minute.interface";

export interface IPreMeeting extends Document{
    meeting: string[]; // id de la reunión asociada
    _id: string; // id
    createdAt: Date; // fecha de creación
    updatedAt: Date; // fecha de actualización
    meetingMinutes: IMeetingMinute;
}
