import { IGuest } from "./guest.interface";

export interface IProject extends Document {
  name: string;
  description: string;
  projectDate: string;
  guests: IGuest[];
  userOwner: string;
  shortName: string;
  color: string;
  }
  