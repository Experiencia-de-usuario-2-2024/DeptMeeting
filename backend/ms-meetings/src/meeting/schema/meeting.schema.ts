import * as mongoose from 'mongoose';

export const MeetingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // nombre de la reunión (reunion n, donde n incremental positivo)
    description: { type: String, required: true }, // descripción de la reunión
    number: { type: Number, required: true }, // numbero de la reunión
    state: { type: String, required: true }, // estado de la reunión (new, pre-meeting, in-meeting, post-meeting, finish)
    googleMeetLink: { type: String, required: false }, // link de la reunión en google meet
    googleCalendarEvent: { type: String, required: false }, // evento en google calendar
    period: { type: mongoose.Schema.Types.ObjectId, ref: 'period' }, // periodo de la reunión
    project: [{ type: mongoose.Schema.Types.ObjectId, ref: 'projects' }], // id del proyecto asociado
  },
  {
    timestamps: true,
  },
);
