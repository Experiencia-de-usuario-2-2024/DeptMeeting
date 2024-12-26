import { IProject } from './project.interface';

export interface IPeriod extends Document {
  name: string;
  description: string;
  dateI: string;
  dateT: string;
  commissions: IProject[];
  meetings: string[];
}
