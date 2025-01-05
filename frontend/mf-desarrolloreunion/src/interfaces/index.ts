export interface MeetingMinute {
  title: string;
  place: string;
  startTime: string;
  endTime: string;
  startHour: string;
  endHour: string;
  realStartTime?: string;
  realEndTime?: string;
  topics: string[];
  participants: string[];
  assistants: string[];
  externals: string[];
  secretaries: string[];
  leaders: string[];
  links: string[];
  number: number;
  meeting: string;
  _id: string;
  cantElementos?: number;
  nombreCortoProyecto: string;
  comenzoReunion: boolean;
}

export interface Usuario {
  color: string;
  email: string;
  name: string;
  avatar: string;
  password: string;
  tagName: string;
  type: string;
  __v: number;
  _id: string;
  asignado: string;
  active: boolean;
  accessDateLimit: string;
  createOn: Date;
}

export interface Compromiso {
  description: string;
  type: string;
  participants: string;
  topic: number; 
  meeting: string;
  project: string;
  meetingMinute: string;
  state: string;
  number: number;
  dateLimit: string;
  timeLimit: string;
  position: string;
  isSort: string;  
  _id: string;
  createdAt: string;
  updatedAt: string;
  disagreement: Record<string, any>;
}

export interface ProyectoUser {
  shortName: string;
  name: string;
  description: string;
  projectDateI: string;
  projectDateT: string;
  guests: string;
  userOwner: string;
  userMembers: number;
  _id: string;
}
