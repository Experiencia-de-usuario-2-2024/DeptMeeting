import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserSchema, UserDocument } from "./schema/user.schema";
import { Model, Document } from 'mongoose';
import { v4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { IUser } from 'src/common/interfaces/user.interface';
import { UserDTO } from './dto/user.dto';
import {User} from "./user.entity";

@Injectable()
export class UserService {
  constructor(
      @InjectModel(User.name)
      private userModel: Model<UserDocument>,
  ) {}

  /*  
   Método para generar una nueva contraseña encriptada
  */
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  /*  
   Método para crear un nuevo usuario.
   entrada: datos del usuario. 
   salida: objeto del nuevo usuario.  
  */
  async create(userDTO: UserDTO): Promise<User> {
    const { tagName, name, email, avatar, asignado, password, type } = userDTO;
    const activationToken = v4();
    const hash = await this.hashPassword(password);
    const userValidate = await this.findByEmail(userDTO.email);
    if (!userValidate) {
      const user = new this.userModel({
        name,
        tagName,
        email,
        avatar,
        asignado,
        password: hash,
        type,
        color: 'grey'
      });
      return await user.save();
    } else {
      return null;
    }
  }

  /*  
  Método para  obtener un usuario a partir del email.
  entrada: email del usuario. 
  salida: objeto del usuario encontrado.  
  */
  async findOneByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({email});
  }

  /*
  Método para resetear la contraseña a una nueva y enviarla por correo electronico
  entrada: email del usuario que solicita restablecer contraseña
  salida: usuario con contraseña nueva generada aleatoriamente
*/
  async requestResetPassword(
      emailUser: string,
  ): Promise<any> {
    let user = (await this.findOneByEmail(emailUser)) as UserDocument & Document;
    const password = v4();
    const hash = await this.hashPassword(password);
    user.password = hash;
    await user.save();
    user.password = password;
    return user;
  }

  // validar contraseña ingresada vs la encontrada en base de datos
  async checkPassword(password: string, passwordDB: string): Promise<boolean> {
    return await bcrypt.compare(password, passwordDB);
  }

  /*  
  Método para obtener todos los usuarios registrados.
  salida: llista con todos los usuarios registrados.  
  */
  async findAll(): Promise<UserDocument[]> {
    return await this.userModel.find().exec();
  }

  /*  
  Método para obtener un usuario a partir del id.
  entrada: id del usuario. 
  salida: objeto del usuario encontrado.  
  */
  async findOne(ide: string): Promise<User> {
    return this.userModel.findById(ide).exec();
  }


  /*  
Método para actualizar un usuario a partir del id.
entrada: id del usuario y nuevos datos del usuario. 
salida: objeto del usuario actualizada.
*/
  async update(ide: string, userDTO: UserDTO): Promise<any> {
    const { name, institution, email, avatar, asignado, tagName, type, currentProject, currentProjectId, currentMeeting, currentMeetingId, proyectoPrincipal, password } = userDTO;
    const hash = await this.hashPassword(userDTO.password);
    return await this.userModel.findByIdAndUpdate(ide, {
      name,
      institution,
      email,
      avatar,
      asignado,
      tagName,
      type,
      currentProject,
      currentProjectId,
      currentMeeting,
      currentMeetingId,
      proyectoPrincipal,
      password: hash
    }, { new:true }).exec();
  }

  /*  
  Método para actualizar el color de un usuario
  entrada: usuario y su color
  salida: usuario con color actualizado
  */
  async updateColor(ide: string, userDTO: UserDTO): Promise<UserDocument> {
    const { color } = userDTO;
    return await this.userModel.findByIdAndUpdate(ide, { color }, { new: true }).exec();
  }

  /*  
    Método para actualizar la última sección que visito el usuario
    entrada: usuario y los datos de su ultima sección
    salida: usuario con su última sección visitada actualizada
  */
  async updateCurrentSection(ide: string, userDTO: UserDTO): Promise<UserDocument> {
    const { name, institution, email, currentProject, currentMeeting, lastLink, currentProjectId, currentMeetingId, proyectoPrincipal} = userDTO;
    return await this.userModel.findByIdAndUpdate(ide, {
      name,
      institution,
      email,
      currentProject,
      currentMeeting,
      lastLink,
      currentProjectId,
      proyectoPrincipal,
      currentMeetingId
    }, { new: true }).exec();
  }

    /*  
  Método para actualizar el límite de acceso de un usuario
  entrada: usuario y su color
  salida: usuario con color actualizado
  */
  async updateAccessDateLimit(ide: string, userDTO: UserDTO): Promise<UserDocument> {
    const accessDateLimit = userDTO.accessDateLimit;
    return await this.userModel.findByIdAndUpdate(ide, { accessDateLimit }, { new: true }).exec();
  }
  
  /*  
  Método para borrar permanentemente un usuario a partir del id.
  entrada: id del usuario.
  salida: valor booleano de confirmación.
  */
  async delete(id: string): Promise<any> {
    await this.userModel.findByIdAndRemove(id);
    return { status: HttpStatus.OK, msg: 'deleted' };
  }

  /*  
  Método para calcular la cantidad de usuarios totales en la plataforma
  salida: cantidad de usuarios
   */
  async countUsers(): Promise<any> {
    return await this.userModel.countDocuments().exec();
  }

  /*  
  Método para buscar un usuario por email
   */
  async findByEmail(emaile: string): Promise<UserDocument> {
    return await this.userModel.findOne({email: emaile}).exec()
  }

  // ******************** NUEVOS METODOS ********************

  /*  
  Método para  obtener los usuarios asignados a un profesor
  entrada: email del usuario. 
  salida: objeto del usuario encontrado.  
  */
  async findAllByEmail(email: string): Promise<any> {
    // return this.userModel.findOne({email});
    return this.userModel.where({asignado: [email]});
  }


  async updateByEmailVer2(correo: string, userDTO: UserDTO): Promise<UserDocument> {
    const { name, institution, email, currentProject, currentMeeting, lastLink, currentProjectId, currentMeetingId, proyectoPrincipal } = userDTO;
    // console.log("CORREO QUE LLEGA en ms service: ", correo);
    return await this.userModel.findOneAndUpdate({email: correo}, {
      name,
      institution,
      email,
      currentProject,
      currentMeeting,
      lastLink,
      currentProjectId,
      currentMeetingId,
      proyectoPrincipal
    }, { new: true }).exec();
  }



}
