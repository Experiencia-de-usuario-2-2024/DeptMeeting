import * as mongoose from 'mongoose';

export const MeetingSchema = new mongoose.Schema(
    {
        name: {type: String, required: true }, // nombre de la reunión (reunion n, donde n incremental positivo)
        description: {type: String, required: true}, // descripción de la reunión
        number: {type: Number, required: true}, // numbero de la reunión
        state: {type: String, required: true},  // estado de la reunión (new, pre-meeting, in-meeting, post-meeting, finish)
        project: [{type: mongoose.Schema.Types.ObjectId, ref: 'projects'}], // id del proyecto asociado
        invitados: [{type: String, required: true}], // correos de los invitados
        anfitrion: {type: String, required: true}, // correo del anfitrión
        secretario: {type: String, required: true}, // correo del secretario
        fecha: {type: Date, required: true}, // fecha de la reunión
        horaInicio: {type: String, required: true}, // hora de la reunión
        horaFinal: {type: String, required: true}, // duración de la reunión
    },
    {
        timestamps: true,
    },
);

