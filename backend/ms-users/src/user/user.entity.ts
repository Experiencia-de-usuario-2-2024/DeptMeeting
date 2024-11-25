import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User {
  @Prop({ required: true, length: 100 })
  name: string;

  @Prop({ required: true, unique: true, length: 100 })
  email: string;

  @Prop({ default: 'Sin institución', length: 100 })
  institution: string;

  @Prop({ default: '', length: 200 })
  avatar: string;

  @Prop({ default: '', length: 200 })
  asignado: string;

  @Prop({ default: '', length: 100 })
  type: string;

  @Prop({ required: true, length: 100 })
  password: string;

  @Prop({ default: 'grey', length: 50 })
  color: string;

  @Prop({ default: '', length: 100 })
  currentProject: string;

  @Prop({ default: '', length: 100 })
  currentProjectId: string;

  @Prop({ default: '', length: 100 })
  currentMeeting: string;

  @Prop({ default: '', length: 100 })
  currentMeetingId: string;

  @Prop({ default: '', length: 100 })
  lastLink: string;

  @Prop({ default: '', length: 100 })
  tagName: string;

  @Prop({ default: false, type: Boolean })
  active: boolean;

  @Prop({ default: '31-12-2024', length: 100 })
  accessDateLimit: string;

  @Prop({ default: Date.now })
  createOn: Date;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);