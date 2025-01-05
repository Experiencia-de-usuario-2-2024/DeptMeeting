import * as mongoose from 'mongoose';

export const PeriodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // nombre del periodo
    description: { type: String, required: false }, // descripción del periodo
    dateI: { type: String, required: false }, // fecha de inicio del periodo
    dateT: { type: String, required: false }, // fecha de termino del periodo
    commissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'projects' }],
    meetings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'meetings' }],
  },
  {
    timestamps: true,
  },
);
