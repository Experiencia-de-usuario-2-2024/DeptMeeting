import * as mongoose from 'mongoose';

export const ProjectSchema = new mongoose.Schema(
  {
    shortName: { type: String, required: false },  // Nombre cordo del proyecto
    name: { type: String, required: true }, // nombre extendido del proyecto
    description: { type: String, required: true }, // descripción del proyecto
    projectDateI: { type: String, required: false }, // fecha de inicio del proyecto
    projectDateT: { type: String, required: false }, // fecha de termino del proyecto
    guests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'guests' }], // emails de usuarios invitados
    userOwner: [{type: String}], // emails de usuarios jefes de proyecto
    userMembers: [{type: String}], // emails de usuarios miembros
    userMembersOriginal: [{type: String}], // emails de usuarios miembros VERSION ORIGINAL -> atributo nuevo. Su funcion es restaurar los usuarios originales una vez finalice la reunion en la que se invito gente externa al proyecto
    taskScore: {type: String, enum: ['equal', 'difficulty', 'manual'], required: true}, // Tipo de puntaje de tareas
    chat: {type: Boolean, required: true}, // Si se habilita o no el chat
    userTypes: [{type: String, required: true}],  // Lista de tipos de usuarios
    status: {type: String, enum: ['borrador', 'publicado']},
    kanbanColumns: [{type: String}], // columnas del kanban
    metrics: {type: mongoose.Schema.Types.Mixed, required: false}, // Métricas del proyecto
    options: {type: mongoose.Schema.Types.Mixed, required: false}, // opciones del proyecto -> isAgile, useKanban, etc
    sprints: {type: mongoose.Schema.Types.Mixed, required: false}, // sprints del proyecto, aqui va el puntaje x dia de cada sprint
    iconUrl: {type: String, required: false}, // url del icono del proyecto
    pages: {type: mongoose.Schema.Types.Mixed, required: false}, // páginas del proyecto
    projectFrom: {type: String, required: false}, // Proyecto padre
  },
  { timestamps: true },
);
