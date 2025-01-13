export class TopicDto {
    proposed: string;
    accepted: string;
    description: string;
    inMeetingMinute: boolean;
    elements: string[];
    comissions: string[];
    _id: string;
    createdAt: Date; // Fecha de creación
    updatedAt: Date; // Fecha de actualización
}