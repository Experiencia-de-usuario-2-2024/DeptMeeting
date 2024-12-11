
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class ElementDTO{
    _id: string; // id
    createdAt: Date; // fecha de creación
    updatedAt: Date; // fecha de actualización

    // Tarjeta trello
    description: string; // descripción del elemento MARKDOWN
    adjuntos: string[]; // adjuntos del elemento en base64
    checklist: Object[]; // lista de chequeo de subtareas para medir el progreso
    puntaje: number; // puntaje asignado al elemento
    dificultad: string; // dificultad asignada al elemento
    type: string; // compromiso, duda, acuerdo, desacuerdo
    participants: string[]; // responsables, representantes o encargados
    topic: number; // numero del tema en que se ha añadido
    state: string; // new, desarrollo, pausada, evaluando, finalizado, borrada
    dateLimit: string; // fecha limite para resolver el compromiso, o fecha en que se creo el acuerdo, duda o desacuerdo
    timeLimit: string; // Hora limite para resolver el compromiso, u hora  en que se creo el acuerdo, duda o desacuerdo
    
    // Referencias
    meeting: string[]; // id de la reunión en la que se añadio el elemento
    project: string[]; // id del proyecto en el que se añadio el elemento
    meetingMinute: string; // id de acta dialogica en que se añadio el elemento
    number: number; // numero de la reunión en que se añadio el elemento

    // Acta dialógica: desacuerdo
    disagreement:  // En caso de ser elemento dialogico de desacuerdo, existen dos posturas
    {
        firtPosition: {
            responsible: String,
            description: String
        },
        secondPosition: {
            responsible: String,
            description: String
        }
    };

    // Para el in-meeting component
    blocked: boolean; // bloqueado o no
    blockedBy: string; // email del usuario que bloqueo el elemento

    // Sin usar
    postition: string; // posicion del elemento dentro del tema en que se añadio
    isSort: string; // texto que referencia boolean respecto a si esta ordenado o no respecto a la posición en el tema
}