import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PERIOD } from 'src/common/models/models';
import { IPeriod } from '../common/interfaces/period.interface';

@Injectable()
export class PeriodService {
  constructor(
    @InjectModel(PERIOD.name) private readonly model: Model<IPeriod>,
  ) {}

  /*
    Método para crear un nuevo periodo a partir de un usuario.
    (solo se puede crear por el admin).
    salida: objeto de un nuevo periodo.
    */
  async create(periodDTO: any) {
    const newPeriod = new this.model(periodDTO);
    return await newPeriod.save();
  }

  /*
    Método para  obtener todos los periodos
    */
  async findAll(): Promise<IPeriod[]> {
    return await this.model.find().populate('commissions');
  }

  /*
    Método para actualizar un periodo a partir del id.
    entrada: id del periodo y nuevos datos del periodo.
    salida: objeto del periodo actualizada.
    */
  async update(id: string, periodtDTO: any): Promise<IPeriod> {
    return await this.model.findByIdAndUpdate(id, periodtDTO, { new: true });
  }

  /*
    Método para borrar permanentemente un periodo a partir del id.
    entrada: id del periodo.
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
    Método para añadir una comision al periodo.
    entrada: id del periodo e id de la comision
    salida: objeto del periodo con nueva comision añadida.
    */
  async addCommission(periodId: string, commissionId: string): Promise<IPeriod> {
    return await this.model
      .findByIdAndUpdate(
        periodId,
        {
          $addToSet: { commissions: commissionId },
        },
        { new: true },
      )
      .populate('commissions');
  }

  /*
    Método para añadir una reunion al periodo.
    entrada: id del periodo e id de la reunion
    salida: objeto del periodo actualizado.
    */
  async addMeeting(periodId: string, meetingId: string): Promise<IPeriod> {
    return await this.model.findByIdAndUpdate(
      periodId,
      {
        $addToSet: { userMembers: meetingId },
      },
      { new: true },
    );
  }
}
