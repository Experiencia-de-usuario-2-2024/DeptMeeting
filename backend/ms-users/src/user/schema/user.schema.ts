import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  avatar: { type: String, required: false }, // avatar del usuario en formato url (imagen almacenada en la nube)
  asignado: { type: String, required: false }, 
  institution: { type: String, required: false },
  color: { type: String, required: false },
  type: { type: String, required: false },
  currentProject: { type: String, required: false },
  currentProjectId: { type: String, required: false },
  currentMeeting: { type: String, required: false }, //PARA PROPOSITOS DE ESTE TRABAJO: aqui se guardara el estado en el que se encuentra el acta dialogica (pre, en, post y finalizada)
  currentMeetingId: { type: String, required: false }, //-> id de la ultima acta dialogica
  proyectoPrincipal: { type: String, required: false }, // nombre del proyecto principal del estudiante
  lastLink: { type: String, required: false }, // PARA PROPOSITOS DE ESTE TRABAJO: aqui se guardara el id de la ultima reunion en la que participo el estudiante
  tagName: { type: String, required: false },
  active: { type: Boolean, required: false },
  accessDateLimit: { type: String, required: false },
  createOn: { type: Date, required: false },
  role: { type: String, required: true }, // Rol de usuario de meeting engine (admin, user, y quizás pmo)
  links: { type: mongoose.Schema.Types.Mixed, required: false }, // links de acceso a las diferentes secciones de la plataforma {gdrive: String, linkedin: String ...}
  estadisticas: { type: mongoose.Schema.Types.Mixed, required: false }, // estadisticas del usuario {asistencias, elementos creados, inasistencias, etc.}
  firma: { type: String, required: false } // firma del usuario (imagen en base64)
});

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  avatar: string;
  asignado: string;
  institution: string;
  color: string;
  type: string;
  currentProject: string;
  currentProjectId: string;
  currentMeeting: string;
  currentMeetingId: string;
  proyectoPrincipal: string;
  lastLink: string;
  tagName: string;
  active: boolean;
  accessDateLimit: string;
  createOn: Date;
  role: string;
  links: any;
  estadisticas: any;
  firma: string;
}