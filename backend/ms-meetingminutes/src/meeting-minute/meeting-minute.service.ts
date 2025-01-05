import {HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {IMeetingMinute} from 'src/common/interfaces/meeting-minute.interface';
import {MEETINGMINUTE, TOPIC} from 'src/common/models/models';
import {MeetingMinuteDTO} from './dto/meeting-minute.dto';
import {TopicDto} from "./dto/topic.dto";
import {ITopic} from "../common/interfaces/topic.interface";

@Injectable()
export class MeetingMinuteService {
  constructor(
    @InjectModel(MEETINGMINUTE.name)
    private readonly model: Model<IMeetingMinute>,
    @InjectModel(TOPIC.name)
    private readonly modelTopic: Model<ITopic>,
  ) {}

  /*  
     Método para crear una nueva acta dialógica.
     entrada: datos del acta dialógica. 
     salida: objeto de nueva acta dialógica.  
  */
  async create(
    meetingMinuteDTO: MeetingMinuteDTO,
    user: any,
  ): Promise<IMeetingMinute> {
    const newMeetingMinute = new this.model(meetingMinuteDTO);
    return await newMeetingMinute.save();
  }

  /*  
    Método para obtener todas las actas dialógicas.
    salida: objeto de actas dialógicas encontradas. 
  */
  async findAll(): Promise<any[]> {
    console.log('Buscando en la base de datos todas las actas');
    return await this.model.find();
  }

  /*  
   Método para  obtener una acta dialógica a partir del id.
  entrada: id de la acta dialógica. 
   salida: objeto de la acta dialógica encontrada.  
  */
  async findOne(id: string): Promise<any> {
    const meetingMinute = await this.model.find({ _id: id });
    return meetingMinute;
  }

  /*  
      Método para actualizar una acta dialógica a partir del id.
      entrada: id de la acta dialógica y nuevos datos de la acta dialógica. 
      salida: objeto de la acta dialógica actualizada.
  */
  async update(
    id: string,
    meetingMinuteDTO: MeetingMinuteDTO,
  ): Promise<IMeetingMinute> {
    return await this.model.findByIdAndUpdate(id, meetingMinuteDTO, {
      new: true,
    });
  }

  /*  
    Método para borrar permanentemente una acta dialógica a partir del id.
    entrada: id de la acta dialógica.
    salida: valor booleano de confirmación.
  */
  async delete(id: string): Promise<any> {
    await this.model.findByIdAndDelete(id);
    return {
      status: HttpStatus.OK,
      msg: 'Deleted',
    };
  }

  // metodos nuevos
  async encontrarPorReunion(idReunion: string): Promise<any> {
    console.log(
      'Buscando en la base de datos todas las actas de la reunion: ',
      idReunion,
    );
    const meetingMinute = await this.model.find({ meeting: idReunion });
    console.log('Actas encontradas: ', meetingMinute);
    return meetingMinute;
  }

  async actualizarTema(
    id: string,
    topicDTO: TopicDto,
  ): Promise<any> {
    console.log('params', topicDTO);
    const response = await this.modelTopic.findByIdAndUpdate(
        id,
        {$set: topicDTO},
        {new: true},
    );
    console.log('Tema actualizado: ', response);
    return response;
  }

  async crearTema(
    idMeetingMinute: string,
    topicDTO: TopicDto,
  ): Promise<any> {
    console.log('params', topicDTO);
    const topic = new this.modelTopic(topicDTO);
    const newTopic = await topic.save();
    console.log('Tema creado: ', newTopic);
    const meetingMinute = await this.model.findByIdAndUpdate(
        idMeetingMinute,
        {$push: {topics: newTopic._id}},
        {new: true},
    )
        .populate('topics')
        .exec();
    console.log('Acta actualizada: ', meetingMinute);
    return meetingMinute;
  }

    async borrarTema(id: string): Promise<any> {
        await this.modelTopic.findByIdAndDelete(id);
        await this.model.findOneAndUpdate(
          { topics: id },
          { $pull: { topics: id } },
          { new: true }
      );
        return {
        status: HttpStatus.OK,
        msg: 'Deleted',
        };
    }

   async obtenerTemasPorId(ids: string[]) {
    const topics = await this.modelTopic.find({ _id: { $in: ids } }).lean();
     return ids.map(id => topics.find(topic => topic._id.toString() === id));
  }
}
