interface MeetingMinute {
    title: string;
    place: string;
    startTime: string;
    endTime: string;
    startHour: string;
    endHour: string;
    realStartTime: string;
    realEndTime: string;
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
    comenzoReunion: boolean;
    cantElementos: number;
    nombreCortoProyecto: string;
}

interface Reunion {
    name : string;
    description : string;
    number : number;
    state : string;
    project : string[];
    createdAt: string;
    updatedAt: string;
}

interface ProyectoUser {
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

// Interfaz para los datos del perfil de un usuario
interface Usuario {
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
    active: Boolean;
    accessDateLimit: string;
    createOn: Date;
}

// Interfaz para los datos de las tareas/compromisos de un usuario
interface Compromiso {
    description: string; // *
    type: string; // *
    participants: string; // *
    topic: number;
    meeting: string; // *
    project: string; // *
    meetingMinute: string;
    state: string; // *
    number: number;
    dateLimit: string;
    timeLimit: string;
    position: string;
    isSort: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
    disagreement: JSON;
}

// interfaz para obtener los datos de los estudiantes
interface Estudiantes {
    email: string;
    value: string;
    label: string;
}

interface ProfesorOwner {
    email: string;
    value: string;
    label: string;
}

// interfaz para guardar los datos del elemento dialogico que se crea
interface ElementoDialogico {
    description: string;
    type: string;
    participants: string[];
    topic: number;
    meeting: string;
    project: string;
    meetingMinute: string;
    state: string;
    number: number;
    dateLimit: string;
    timeLimit: string;
    createdAt: string;
    position: string;
}
// interfaz para obtener los datos de los estudiantes invitados
interface EstudiantesInvitados {
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
    active: Boolean;
    accessDateLimit: string;
    createOn: Date;
    currentProject: string;
    currentProjectId: string;
    currentMeeting: string;
    currentMeetingId: string;
    proyectoPrincipal: string
    lastLink: string;
}

export {MeetingMinute, Reunion, ProyectoUser, Usuario, Compromiso, Estudiantes, ProfesorOwner, ElementoDialogico, EstudiantesInvitados};
