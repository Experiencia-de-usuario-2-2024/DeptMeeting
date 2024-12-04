import * as mongoose from 'mongoose';

export const elementSchema = new mongoose.Schema(
    {
        // Tarjeta trello
        description: {type: String, required: true},
        adjuntos: [{type: String, required: false}],
        checklist: [{type: Object, required: false}],
        puntaje: {type: Number, required: false},
        dificultad: {type: String, required: false},
        type:  {type: String, required: false },
        participants:  [{type: String, required: false }],
        topic:  {type: Number, required: false },
        state: {type: String, required: false },
        dateLimit: {type: String, required: false },
        timeLimit: {type: String, required: false},

        // Referencias
        meeting: {type: String, required: false },
        project: {type: String, required: false },
        meetingMinute: {type: String, required: false },
        number: {type: Number, required: false },

        // Actua dialógica: desacuerdo
        disagreement: { firstPosition: { 
            responsible: { type: String, required: false }, 
            description: { type: String, required: false } }, 
        secondPosition: { 
            responsible: { type: String, required: false }, 
            description: { type: String, required: false } } },

        // Para el in-meeting component
        blocked: {type: Boolean, required: false },
        blockedBy: {type: String, required: false },

        // Sin usar
        position: {type: String, required: false },
        isSort: {type: String, required: false },
    },
    {
        timestamps: true,
    },
);

