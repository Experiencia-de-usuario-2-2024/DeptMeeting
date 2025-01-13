import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IProject } from 'src/common/interfaces/project.interface';
import { PROJECT } from 'src/common/models/models';
import { ProjectDTO } from './dto/project.dto';
import { PeriodService } from './period.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(PROJECT.name) private readonly model: Model<IProject>,
    private readonly periodService: PeriodService,
  ) {}

  /*  
  Método para crear un nueva proyecto a partir de un usuario. 
  (se autoasigna como jefe de proyecto al usuario que crea el proyecto)
  entrada: datos del proyecto (nombre corto). 
  salida: objeto de nueva proyecto.  
  */
  async createProject(projectDTO: any) {
    console.log('projectDTO:', projectDTO);
    const { idPeriod, ...restProject } = projectDTO;
    const newProject = new this.model({...restProject, period: idPeriod});
    const project = await newProject.save();
    const period = await this.periodService.findById(idPeriod);
    if (!period) {
      throw new Error('Period not found');
    }
    await this.periodService.addCommission(idPeriod, project._id.toString());
    return project;
  }

  /*  
  Método para  obtener todos los proyectos
  */
  async findAll(): Promise<IProject[]> {
    return await this.model.find().populate('guests');
  }

  /*  
  Método para  obtener un proyecto a partir del id.
  entrada: id del proyecto. 
  salida: objeto del proyecto encontrada.  
  */
  async findOne(id: string): Promise<IProject> {
    const projectById = await this.model.findById(id);
    return await this.model.findById(id);
  }

  /*  
  Método para actualizar un proyecto a partir del id.
  entrada: id del proyecto y nuevos datos del proyecto. 
  salida: objeto del proyecto actualizada.
  */
  async update(id: string, projectDTO: ProjectDTO): Promise<IProject> {
    return await this.model.findByIdAndUpdate(id, projectDTO, { new: true });
  }

  /*  
  Método para borrar permanentemente un proyecto a partir del id.
  entrada: id del proyecto.
  salida: valor booleano de confirmación.
  */
  async delete(id: string) {
    await this.model.findByIdAndDelete(id);
    return {
      status: HttpStatus.OK,
      msg: 'Deleted',
    };
  }

  /*  
  Método para añadir un invitado al proyecto.
  entrada: id del proyecto e id del invitado
  salida: objeto del proyecto con nuevo invitado añadido.  
  */
  async addGuest(projectId: string, guestId: string): Promise<IProject> {
    return await this.model
      .findByIdAndUpdate(
        projectId,
        {
          $addToSet: { guests: guestId },
        },
        { new: true },
      )
      .populate('guests');
  }

  /*  
  Método para obtener todos los proyectos de un usuario por su id
  entrada: id del usuario que solicita
  salida: objeto del proyecto encontrado.  
  */
  async findAllForUser(user: any) {
    const projectsByUser = await this.model.find({ userMembers: user.email });
    return projectsByUser;
  }

  /*  
  Método para añadir un miembro al proyecto
  entrada: email del usuario a añadir
  salida: objeto del proyecto encontrado.  
  */
  async addMember(projectId: string, memberEmail: string): Promise<IProject> {
    return await this.model.findByIdAndUpdate(
      projectId,
      {
        $addToSet: { userMembers: memberEmail },
      },
      { new: true },
    );
  }

  async getProjectsById(ids: string[]) {
    return await this.model.find({ _id: { $in: ids } }).lean();
  }
}
