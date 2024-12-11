import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
import * as process from "process";

@Injectable()
export class ProjectService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  //* Obtener proyecto por id
  async getProjectById(id: string): Promise<any> {
    try {
      // Seleccionar db y collection
      const db = this.connection.useDb(`${process.env.DATABASE_PROJECTS}`);
      const collection = db.collection('projects');

      // Obtener el proyecto por id
      const data = await collection.find({ _id: new Types.ObjectId(id) }).toArray();

      // Verificar si está vacío
      if (data.length === 0) {
        throw new Error('Project not found');
      }

      return data[0];
    } catch (error) {
      console.error('Error in getProjectById: ', error);
      throw error;
    }
  }

  //* Obtener reuniones por id de proyecto
  async getMeetingsByIdProject(id: string): Promise<any> {
    try {
      const db = this.connection.useDb(`${process.env.DATABASE_MEETINGS}`);
      const collection = db.collection('meetings');
      const meetings = await collection.find({project: new Types.ObjectId(id)}).toArray();
      return meetings;
    } catch (error) {
      console.error('Error in getMeetingsByIdProject: ', error);
      throw error;
    }
  }

  // Obtener minutas por id de reunion
  async getMeetingMinutesByIdMeeting(id: string): Promise<any> {
    try {
      const db = this.connection.useDb(`${process.env.DATABASE_MEETINGMINUTES}`);
      const collection = db.collection('meeting-minutes');
      const meetingminutes = await collection.find({meeting: id}).toArray();
      return meetingminutes;
    } catch (error) {
      console.error('Error in getMeetingsByIdProject: ', error);
      throw error;
    }
  } 

  // Obtener asistencias de integrantes de un proyecto por id de proyecto
  async findAssistsById2(id: string): Promise<any> {
    try {
      // Obtener proyecto
      const proyecto = await this.getProjectById(id);

      // Obtener miembros del proyecto
      const miembros = proyecto.userMembers;
      console.log('findAssistsById: ', miembros);
  
      // Obtener la lista de reuniones
      const reuniones = await this.getMeetingsByIdProject(id);

      // Obtener las minutes de las reuniones
      const minutes = [];
      for (const reunion of reuniones) {
        const minutas = await this.getMeetingMinutesByIdMeeting(reunion._id);
        minutes.push(minutas);
      }
      return miembros;
    } catch (error) {
      console.error('Error in findAssistsById: ', error);
      throw error;
    }
  }

  async findAssistsById(id: string): Promise<any> {
    //  * Los participantes son los que están invitados
    //  * Los asistentes son los que realmente asistieron a la reunion (y que fueron invitados)
    try {
      const proyecto = await this.getProjectById(id); // Obtener proyecto
      const miembros = proyecto.userMembers; // Obtener miembros del proyecto
      const reuniones = await this.getMeetingsByIdProject(id); // Obtener la lista de reuniones
  
      // Obtener las minutes de las reuniones en paralelo
      const meetingIds = reuniones.map(reunion => reunion._id);
      const minutesPromises = meetingIds.map(meetingId => this.getMeetingMinutesByIdMeeting(meetingId.toString()));
      const minutes = await Promise.all(minutesPromises);

      // Crear objeto de salida (Diccionario donde x: correo, y: asistencias)
      let salida = {}
      for(let miembro of miembros){
        salida[miembro] = 0
      }
      
      // Recorrer minutas de reunión, complejidad O(n^2)
      for(let minute of minutes){
        const minuta_actual = minute[0]
        const asistentes_minute = minuta_actual.assistants // Obtener los asistentes de la minuta
        
        // Recorrer asistentes de la minuta actual
        for(let correo of asistentes_minute){
          // Aumentar el contador
          salida[correo] += 1
        }
      }
      console.log('Salida: ', salida)
      return salida;
    } catch (error) {
      console.error('Error in findAssistsById: ', error);
      throw error;
    }
  }
  
  
}
