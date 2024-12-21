import React, {Fragment, useEffect, useState, useCallback} from "react";
import { Inline, Stack } from '@atlaskit/primitives';
import Form, { ErrorMessage, Field, FormFooter, HelperMessage } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import TextArea from '@atlaskit/textarea';
import { Box, xcss } from '@atlaskit/primitives';
import { DatePicker, DateTimePicker } from '@atlaskit/datetime-picker';
import Button, { ButtonGroup } from '@atlaskit/button';
import LoadingButton from '@atlaskit/button/loading-button';
import Select, { ActionMeta, MultiValue, PropsValue } from 'react-select';
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { ProgressTracker, Stages } from '@atlaskit/progress-tracker';
import { CreatableSelect, OptionType, ValueType } from '@atlaskit/select';
import SVG from '@atlaskit/icon/svg';
import Image from '@atlaskit/image'
import Popup from '@atlaskit/popup';
import CommentIcon from '@atlaskit/icon/glyph/comment';
import InfoIcon from '@atlaskit/icon/glyph/info'
import Tooltip, { TooltipPrimitive } from '@atlaskit/tooltip';
import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';

import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTitle,
    ModalTransition,
} from '@atlaskit/modal-dialog';

import AvatarGroup from '@atlaskit/avatar-group';
import RecentIcon from '@atlaskit/icon/glyph/recent'


import io , { Socket } from "socket.io-client";


import FormularioPostReunion from "./FormularioPostReunion";
import MessagesInput from "./MessageInput";
import Messages from "./Messages";

import i__Compromiso from "../assets/static/i__Compromiso.png";
import i__CompromisoBlanco from "../assets/static/i__CompromisoBlanco.png";

import i__Acuerdo from "../assets/static/i__Acuerdo.png";
import i__AcuerdoBlanco from "../assets/static/i__AcuerdoBlanco.png";

import i__Desacuerdo from "../assets/static/i__Desacuerdo.png";
import i__DesacuerdoBlanco from "../assets/static/i__DesacuerdoBlanco.png";

import i__Duda from "../assets/static/i__Duda.png";
import i__DudaBlanco from "../assets/static/i__DudaBlanco.png";

import i__TextoLibre from "../assets/static/i__TextoLibre.png";
import i__TextoLibreBlanco from "../assets/static/i__TextoLibreBlanco.png";


var listaEstudiantes: string[] = [];

const boxStyles = xcss({
    borderColor: 'color.border.selected',
    // width: '1000px',
    width: '100%',
    backgroundColor: 'color.background.selected',
    borderStyle: 'solid',
    borderRadius: 'border.radius',
    borderWidth: 'border.width',
});

const boxStyles2= xcss({
    // borderColor: 'color.border.neutral',
    // width: '1000px',
    width: '100%',
    backgroundColor: 'color.background.neutral',
    borderStyle: 'solid',
    borderRadius: 'border.radius',
    borderWidth: 'border.width',
});

const contentStyles = xcss({
    padding: 'space.200',
    width: '600px',
    // height: '200px',
    
});

const contentStylesInformacion = xcss({
    padding: 'space.200',
    width: '600px',
    // height: '200px',
    
});

const InlineDialog = styled(TooltipPrimitive)({
    background: 'white',
    width: '1000px',
    borderRadius: token('border.radius', '4px'),
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
    boxSizing: 'content-box',
    padding: `${token('space.100', '8px')} ${token('space.150', '12px')}`,
});

// Se obtiene el token del usuario logeado
const tokenUser = localStorage.getItem('tokenUser');

// para saber a que tema se le esta añadiendo un elemento dialogico
var numeroTemaSeleccionado: number;

// contador de elementos dialogicos
var contadorElementosDialogicos: number = 1;

var correoElectronico: string;

var idReunionAux: string;
var idProyectoAux: string;

// estados de la reunion (para la barra de progreso)
const items: Stages = [
    {
        id: 'pre-reunion',
        label: 'Pre-reunión',
        percentageComplete: 100,
        status: 'disabled',
        href: '#',
    },
    {
        id: 'en-reunion',
        label: 'En-reunión',
        percentageComplete: 0,
        status: 'current',
        href: '#',
    },
    {
        id: 'post-reunion',
        label: 'Post-reunión',
        percentageComplete: 0,
        status: 'unvisited',
        href: '#',
    },
    {
        id: 'finalizar',
        label: 'Reunión finalizada',
        percentageComplete: 0,
        status: 'unvisited',
        href: '#',
    },
];



var estadoReunion: string;

var nombreCortoProyectoAux: string = "";
var numeroReunion: number;


const FormularioEnReunion: React.FC = () => {

    // para el popup del chat
    const [isOpen, setIsOpen] = useState(false)

    // para el popup de la informacion de la reunion
    const [isOpenInformacion, setIsOpenInformacion] = useState(false)

    // websocket
    const [socket, setSocket] = useState<Socket>();
    // par el envio de mensajes mediante websockets
    const [messages, setMessages] = useState<string[]>([]);

    // funciona separando el chat en salas
    const send = (value:string) => {
        const decodedToken: any = tokenUser ? jwtDecode(tokenUser) : null;
        correoElectronico = decodedToken.email;
        const payload = {
            room: localStorage.getItem('idMeetingMinute'),
            user: correoElectronico,
            message: value,
        };
        socket?.emit('messageVer2', payload);
    }

    // funciona separando el chat en salas
    const messageListener = (message: string, user: string) => {
        setMessages([...messages, "- " + user + ": " + message]);
    }

    // funciona separando el chat en salas
    useEffect(() => {
        socket?.on('messageVer2', (payload: any) => {
            messageListener(payload.message, payload.user);
        });
        return () => {
            socket?.off('messageVer2', messageListener);
        }
        // setMessages([]); -> comentado

    }, [messageListener]);


    // Interfaz para ver los datos de un acta dialogica (meetingminute)
    interface MeetingMinute {
        title: string;
        place: string;
        startTime: string;
        endTime: string;
        startHour: string; 
        endHour: string;
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
        cantElementos: number;
        nombreCortoProyecto: string;
        comenzoReunion: boolean;
    }

    // interfaz para obtener los datos de los estudiantes
    interface Estudiantes {
        email: string;
        value: string; 
        label: string;
    }

    // interfaz para obtener los datos de la reunion
    interface Reunion {
        name : string;
        description : string;
        number : number;
        state : string;
        project : string[];
        createdAt: string;
        updatedAt: string;
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

    // Interfaz para guardar informacion del proyecto
    interface ProyectoUser {
        shortName: string; //false *
        name: string; //true *
        description: string; //true *
        projectDateI: string; //false
        projectDateT: string; //false
        guests: string; 
        userOwner: string; // *
        userMembers: number; // *
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

    const tipoDeUsuario = localStorage.getItem('tipoUsuario');

    // Para determinar si se muestra en la parte central el acta dialogica o no (en cualquiera que sea su etapa, pre, in, post o finalizada)
    const [verActaDialogica, setVerActaDialogica] = React.useState(false);
    const [iniciarReunion, setIniciarReunion] = React.useState(false);
    // para guardar los datos del acta dialogica (meetingminute)
    const [meetingminute, setMeetingMinute] = React.useState<MeetingMinute>();

    // para indicar a los estudiantes seleccionados en los diferentes dialogos modales -> separandolos se dejan los campos de forma independiente y si se selecciona en uno no se seleccionara en el otro
    const [selectedStudentCompromiso, setSelectedStudentCompromiso] = useState<PropsValue<Estudiantes>>([]);
    const [selectedStudentDesacuerdoUno, setSelectedStudentDesacuerdoUno] = useState<PropsValue<Estudiantes>>([]);
    const [selectedStudentDesacuerdoDos, setSelectedStudentDesacuerdoDos] = useState<PropsValue<Estudiantes>>([]);
    const [selectedStudentDuda, setSelectedStudentDuda] = useState<PropsValue<Estudiantes>>([]);
    const [selectedStudentTextoLibre, setSelectedStudentTextoLibre] = useState<PropsValue<Estudiantes>>([]);
    
    // Estado para tener la informacion del usuario logeado
    const [usuarioPerfilLog, setusuarioPerfilLog] = React.useState<Usuario>(); 

    const [usuarioInvitado, setusuarioInvitado] = React.useState<EstudiantesInvitados>();
    var nombreCortoProyectoUsuarioInvitado: string;
    
    // para guardar todos los compromisos del proyecto (despues de haber pasado todos los filtros)
    const [compromisosProyecto, setcompromisosProyecto] = React.useState<Compromiso[]>();

    // para guardar los datos de la reunion
    const [reunion, setReunion] = React.useState<Reunion>();
    // para guardar datos del proyecto
    const [proyectoUser, setProyectsUser] = React.useState<ProyectoUser>(); 

    // para guardar los datos del elemento dialogico creado
    const [elementoDialogico, setElementoDialogico] = React.useState<ElementoDialogico>();

    // para saber los participantes que estan en la reunion (room)
    const [listaParticipantes, setListaParticipantes] = React.useState<Usuario[]>([]);
    var listaParticipantesAux: Usuario[] = [];
    var listaParticipantesString: string[];
    var listaParticipantesStringAux: Usuario[];


    // Entrada: un usuario
    // Salida: ninguna
    // Agrega un participante a la lista de participantes de la reunion
    const agregarParticipante = (participante: Usuario) => {
        setListaParticipantes(listaParticipantes => {
            if (!listaParticipantes.find(p => p.email === participante.email)) {
                listaParticipantesAux = [...listaParticipantes, participante];
                return [...listaParticipantes, participante];
            }
            return listaParticipantes;
        });
    }


    useEffect(() => {
        // websocket
        const newSocket = io(`${process.env.REACT_APP_BACKEND_IO}`);
        setSocket(newSocket);

        newSocket.on('new_reload', () => {
            window.location.reload();
        });

        // Recargar la pagina para cuando se finalice la fase "en-reunion" y se pase a la siguiente fase "post-reunion" -> se debe actualizar el valor de localstorage
        newSocket.on('new_reload_ver2', () => {
            localStorage.setItem('estadoReunion', "Post-reunión");
            window.location.reload();
        });

        // Identificar al nuevo usuario conectado
        newSocket.on('new_user', (payload) => {
            agregarParticipante(payload);
            newSocket.emit('event_lista_participantes', { room: localStorage.getItem('idMeetingMinute'), lista: listaParticipantesAux });
        });

        // Recoger la lista de participantes
        newSocket.on('new_lista_participantes', (payload: any[]) => {
            if (payload.length === 1) {
                return;
            }
            console.log("------------- a")
            payload.forEach((participant: any) => {
                console.log("correo: " + participant.email);
            });
            setListaParticipantes(payload);
            listaParticipantesStringAux = payload;
        });

        // Recorger el valor de iniciarReunion
        newSocket.on('new_comenzar_reunion', (payload: any) => {
            localStorage.setItem('iniciarReunion', payload);
            window.location.reload();
        });

        // escucar al evento de notificar a los participantes que un usuario esta añadiendo un elemento a un tema
        newSocket.on('new_notificar_participante_editando_ver2', (payload: any) => {
            const decodedToken: any = tokenUser ? jwtDecode(tokenUser) : null;
            const correoElectronico = decodedToken.email;
            if (correoElectronico !== payload.user) {
                window.alert("El participante " + payload.user + " esta añadiendo un elemento al tema n°" + payload.tema);
            }
        });

        // escucar al evento de notificar a los participantes que un usuario esta añadiendo un nuevo tema
        newSocket.on('new_notificar_participante_editando_ver3', (payload: any) => {
            const decodedToken: any = tokenUser ? jwtDecode(tokenUser) : null;
            const correoElectronico = decodedToken.email;
            if (correoElectronico !== payload.user) {
                window.alert("El participante " + payload.user + " esta añadiendo un nuevo tema");
            }
        });

        // obtener los datos del usuario logeado inicio
        async function obtenerDatosUsuarioLog() {
            try {
                const decodedToken: any = tokenUser ? jwtDecode(tokenUser) : null;
                const correoElectronico = decodedToken.email;
                // Solo se requiere del token del usuario para realizar la petición
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_GATEWAY}/api/user/perfil/email/` + correoElectronico, {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log(response.data);
                setusuarioPerfilLog(response.data);
                newSocket.emit('event_join', { room: localStorage.getItem('idMeetingMinute'), user: response.data });

            } catch (error) {
                console.error(error);
            }
        }
        obtenerDatosUsuarioLog();

    }, [setSocket]);

    // avatar group para mostrar
    const data = listaParticipantes.map((d, i) => ({
        key: d.email,
        name: d.name + " - " + d.email,
        href: '#',
        src: d.avatar,
    }));


    useEffect(() => {

        // obtener valor de local storage para saber si se debe mostrar el acta dialogica o no
        const storedValue = localStorage.getItem('verActaDialogica');
        if (storedValue) {
            const parsedValue = JSON.parse(storedValue);
            setVerActaDialogica(parsedValue);
        }

        // obtener valor de local storage para saber si se debe mostrar la informacion oculta (la reunion aun no comienza)
        const storedValue2 = localStorage.getItem('iniciarReunion');
        if (storedValue2) {
            const parsedValue2 = JSON.parse(storedValue2);
            setIniciarReunion(parsedValue2);
        }

        estadoReunion = localStorage.getItem('estadoReunion') ?? '';
        const idMeetingMinute = localStorage.getItem('idMeetingMinute');

        const idProyecto = localStorage.getItem('idProyecto') ?? '';
        // funcion utilizada para traer los compromisos de los usuarios -> esta funcion posteriormente se utilizara de forma iterativa sobre una lista de participantes
        async function obtenerCompromisosUsuario(correoUsuario: string) {
            try {
                const decodedToken: any = tokenUser ? jwtDecode(tokenUser) : null;
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_GATEWAY}/api/element/participants/` + correoUsuario, {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log(response.data);
                // primer filtro, que solo se muestren los compromisos
                var filteredData = response.data.filter((item: Compromiso) => item.type.toLowerCase() === 'compromiso');
                // segundo filtro, que el state sea "nueva" o "desarrollo"
                filteredData = filteredData.filter((item: Compromiso) => item.state.toLowerCase() === 'nueva' || item.state.toLowerCase() === 'desarrollo');
                // tercer filtro, que project sea igual a "idProyecto"
                filteredData = filteredData.filter((item: Compromiso) => item.project === idProyecto);
                // cuarto filtro, que dateLimit sea menor a la fecha actual, de tal forma obtener los compromisos atrados -> no necesariamente, porque puede haber un compromiso de una reunion anterior pero que es para mucho tiempo mas
                // filteredData = filteredData.filter((item: Compromiso) => new Date(item.dateLimit) < new Date());
                // Se añade filteredData a "setcompromisosProyecto"
                // quinto filtro (se añade mas abajo, antes de mostrar los compromisos, pero se requiere aqui): los compromisos solo pueden ser de reuniones previas a la actual
                filteredData = filteredData.filter((item: Compromiso) => item.number < numeroReunion);
                setcompromisosProyecto(compromisosProyecto => [...(compromisosProyecto || []), ...filteredData]);
            } catch (error) {
                console.error(error);
            }
        }


        // peticion para obtener los datos del acta dialogica previamente creada
        async function obtenerMeetingMinutePorId() {
            try {
                // Solo se requiere del token del usuario para realizar la petición
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_GATEWAY}/api/meeting-minute/` + localStorage.getItem('idMeetingMinute'), {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("INFORMACION DEL ACTA DIALOGICA AL RECUPERAR ACTA *** EN REUNION ***");
                console.log(response.data);
                setMeetingMinute(response.data[0]);
                nombreCortoProyectoAux = response.data[0].nombreCortoProyecto;
                numeroReunion = response.data[0].number;
                // localStorage.setItem('idReunion', response.data[0].meeting);
                // window.alert("id de la reunion en recuperar acta EN REUNION: " + response.data[0].meeting);
                idReunionAux = response.data[0].meeting;

                // se recorre la lista de participantes de la reunion para obtener los compromisos de cada uno utilizando la funcion "obtenerCompromisosUsuario"
                response.data[0].participants.forEach((participante: string) => {
                    obtenerCompromisosUsuario(participante);
                });

            } catch (error) {
                console.log("ERROR AL OBTENER LA INFORMACION DEL ACTA DIALOGICA");
                console.error(error);
            }
        }
        obtenerMeetingMinutePorId();


        
        // Obtener datos de la reunion a partir del id
        // const idReunion = localStorage.getItem('idReunion') ?? ''; // id de la reunion traido desde local storage -> ya no se obtiene de local storage, se obtiene a partir de la minuta
        async function datosReunion() {
            try {
                // window.alert("id de la reunion EN REUNION: " + localStorage.getItem('idReunion'));            
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_GATEWAY}/api/meeting/` + localStorage.getItem('idReunion'),{
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Datos de la reunión **** EN REUNION ***");
                console.log(response.data);
                setReunion(response.data);
                // localStorage.setItem('idProyecto', response.data.project[0]);
                idProyectoAux = response.data.project[0];
            } catch (error) {
                console.error(error);
            }
        }
        datosReunion();

        // obtener proyecto del usuario por id
        async function obtenerProyectoPorId() {
            // window.alert("id de la reunion: " + idReunion);
            try {
                // Solo se requiere del token del usuario para realizar la petición
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_GATEWAY}/api/project/getProjectbyID/` + localStorage.getItem('idProyecto'), {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                
                setProyectsUser(response.data);
                

            } catch (error) {
                console.error(error);
            }
        }
        obtenerProyectoPorId();

    }, []);


    // Entrada: ninguna
    // Salida: ninguna
    // Cambia el valor de la variable verActaDialogica, de tal forma abandonar la pestaña
    const cancelarOperacion = () => {
        const newValue = !verActaDialogica;
        // Guardar valor de la variable en local storage
        localStorage.setItem('verActaDialogica', JSON.stringify(newValue));
        if (verActaDialogica == false) {
            setVerActaDialogica(true);
        }
        else{
            setVerActaDialogica(false);    
        }
        window.location.reload();
    }


    // Entrada: ninguna
    // Salida: ninguna
    // Finalizar la etapa de "En reunion" para avanzar a la siguiente etapa "Post-reunion" -> importante que se debe cambiar el estado de la reunion y se debe actualizar el acta dialogica
    const guardarFormularioFinal = () => {
        // paso 1: revisar que los campos esten completos -> no es necesario dado a que los campos estan el dialogos modales

        // Se le pregunta al usuario si esta seguro de finalizar la reunion
        var respuesta = window.confirm("¿Está seguro de finalizar la reunión?");
        if (!respuesta) {
            window.alert("Operación cancelada: la reunión no ha sido finalizada");
            return;
        }
        // window.alert("Reunión finalizada exitosamente");

        // paso 2.1: realizar peticion para cambiar el estado de la reunion
        const idReunion = localStorage.getItem('idReunion') ?? ''; // id de la reunion traido desde local storage
        async function cambiarEstadoEnReunion() {
            try {            
                const response = await axios.put(`${process.env.REACT_APP_BACKEND_GATEWAY}/api/meeting/` + idReunion, {
                    state: "Post-reunión"
                },{
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Estado cambiado exitosamente");
                console.log(idReunion);
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        cambiarEstadoEnReunion();

        // paso 2.2: realizar la peticion para actualizar el acta dialogica -> guardando la hora real en que se termino la reunion -> FALTARIA CONSIDERAR A LOS VERDADEROS ASISTENTES PERO ESO SE VERA DESPUES
        // realizar peticion al backend para actualizar el acta dialogica, entregando una nueva lista de topics
        const idMeetingMinute = localStorage.getItem('idMeetingMinute');
        async function actualizarActa() {

            const dataParticipantes = listaParticipantes.map((d, i) => ({
                email: d.email,
            }));

            listaParticipantesString = [];
            dataParticipantes.forEach((participante) => {
                listaParticipantesString.push(participante.email);
            });

            try {           
                const response = await axios.put(`${process.env.REACT_APP_BACKEND_GATEWAY}/api/meeting-minute/` + idMeetingMinute, {
                    realEndTime: new Date().toLocaleString('es-CL'),
                    // se añaden los asistentes
                    assistants: listaParticipantesString,
                },{
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Acta actualizada exitosamente: asistentes de la reunion añadidos");
                console.log(response.data);
                // se guarda en local storage el id del acta dialogica creada, para que en la siguiente etapa, se pueda rescatar dicho id y se pueda realizar la peticion al backend
                localStorage.setItem('idMeetingMinute', response.data._id);
            } catch (error) {
                console.error(error);
            }
        }
        actualizarActa();

        // paso 2.3: actualizar los atributos de los participantes de la reunion
        async function ActualizarParticipantes(correoEstudiante: string, idActa: string, estadoReu: string) {
            try {            
                const response = await axios.put(`${process.env.REACT_APP_BACKEND_GATEWAY}/api/user/update/`+correoEstudiante+'/usuarioperfil', {
                    currentMeetingId: idActa,
                    currentMeeting: estadoReu,
                    lastLink: idReunion,
                    currentProjectId: proyectoUser?._id,
                    currentProject: proyectoUser?.shortName,
                },{
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Usuario actualizado correctamente");
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        }

        // funcion para obtener datos de un usuario a partir de su correo electronico. Se utiliza con el proposito de determinar si el estudiante invitado pertence o no al proyecto, asi poder determinar si actualizar ciertos parametros dentro de su perfil
        async function obtenerDatosUsuarioInvitado(correoEstudiante:string) {
            try {
                // Solo se requiere del token del usuario para realizar la petición
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_GATEWAY}/api/user/perfil/email/` + correoEstudiante, {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log(response.data);
                setusuarioInvitado(response.data);
                nombreCortoProyectoUsuarioInvitado = response.data.proyectoPrincipal;
            } catch (error) {
                console.error(error);
            }
        }

        // traer de y guardar de local storage "nombreProyecto"
        // const nombreProyectoLocalStorage = localStorage.getItem('nombreProyecto') ?? '';

        // se recorre la lista de participantes, de tal forma actualizar todos
        meetingminute?.participants.forEach((participante: string) => {
            // console.log(" jdjdjdjjdjdjdjjd Participante: ", participante);
            
            obtenerDatosUsuarioInvitado(participante).then(() => {
                console.log(" jdjdjdjjdjdjdjjd Participante DESPUES DE DATOS: ", participante);
                if (nombreCortoProyectoAux === nombreCortoProyectoUsuarioInvitado) {
                    console.log(" jdjdjdjjdjdjdjjd Participante DENTRO IF: ", participante);
                    ActualizarParticipantes(participante, localStorage.getItem('idMeetingMinute') ?? '', "Post-reunión");
                }
            });
        });
        
        // FORMA ANTIGUA DE HACCERLO, se actualizan todos los participantes de la reunion, sin importar si pertenecen o no al proyecto
        // meetingminute?.participants.forEach((participante: string) => {
        //     // POSIBILIDAD DE MEJORA: si el participante acude a una reunion que no es de su proyecto, no se le actualiza el atributo "currentMeetingId"
        //     ActualizarParticipantes(participante, localStorage.getItem('idMeetingMinute') ?? '', "Post-reunión");
        // });
        
        // paso 3: cambiar valores de variable almancenada en local storage para ir a la siguiente etapa (en-reunion)
        localStorage.setItem('estadoReunion', "Post-reunión");

        // se envia correo a los participantes de la reunion, indicandoles que la reunion ya finalizo
        async function EnviarCorreo() {
            try {            
                const response = await axios.post(`${process.env.REACT_APP_BACKEND_GATEWAY}/api/meeting-minute/notify/state/change`, {
                    meetingMinuteDTO: {
                        title: meetingminute?.title,
                        place: meetingminute?.place,
                        startTime: meetingminute?.startTime,
                        endTime: meetingminute?.endTime,
                        startHour: meetingminute?.startHour,
                        endHour: meetingminute?.endHour,
                        topics: meetingminute?.topics,
                        participants: meetingminute?.participants,
                        secretaries: meetingminute?.secretaries,
                        leaders: meetingminute?.leaders,
                        links: meetingminute?.links,
                        meeting: meetingminute?.meeting,
                        number: meetingminute?.number,
                        fase: "post-reunión",
                        cantElementos: meetingminute?.cantElementos,
                        nombreCortoProyectoAux: meetingminute?.nombreCortoProyecto,
                        comenzoReunion: meetingminute?.comenzoReunion
                    },
                },{
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Correo enviado con exito");
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        }


        EnviarCorreo();

        // window.alert("ESPERANDO A LOS RESULTADOS DE LA CONSOLA");
        window.alert("Reunión finalizada exitosamente");

        // websocket
        // paso final: recargar la pagina para todos los usuarios conectados a la sala utilizando websockets
        // const idMeetingMinute = localStorage.getItem('idMeetingMinute');
        const decodedToken: any = tokenUser ? jwtDecode(tokenUser) : null;
        correoElectronico = decodedToken.email;
        const payload = {
            room: idMeetingMinute,
            user: correoElectronico,
        };
        socket?.emit('event_reload_ver2', payload);


        // paso 4: recargar pagina -> comentado debido a que esto se realiza mediante websockets
        // window.location.reload();
    }

    // Entrada: ninguna
    // Salida: ninguna
    // Cambia el valor de la variable iniciarReunion (para mostrar la informacion oculta) y guardar la fecha y hora actual (fecha y hora real de inicio de reunion)
    const botonIniciarReunion = () => {
        // cambiar el valor de iniciarReunion (en el codigo como tambien en el local storage)
        const newValue = !iniciarReunion;
        localStorage.setItem('iniciarReunion', JSON.stringify(newValue)); //esto se tiene que hacer con websockets

        if (iniciarReunion == false) {
            setIniciarReunion(true);
        }
        else{
            setIniciarReunion(false);    
        }

        // actualizar el acta dialogica con la fecha real de inicio
        const idMeetingMinute = localStorage.getItem('idMeetingMinute');
        async function actualizarActa() {
            try {           
                const response = await axios.put(`${process.env.REACT_APP_BACKEND_GATEWAY}/api/meeting-minute/` + idMeetingMinute, {
                    realStartTime: new Date().toLocaleString('es-CL'),
                    comenzoReunion: true
                },{
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Acta actualizada exitosamente -> fecha y hora de inicio real añadida");
                console.log(response.data);
                // se guarda en local storage el id del acta dialogica creada, para que en la siguiente etapa, se pueda rescatar dicho id y se pueda realizar la peticion al backend
                localStorage.setItem('idMeetingMinute', response.data._id);
            } catch (error) {
                console.error(error);
            }
        }
        actualizarActa();

        // se envia correo a los participantes de la reunion, indicandoles que la reunion ya inicio
        async function EnviarCorreo() {
            try {            
                const response = await axios.post(`${process.env.REACT_APP_BACKEND_GATEWAY}/api/meeting-minute/notify/state/change`, {
                    meetingMinuteDTO: {
                        title: meetingminute?.title,
                        place: meetingminute?.place,
                        startTime: meetingminute?.startTime,
                        endTime: meetingminute?.endTime,
                        startHour: meetingminute?.startHour,
                        endHour: meetingminute?.endHour,
                        topics: meetingminute?.topics,
                        participants: meetingminute?.participants,
                        secretaries: meetingminute?.secretaries,
                        leaders: meetingminute?.leaders,
                        links: meetingminute?.links,
                        meeting: meetingminute?.meeting,
                        number: meetingminute?.number,
                        fase: "en-reunión",
                        cantElementos: meetingminute?.cantElementos,
                        nombreCortoProyecto: meetingminute?.nombreCortoProyecto
                    },
                },{
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Correo enviado con exito");
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        EnviarCorreo();

        // websocket
        const payload = {
            room: idMeetingMinute,
            valorIniciarReunion: JSON.stringify(newValue),
        };
        socket?.emit('event_comenzar_reunion', payload);
    }

    // FUNCION NO UTILIZADA
    const botonIniciarReunion2 = () => {
        // cambiar el valor de iniciarReunion (en el codigo como tambien en el local storage)
        const newValue = !iniciarReunion;
        localStorage.setItem('iniciarReunion', JSON.stringify(newValue));
        if (iniciarReunion == false) {
            setIniciarReunion(true);
        }
        else{
            setIniciarReunion(false);    
        }
    }


    // **************************************************************************************************************************************************************************************** //
    // ****************************************************** Variables utilizadas para los dialogos modales de los elementos dialogicos ****************************************************** //
    // **************************************************************************************************************************************************************************************** //

    // Para modal dialog para "Compromiso"
    const [isOpenComprimiso, setIsOpenCompromiso] = useState(false);
    const [name, setName] = useState('');
    const openModalCompromiso = useCallback(() => setIsOpenCompromiso(true), []);
    // const closeModalCompromiso = useCallback(() => setIsOpenCompromiso(false), []); -> de esta forma no se eliminaban los integrantes seleccionados
    const closeModalCompromiso = useCallback(() => {
        setIsOpenCompromiso(false);
        setSelectedStudentCompromiso([]);
    }, []);

    
    // Para modal dialog para "Acuerdo"
    const [isOpenAcuerdo, setIsOpenAcuerdo] = useState(false);
    const openModalAcuerdo = useCallback(() => setIsOpenAcuerdo(true), []);
    const closeModalAcuerdo = useCallback(() => setIsOpenAcuerdo(false), []);


    // Para modal dialog para "Desacuerdo"
    const [isOpenDesacuerdo, setIsOpenDesacuerdo] = useState(false);
    const openModalDesacuerdo = useCallback(() => setIsOpenDesacuerdo(true), []);
    // const closeModalDesacuerdo = useCallback(() => setIsOpenDesacuerdo(false), []); -> de esta forma no se eliminaban los integrantes seleccionados
    const closeModalDesacuerdo = useCallback(() => {
        setIsOpenDesacuerdo(false);
        setSelectedStudentDesacuerdoUno([]);
        setSelectedStudentDesacuerdoDos([]);
    }, []);


    // Para modal dialog para "Duda"
    const [isOpenDuda, setIsOpenDuda] = useState(false);
    const openModalDuda = useCallback(() => setIsOpenDuda(true), []);
    // const closeModalDuda = useCallback(() => setIsOpenDuda(false), []);
    const closeModalDuda = useCallback(() => {
        setIsOpenDuda(false);
        setSelectedStudentDuda([]);
    }, []);

    // Para modal dialog para "añadir nuevo tema"
    const [isOpenNuevoTema, setIsOpenNuevoTema] = useState(false);
    const openModalNuevoTema = useCallback(() => setIsOpenNuevoTema(true), []);
    const closeModalNuevoTema = useCallback(() => setIsOpenNuevoTema(false), []);

    // Para modal dialog para "chat"
    const [isOpenChat, setIsOpenChat] = useState(false);
    const openModalChat = useCallback(() => setIsOpenChat(true), []);
    const closeModalChat = useCallback(() => setIsOpenChat(false), []);

    // Para modal dialog para "texto libre"
    const [isOpenTextoLibre, setIsOpenTextoLibre] = useState(false);
    const openModalTextoLibre = useCallback(() => setIsOpenTextoLibre(true), []);
    const closeModalTextoLibre = useCallback(() => setIsOpenTextoLibre(false), []);

    // Para modal dialog que muestra la informacion de la ruenion
    const [isOpenInfoReu, setIsOpenInfoReu] = useState(false);
    const openModalInfoReu = useCallback(() => setIsOpenInfoReu(true), []);
    const closeModalInfoReu = useCallback(() => setIsOpenInfoReu(false), []);

    // **************************************************************************************************************************************************************************************** //
    // **************************************************************************************************************************************************************************************** //
    // **************************************************************************************************************************************************************************************** //

    const validateField = (value?: string) => {
        if (!value) {
            return 'REQUIRED';
        } else if (new Date(value) < new Date()) {
            return 'EXPIRED';
        }
    };

    // Entrada: ninguna
    // Salida: ninguna
    // Guarda el compromiso en la base de datos realizando la peticion al banckend
    const guardarCompromiso = () => {
        // Encargados del compromiso
        const encargadoCompromisoValueAux = (document.getElementsByName("encargadoCompromiso"));
        var listaEncargadosCompromiso: string[] = [];
        encargadoCompromisoValueAux.forEach((element: HTMLElement) => {
            listaEncargadosCompromiso.push((element as HTMLInputElement).value);
        });

        // Compromiso
        var compromisoValue = (document.getElementsByName("compromiso")[0] as HTMLInputElement).value;
        if (compromisoValue.endsWith(".")) {
            compromisoValue = compromisoValue.slice(0, -1);
        }

        // Fecha de cumplimiento del compromiso
        var fechaCumplimientoCompromisoValue: string = "";
        fechaCumplimientoCompromisoValue = (document.getElementsByName("fechaCumplimientoCompromiso")[0] as HTMLInputElement).value;

        // paso 1.1: revisar el campo de fecha de cumplimiento
        // comprobacion solo para las fechas (considerando que los usuarios tienden a no ingresar valores)
        if (fechaCumplimientoCompromisoValue === "" || fechaCumplimientoCompromisoValue === " " || fechaCumplimientoCompromisoValue === null || fechaCumplimientoCompromisoValue === undefined || fechaCumplimientoCompromisoValue === "undefined" || fechaCumplimientoCompromisoValue === "null") {
            window.alert("Debe completar los campos de fecha y hora");
            return;
        }

        var fechaCumplimientoCompromiso: string = "";
        fechaCumplimientoCompromiso = fechaCumplimientoCompromisoValue.split("T")[0];

        // se le suma 1 dia a la fecha de cumplimiento, puesto que se esta guardando un dia menos
        const fechaCumplimientoCompromisoDate = new Date(fechaCumplimientoCompromiso);
        fechaCumplimientoCompromisoDate.setDate(fechaCumplimientoCompromisoDate.getDate() + 1);
        fechaCumplimientoCompromiso = fechaCumplimientoCompromisoDate.toISOString().split("T")[0];


        var horaCumplimientoCompromiso: string = "";
        horaCumplimientoCompromiso = fechaCumplimientoCompromisoValue.split("T")[1];
        horaCumplimientoCompromiso = horaCumplimientoCompromiso.split("-")[0];

        // window.alert("AUN NO IMPLEMENTADO" + "\n" + "Encargado: " + listaEncargadosCompromiso + "\n" + "Compromiso: " + compromisoValue + "\n" + "Fecha de cumplimiento: " + fechaCumplimientoCompromisoValue + "\n" + numeroTemaSeleccionado);


        // paso 1.2: revisar que los campos esten completos
        if (listaEncargadosCompromiso.length === 0 || listaEncargadosCompromiso === null || listaEncargadosCompromiso[0] === null || listaEncargadosCompromiso[0] === "" || listaEncargadosCompromiso[0] === " " || compromisoValue === "" || compromisoValue === " " || fechaCumplimientoCompromisoValue === "" || fechaCumplimientoCompromisoValue === " ") {
            window.alert("Por favor complete todos los campos");
            return;
        }

        // paso 2: realizar la peticion para crear el elemento dialogico compromiso
        // variables traidas del local storage
        const idReunion = localStorage.getItem('idReunion') ?? '';
        const idProyecto = localStorage.getItem('idProyecto') ?? '';
        const idMeetingMinute = localStorage.getItem('idMeetingMinute') ?? '';
        async function crearCompromiso() {
            try {            
                const response = await axios.post(`${process.env.REACT_APP_BACKEND_GATEWAY}/api/element`, {
                    description: compromisoValue,
                    type: "Compromiso",
                    participants: listaEncargadosCompromiso,
                    topic: numeroTemaSeleccionado,
                    meeting: idReunion,
                    project: idProyecto,
                    meetingMinute: idMeetingMinute,
                    state: "nueva",
                    number: reunion?.number,
                    // position: contadorElementosDialogicos,
                    position: ((meetingminute?.cantElementos ?? 0) + 1).toString(),
                    dateLimit: fechaCumplimientoCompromiso,
                    timeLimit: horaCumplimientoCompromiso,
                    // position: SOLO SI ES NECESARIO, AÑADIR LA POSICION
                    // isSort: SOLO SI ES NECESARIO, AÑADIR ESTE ATRIBUTO
                    createdAt: new Date(),
                    // updatedAt: TODAVIA NO ES NECESARIO
                },{
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Compromiso creado exitosamente");
                setElementoDialogico(response.data);
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        crearCompromiso();

        // crear un arreglo de string, igualarlo al arreglo de topics y luego modificar el valor del topic seleccionado con el nuevo elemento dialogico creado
        var listaTemas: string[] = [];
        listaTemas = meetingminute?.topics ?? [];
        // window.alert("Lista de temas originales: " + listaTemas);
        // const fechaCumplimientoChilena = new Date(fechaCumplimientoCompromiso).toLocaleDateString('es-CL');
        listaTemas[numeroTemaSeleccionado - 1] = listaTemas[numeroTemaSeleccionado - 1] + "\n\n" + reunion?.number + "." + ((meetingminute?.cantElementos ?? 0) + 1).toString() + " Compromiso: " + compromisoValue + "." + "\nEncargado/a: " + listaEncargadosCompromiso  + "." + "\nFecha y hora para el cumplimiento: " + new Date(fechaCumplimientoCompromiso).toLocaleDateString('es-CL') + " a las " + horaCumplimientoCompromiso + ".";
        // window.alert("Lista de temas modificada: " + listaTemas);
        
        // se aumenta el valor de contadorElementosDialogicos en 1
        contadorElementosDialogicos = contadorElementosDialogicos + 1;

        // realizar peticion al backend para actualizar el acta dialogica, entregando una nueva lista de topics
        async function actualizarActa() {
            try {            
                const response = await axios.put(`${process.env.REACT_APP_BACKEND_GATEWAY}/api/meeting-minute/` + idMeetingMinute, {
                    topics: listaTemas,
                    cantElementos: (meetingminute?.cantElementos ?? 0) + 1,
                },{
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Acta actualizada exitosamente (elemento dialogico añadido al tema)");
                console.log(response.data);
                // se guarda en local storage el id del acta dialogica creada, para que en la siguiente etapa, se pueda rescatar dicho id y se pueda realizar la peticion al backend
                localStorage.setItem('idMeetingMinute', response.data._id);
            } catch (error) {
                console.error(error);
            }
        }
        actualizarActa();

        // mostrar mensaje de exito
        window.alert("Compromiso creado exitosamente");

        // recargar pagina
        // window.location.reload();

        // antes de cerrar el compromiso, se debe vaciar la lista que contiene a los integrantes seleccionados, para que cuando se vuelva a abrir el dialogo modal, no se muestren los integrantes seleccionados anteriormente
        setSelectedStudentCompromiso([]);

        // websocket
        // paso final: recargar la pagina para todos los usuarios conectados a la sala utilizando websockets
        // const idMeetingMinute = localStorage.getItem('idMeetingMinute');
        const decodedToken: any = tokenUser ? jwtDecode(tokenUser) : null;
        correoElectronico = decodedToken.email;
        const payload = {
            room: idMeetingMinute,
            user: correoElectronico,
        };
        socket?.emit('event_reload', payload);

        // en vez de recargar la pagina, se cerrara el dialogo modal
        closeModalCompromiso();

    }


    // Entrada: ninguna
    // Salida: ninguna
    // Guarda el acuerdo en la base de datos realizando la peticion al banckend
    const guardarAcuerdo = () => {
        // Acuerdo
        var acuerdoValue = (document.getElementsByName("acuerdo")[0] as HTMLInputElement).value;
        if (acuerdoValue.endsWith(".")) {
            acuerdoValue = acuerdoValue.slice(0, -1);
        }

        // paso 1: revisar que el campo haya sido rellenado
        if (acuerdoValue === "" || acuerdoValue === " ") {
            window.alert("Por favor complete el campo");
            return;
        }

        // paso 2: realizar la peticion para crear el elemento dialogico acuerdo
        // variables traidas del local storage
        const idReunion = localStorage.getItem('idReunion') ?? '';
        const idProyecto = localStorage.getItem('idProyecto') ?? '';
        const idMeetingMinute = localStorage.getItem('idMeetingMinute') ?? '';
        async function crearAcuerdo() {
            try {            
                const response = await axios.post(`${process.env.REACT_APP_BACKEND_GATEWAY}/api/element`, {
                    description: acuerdoValue,
                    type: "Acuerdo",
                    participants: [],
                    topic: numeroTemaSeleccionado,
                    meeting: idReunion,
                    project: idProyecto,
                    meetingMinute: idMeetingMinute,
                    state: "nueva",
                    number: reunion?.number,
                    position: ((meetingminute?.cantElementos ?? 0) + 1).toString(),
                    dateLimit: "",
                    timeLimit: "",
                    // position: SOLO SI ES NECESARIO, AÑADIR LA POSICION
                    // isSort: SOLO SI ES NECESARIO, AÑADIR ESTE ATRIBUTO
                    createdAt: new Date().toLocaleString('es-CL'),
                    // updatedAt: TODAVIA NO ES NECESARIO
                },{
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Acuerdo creado exitosamente");
                setElementoDialogico(response.data);
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        crearAcuerdo();

        // crear un arreglo de string, igualarlo al arreglo de topics y luego modificar el valor del topic seleccionado con el nuevo elemento dialogico creado
        var listaTemas: string[] = [];
        listaTemas = meetingminute?.topics ?? [];
        // window.alert("Lista de temas originales: " + listaTemas);
        listaTemas[numeroTemaSeleccionado - 1] = listaTemas[numeroTemaSeleccionado - 1] + "\n\n" + reunion?.number + "." + ((meetingminute?.cantElementos ?? 0) + 1).toString() + " Acuerdo: " + acuerdoValue + ".";
        // window.alert("Lista de temas modificada: " + listaTemas);

        // se aumenta el valor de contadorElementosDialogicos en 1
        contadorElementosDialogicos = contadorElementosDialogicos + 1;

        // realizar peticion al backend para actualizar el acta dialogica, entregando una nueva lista de topics
        async function actualizarActa() {
            try {            
                const response = await axios.put(`${process.env.REACT_APP_BACKEND_GATEWAY}/api/meeting-minute/` + idMeetingMinute, {
                    topics: listaTemas,
                    cantElementos: (meetingminute?.cantElementos ?? 0) + 1,
                },{
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Acta actualizada exitosamente (elemento dialogico añadido al tema)");
                console.log(response.data);
                // se guarda en local storage el id del acta dialogica creada, para que en la siguiente etapa, se pueda rescatar dicho id y se pueda realizar la peticion al backend
                localStorage.setItem('idMeetingMinute', response.data._id);
            } catch (error) {
                console.error(error);
            }
        }
        actualizarActa();
        // mostrar mensaje de exito
        window.alert("Acuerdo creado exitosamente");
        // recargar pagina
        // window.location.reload();

        // en vez de recargar la pagina, se cerrara el dialogo modal

        // websocket
        // paso final: recargar la pagina para todos los usuarios conectados a la sala utilizando websockets
        // const idMeetingMinute = localStorage.getItem('idMeetingMinute');
        const decodedToken: any = tokenUser ? jwtDecode(tokenUser) : null;
        correoElectronico = decodedToken.email;
        const payload = {
            room: idMeetingMinute,
            user: correoElectronico,
        };
        socket?.emit('event_reload', payload);

        closeModalAcuerdo();
    }

    // Entrada: ninguna
    // Salida: ninguna
    // Guarda el desacuerdo en la base de datos realizando la peticion al banckend
    const guardarDesacuerdo = () => {
        // origen del desacuerdo
        var origenDesacuerdoValue = (document.getElementsByName("origenDesacuerdo")[0] as HTMLInputElement).value;
        if (origenDesacuerdoValue.endsWith(".")) {
            origenDesacuerdoValue = origenDesacuerdoValue.slice(0, -1);
        }

        // dueño primera postura -> es solo una persona, asi que no necesita el proceso comentado
        var listaParticipantesUno = (document.getElementsByName("listaParticipantesUno")[0] as HTMLInputElement).value;

        // primera postura
        var posturaUnoValue = (document.getElementsByName("posturaUno")[0] as HTMLInputElement).value;
        if (posturaUnoValue.endsWith(".")) {
            posturaUnoValue = posturaUnoValue.slice(0, -1);
        }

        // dueño segunda postura -> es solo una persona, asi que no necesita el proceso comentado
        var listaParticipantesDos = (document.getElementsByName("listaParticipantesDos")[0] as HTMLInputElement).value;

        // segunda postura
        var posturaDosValue = (document.getElementsByName("posturaDos")[0] as HTMLInputElement).value;
        if (posturaDosValue.endsWith(".")) {
            posturaDosValue = posturaDosValue.slice(0, -1);
        }

        // Esta comentado pero es utilizado para verificar el correcto funcionamiento
        // window.alert("Origen del desacuerdo: " + origenDesacuerdoValue + "\n" + "Dueño de la primera postura: " + listaParticipantesUno + "\n" + "Primera postura: " + posturaUnoValue + "\n" + "Dueño de la segunda postura: " + listaParticipantesDos + "\n" + "Segunda postura: " + posturaDosValue + "\n" + numeroTemaSeleccionado);

        // paso 1: revisar que los campos esten completos
        if (origenDesacuerdoValue === "" || origenDesacuerdoValue === " " || listaParticipantesUno === "" || listaParticipantesUno === " " || posturaUnoValue === "" || posturaUnoValue === " " || listaParticipantesDos === "" || listaParticipantesDos === " " || posturaDosValue === "" || posturaDosValue === " ") {
            window.alert("Por favor complete todos los campos");
            return;
        }

        // paso 2: realizar la peticion para crear el elemento dialogico desacuerdo
        // variables traidas del local storage
        const idReunion = localStorage.getItem('idReunion') ?? '';
        const idProyecto = localStorage.getItem('idProyecto') ?? '';
        const idMeetingMinute = localStorage.getItem('idMeetingMinute') ?? '';
        async function crearDesacuerdo() {
            try {            
                const response = await axios.post(`${process.env.REACT_APP_BACKEND_GATEWAY}/api/element`, {
                    description: origenDesacuerdoValue,
                    type: "Desacuerdo",
                    participants: [],
                    topic: numeroTemaSeleccionado,
                    meeting: idReunion,
                    project: idProyecto,
                    meetingMinute: idMeetingMinute,
                    state: "nueva",
                    number: reunion?.number,
                    position: ((meetingminute?.cantElementos ?? 0) + 1).toString(),
                    dateLimit: "",
                    timeLimit: "",
                    createdAt: new Date().toLocaleString('es-CL'),
                    disagreement: {
                        firtPosition: {
                            responsible: listaParticipantesUno,
                            description: posturaUnoValue
                        },
                        secondPosition: {
                            responsible: listaParticipantesDos,
                            description: posturaDosValue
                        }
                    }
                },{
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Desacuerdo creado exitosamente");
                setElementoDialogico(response.data);
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        }

        crearDesacuerdo();

        // crear un arreglo de string, igualarlo al arreglo de topics y luego modificar el valor del topic seleccionado con el nuevo elemento dialogico creado
        var listaTemas: string[] = [];
        listaTemas = meetingminute?.topics ?? [];
        // window.alert("Lista de temas originales: " + listaTemas);
        listaTemas[numeroTemaSeleccionado - 1] = listaTemas[numeroTemaSeleccionado - 1] + "\n\n" + reunion?.number + "." + ((meetingminute?.cantElementos ?? 0) + 1).toString() + " Desacuerdo: " + origenDesacuerdoValue + "." + "\n" + "Dueño/a de la primera postura: " + listaParticipantesUno + "\n" + "Primera postura: " + posturaUnoValue + "." + "\n" + "Dueño/a de la segunda postura: " + listaParticipantesDos + "\n" + "Segunda postura: " + posturaDosValue + ".";
        // window.alert("Lista de temas modificada: " + listaTemas);

        // se aumenta el valor de contadorElementosDialogicos en 1
        contadorElementosDialogicos = contadorElementosDialogicos + 1;

        // realizar peticion al backend para actualizar el acta dialogica, entregando una nueva lista de topics
        async function actualizarActa() {
            try {            
                const response = await axios.put(`${process.env.REACT_APP_BACKEND_GATEWAY}/api/meeting-minute/` + idMeetingMinute, {
                    topics: listaTemas,
                    cantElementos: (meetingminute?.cantElementos ?? 0) + 1,
                },{
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Acta actualizada exitosamente (elemento dialogico añadido al tema)");
                console.log(response.data);
                // se guarda en local storage el id del acta dialogica creada, para que en la siguiente etapa, se pueda rescatar dicho id y se pueda realizar la peticion al backend
                localStorage.setItem('idMeetingMinute', response.data._id);
            } catch (error) {
                console.error(error);
            }
        }
        actualizarActa();
        // mostrar mensaje de exito
        window.alert("Desacuerdo creado exitosamente");
        // recargar pagina
        // window.location.reload();

        // antes de cerrar el desacuerdo, se debe vaciar las listas que contiene a los integrantes seleccionados, para que cuando se vuelva a abrir el dialogo modal, no se muestren los integrantes seleccionados anteriormente
        setSelectedStudentDesacuerdoUno([]);
        setSelectedStudentDesacuerdoDos([]);


        // websocket
        // paso final: recargar la pagina para todos los usuarios conectados a la sala utilizando websockets
        // const idMeetingMinute = localStorage.getItem('idMeetingMinute');
        const decodedToken: any = tokenUser ? jwtDecode(tokenUser) : null;
        correoElectronico = decodedToken.email;
        const payload = {
            room: idMeetingMinute,
            user: correoElectronico,
        };
        socket?.emit('event_reload', payload);

        // en vez de recargar la pagina, se cerrara el dialogo modal
        closeModalDesacuerdo();
    }

    // Entrada: ninguna
    // Salida: ninguna
    // Guarda la duda en la base de datos realizando la peticion al banckend
    const guardarDuda = () => {
        // dueño de la duda
        var listaParticipantesDudaValue = (document.getElementsByName("listaParticipantesDuda")[0] as HTMLInputElement).value;

        // duda
        var dudaValue = (document.getElementsByName("duda")[0] as HTMLInputElement).value;
        if (dudaValue.endsWith(".")) {
            dudaValue = dudaValue.slice(0, -1);
        }

        // paso 1: revisar que los campos esten completos
        if (listaParticipantesDudaValue === "" || listaParticipantesDudaValue === " " || dudaValue === "" || dudaValue === " ") {
            window.alert("Por favor complete todos los campos");
            return;
        }

        // paso 2: realizar la peticion para crear el elemento dialogico duda
        // variables traidas del local storage
        const idReunion = localStorage.getItem('idReunion') ?? '';
        const idProyecto = localStorage.getItem('idProyecto') ?? '';
        const idMeetingMinute = localStorage.getItem('idMeetingMinute') ?? '';
        async function crearDuda() {
            try {            
                const response = await axios.post(`${process.env.REACT_APP_BACKEND_GATEWAY}/api/element`, {
                    description: dudaValue,
                    type: "Duda",
                    participants: listaParticipantesDudaValue,
                    topic: numeroTemaSeleccionado,
                    meeting: idReunion,
                    project: idProyecto,
                    meetingMinute: idMeetingMinute,
                    state: "nueva",
                    number: reunion?.number,
                    position: ((meetingminute?.cantElementos ?? 0) + 1).toString(),
                    dateLimit: "",
                    timeLimit: "",
                    createdAt: new Date().toLocaleString('es-CL'),
                },{
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Duda creada exitosamente");
                setElementoDialogico(response.data);
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        crearDuda();
        // crear un arreglo de string, igualarlo al arreglo de topics y luego modificar el valor del topic seleccionado con el nuevo elemento dialogico creado
        var listaTemas: string[] = [];
        listaTemas = meetingminute?.topics ?? [];
        // window.alert("Lista de temas originales: " + listaTemas);
        listaTemas[numeroTemaSeleccionado - 1] = listaTemas[numeroTemaSeleccionado - 1] + "\n\n" + reunion?.number + "." + ((meetingminute?.cantElementos ?? 0) + 1).toString() + " Duda: " + dudaValue + "." + "\n" + "Dueño/a de la duda: " + listaParticipantesDudaValue + ".";
        // window.alert("Lista de temas modificada: " + listaTemas);

        // se aumenta el valor de contadorElementosDialogicos en 1
        contadorElementosDialogicos = contadorElementosDialogicos + 1;

        // realizar peticion al backend para actualizar el acta dialogica, entregando una nueva lista de topics
        async function actualizarActa() {
            try {            
                const response = await axios.put(`${process.env.REACT_APP_BACKEND_GATEWAY}/api/meeting-minute/` + idMeetingMinute, {
                    topics: listaTemas,
                    cantElementos: (meetingminute?.cantElementos ?? 0) + 1,
                },{
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Acta actualizada exitosamente (elemento dialogico añadido al tema)");
                console.log(response.data);
                // se guarda en local storage el id del acta dialogica creada, para que en la siguiente etapa, se pueda rescatar dicho id y se pueda realizar la peticion al backend
                localStorage.setItem('idMeetingMinute', response.data._id);
            } catch (error) {
                console.error(error);
            }
        }
        actualizarActa();

        // mostrar mensaje de exito
        window.alert("Duda creada exitosamente");

        // recargar pagina
        // window.location.reload();

        // antes de cerrar la duda, se debe vaciar la lista que contiene a los integrantes seleccionados, para que cuando se vuelva a abrir el dialogo modal, no se muestren los integrantes seleccionados anteriormente
        setSelectedStudentDuda([]);


        // websocket
        // paso final: recargar la pagina para todos los usuarios conectados a la sala utilizando websockets
        // const idMeetingMinute = localStorage.getItem('idMeetingMinute');
        const decodedToken: any = tokenUser ? jwtDecode(tokenUser) : null;
        correoElectronico = decodedToken.email;
        const payload = {
            room: idMeetingMinute,
            user: correoElectronico,
        };
        socket?.emit('event_reload', payload);

        // en vez de recargar la pagina, se cerrara el dialogo modal
        closeModalDuda();

    }

    // Entrada: ninguna
    // Salida: ninguna
    // Guarda el nuevo tema en la base de datos realizando la peticion al banckend
    const agregarTemaNuevo = () => {
        
        // se captura el texto que corresponde al nuevo tema
        var nuevoTemaValue = (document.getElementsByName("nuevoTema")[0] as HTMLInputElement).value;
        if (nuevoTemaValue.endsWith(".")) {
            nuevoTemaValue = nuevoTemaValue.slice(0, -1);
        }

        // window.alert("AUN NO IMPLEMENTADO" + "\n" + "Nuevo tema: " + nuevoTemaValue);

        // paso 1: revisar que el campo haya sido rellenado
        if (nuevoTemaValue === "" || nuevoTemaValue === " ") {
            window.alert("Por favor complete el campo");
            return;
        }

        // paso 2: agregar el nuevo tema a una nueva lista que tenga los temas existentes
        var listaTemas: string[] = [];
        listaTemas = meetingminute?.topics ?? [];
        listaTemas.push(nuevoTemaValue);

        // paso 3: realizar peticion al backend para actualizar el acta dialogica, entregando una nueva lista de topics
        const idMeetingMinute = localStorage.getItem('idMeetingMinute') ?? '';
        async function actualizarActa() {
            try {            
                const response = await axios.put(`${process.env.REACT_APP_BACKEND_GATEWAY}/api/meeting-minute/` + idMeetingMinute, {
                    topics: listaTemas,
                },{
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Acta actualizada exitosamente (nuevo tema añadido)");
                console.log(response.data);
                // se guarda en local storage el id del acta dialogica creada, para que en la siguiente etapa, se pueda rescatar dicho id y se pueda realizar la peticion al backend
                localStorage.setItem('idMeetingMinute', response.data._id);
            } catch (error) {
                console.error(error);
            }
        }
        actualizarActa();

        // paso 4: mostrar mensaje de exito
        window.alert("Tema creado exitosamente");

        // paso 5: recargar pagina
        // window.location.reload();

        // en vez de recargar la pagina, se cerrara el dialogo modal

        // websocket
        // paso final: recargar la pagina para todos los usuarios conectados a la sala utilizando websockets
        // const idMeetingMinute = localStorage.getItem('idMeetingMinute');
        const decodedToken: any = tokenUser ? jwtDecode(tokenUser) : null;
        correoElectronico = decodedToken.email;
        const payload = {
            room: idMeetingMinute,
            user: correoElectronico,
        };
        socket?.emit('event_reload', payload);
        
        closeModalNuevoTema();

    }


    // Entrada: ninguna
    // Salida: ninguna
    // Guarda el texto libre en la base de datos realizando la peticion al banckend
    const guardarTextoLibre = () => {


        // dueño de la duda
        var listaParticipantesTextoLibreValue = (document.getElementsByName("listaParticipantesTextoLibre")[0] as HTMLInputElement).value;

        // Texto Libre
        var textoLibreValue = (document.getElementsByName("TextoLibre")[0] as HTMLInputElement).value;
        if (textoLibreValue.endsWith(".")) {
            textoLibreValue = textoLibreValue.slice(0, -1);
        }

        // paso 1: revisar que los campos esten completos
        if (listaParticipantesTextoLibreValue === "" || listaParticipantesTextoLibreValue === " " || textoLibreValue === "" || textoLibreValue === " ") {
            window.alert("Por favor complete todos los campos");
            return;
        }

        // paso 2: realizar la peticion para crear el texto libre
        // variables traidas del local storage
        const idReunion = localStorage.getItem('idReunion') ?? '';
        const idProyecto = localStorage.getItem('idProyecto') ?? '';
        const idMeetingMinute = localStorage.getItem('idMeetingMinute') ?? '';
        async function crearTextoLibre() {
            try {            
                const response = await axios.post(`${process.env.REACT_APP_BACKEND_GATEWAY}/api/element`, {
                    description: textoLibreValue,
                    type: "Texto libre",
                    participants: listaParticipantesTextoLibreValue,
                    topic: numeroTemaSeleccionado,
                    meeting: idReunion,
                    project: idProyecto,
                    meetingMinute: idMeetingMinute,
                    state: "nueva",
                    number: reunion?.number,
                    position: ((meetingminute?.cantElementos ?? 0) + 1).toString(),
                    dateLimit: "",
                    timeLimit: "",
                    // position: SOLO SI ES NECESARIO, AÑADIR LA POSICION
                    // isSort: SOLO SI ES NECESARIO, AÑADIR ESTE ATRIBUTO
                    createdAt: new Date().toLocaleString('es-CL'),
                    // updatedAt: TODAVIA NO ES NECESARIO
                },{
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Texto libre creado exitosamente");
                setElementoDialogico(response.data);
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        crearTextoLibre();

        // crear un arreglo de string, igualarlo al arreglo de topics y luego modificar el valor del topic seleccionado con el nuevo elemento dialogico creado
        var listaTemas: string[] = [];
        listaTemas = meetingminute?.topics ?? [];
        // window.alert("Lista de temas originales: " + listaTemas);
        listaTemas[numeroTemaSeleccionado - 1] = listaTemas[numeroTemaSeleccionado - 1] + "\n\n" + textoLibreValue + "." + "\n" + "Dueño/a del texto libre: " + listaParticipantesTextoLibreValue + ".";
        // window.alert("Lista de temas modificada: " + listaTemas);

        // se aumenta el valor de contadorElementosDialogicos en 1
        contadorElementosDialogicos = contadorElementosDialogicos + 1;

        // realizar peticion al backend para actualizar el acta dialogica, entregando una nueva lista de topics
        async function actualizarActa() {
            try {            
                const response = await axios.put(`${process.env.REACT_APP_BACKEND_GATEWAY}/api/meeting-minute/` + idMeetingMinute, {
                    topics: listaTemas,
                    cantElementos: (meetingminute?.cantElementos ?? 0) + 1,
                },{
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Acta actualizada exitosamente (texto libre añadido al tema)");
                console.log(response.data);
                // se guarda en local storage el id del acta dialogica creada, para que en la siguiente etapa, se pueda rescatar dicho id y se pueda realizar la peticion al backend
                localStorage.setItem('idMeetingMinute', response.data._id);
            } catch (error) {
                console.error(error);
            }
        }
        actualizarActa();
        // mostrar mensaje de exito
        window.alert("Texto libre creado exitosamente");
        // recargar pagina
        // window.location.reload();

        // en vez de recargar la pagina, se cerrara el dialogo modal

        // websocket
        // paso final: recargar la pagina para todos los usuarios conectados a la sala utilizando websockets
        // const idMeetingMinute = localStorage.getItem('idMeetingMinute');
        const decodedToken: any = tokenUser ? jwtDecode(tokenUser) : null;
        correoElectronico = decodedToken.email;
        const payload = {
            room: idMeetingMinute,
            user: correoElectronico,
        };
        socket?.emit('event_reload', payload);

        closeModalTextoLibre();
    }

    // Funcion encargada de emitir una alerta mediante websockets a los participantes de la reunion, de tal forma todos sepan que participante esta añadiendo un elemento a un respectivo tema
    // Entrada: ninguna
    // Salida: ninguna
    const notificarParticipantes = (temaEditado: number) => {
        const decodedToken: any = tokenUser ? jwtDecode(tokenUser) : null;
        const correoElectronico = decodedToken.email;
        const payload = {
            room: localStorage.getItem('idMeetingMinute'),
            user: correoElectronico,
            tema: temaEditado,
        };
        socket?.emit('event_notificar_participante_editando_ver2', payload);
    }

    // Funcion encargada de emitir una alerta mediante websockets a los participantes de la reunion, de tal forma todos sepan que participante esta añadiendo un nuevo tema
    // Entrada: ninguna
    // Salida: ninguna
    const notificarParticipantesVer2 = () => {
        const decodedToken: any = tokenUser ? jwtDecode(tokenUser) : null;
        const correoElectronico = decodedToken.email;
        const payload = {
            room: localStorage.getItem('idMeetingMinute'),
            user: correoElectronico,
        };
        socket?.emit('event_notificar_participante_editando_ver3', payload);
    }






// Contenido que se muestra 
return (
    <div>
            {estadoReunion === "En-reunión" || estadoReunion === "en-reunión" ? (
                <>
                    {/* PARTE FIJA DEL MICROFRONTEND: AVATAR GROUP, CHAT y BARRA DE PROGRESO DE LA REUNION */}
                    <div style={{position: "fixed", top: 96, width: "100%", zIndex:10}}>
                        <Inline>
                            {/* CONTENIDO DE LA IZQUIERDA: fotos de los participantes de la reunion y boton que da acceso al chat */}
                            {/* <div style={{textAlign: "left", height: '100px', width: '450px', backgroundColor: 'white'}}> */}
                            <div style={{textAlign: "left", height: '100px', width: '550px', backgroundColor: 'white'}}>
                                <Inline space="space.200">
                                    {/* fotos de los integrantes conectados */}
                                    <div style={{marginTop: '28px'}}>
                                        <AvatarGroup appearance="stack" data={data} borderColor="#388BFF" size="large" maxCount={4}/>
                                    </div>

                                    {/* popup para colocar un chat en la reunion */}
                                    <div style={{marginTop: '28px'}}>
                                        <Popup
                                            isOpen={isOpen}
                                            onClose={() => setIsOpen(false)}
                                            placement="bottom-start"

                                            // aqui colocar el componente del chat
                                            content={() =>  <Box xcss={contentStyles}>
                                                                <MessagesInput send={send}/>
                                                                <Messages messages={messages}/>
                                                            </Box>}

                                            trigger={(triggerProps) => (
                                                <Button
                                                    style={{height: 44}}
                                                    iconBefore={<CommentIcon label="" size="medium" />}
                                                    {...triggerProps}
                                                    appearance="primary"
                                                    isSelected={isOpen}
                                                    onClick={() => setIsOpen(!isOpen)}
                                                    >
                                                    {/* {isOpen ? 'Cerrar' : 'Abrir'} chat{' '} */}
                                                    {isOpen ? '' : ''} <p style={{marginTop:3, marginBottom:0}}>chat</p>{' '}
                                                </Button>
                                            )}
                                        />
                                        {/* IMPLEMENTACION DEL CHAT COMO UN DIALOGO MODAL, NO SE USARA */}
                                        {/* <Button appearance="primary" onClick={() => {openModalChat()}}>ABRIR CHAT</Button> */}
                                    </div>
                                </Inline>
                            </div>

                            {/* CONTENIDO DEL MEDIO: barra de progreso */}
                            <div style={{textAlign: "center", height: '100px', width: '60%', backgroundColor: 'white'}}>
                                {/* barra de progreso en la renuion fija en pantalla*/}
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <ProgressTracker items={items} />
                                </div>
                            </div>

                            {/* CONTENIDO DE LA DERECHA: informacion sobre el llamado de la reunion*/}
                            <div style={{textAlign: "left", height: '100px', width: '550px', backgroundColor: 'white'}}>
                                {/* RecentIcon */}
                                <Inline space="space.100">
                                    <div style={{marginTop: '35px'}}><RecentIcon label="" size="medium"/></div>
                                    {/* <h4 style={{ marginTop: "37px", marginBottom: "5px" }}>Llamado: &#60;{new Date(meetingminute?.startTime ?? "").toLocaleDateString("es-CL")} {meetingminute?.startHour.split("-")[0]}&#62; &#60;{new Date(meetingminute?.endTime ?? "").toLocaleDateString("es-CL")} {meetingminute?.endHour.split("-")[0]}&#62;</h4> */}
                                    {/* DE ESTA FORMA, SE RESTABA UN DIA A LO QUE ESTABA GUARDADO EN LA BASE DE DATOS */}
                                    {/* <h4 style={{ marginTop: "37px", marginBottom: "5px" }}>Llamado: &#60;{new Date(meetingminute?.startTime ?? "").toLocaleDateString("es-CL")} {meetingminute?.startHour[0]}{meetingminute?.startHour[1]}{meetingminute?.startHour[2]}{meetingminute?.startHour[3]}{meetingminute?.startHour[4]}&#62; &#60;{new Date(meetingminute?.endTime ?? "").toLocaleDateString("es-CL")} {meetingminute?.endHour[0]}{meetingminute?.endHour[1]}{meetingminute?.endHour[2]}{meetingminute?.endHour[3]}{meetingminute?.endHour[4]}&#62;</h4> */}

                                    <h4 style={{ marginTop: "37px", marginBottom: "5px" }}>Llamado: &#60;{meetingminute?.startTime[8]}{meetingminute?.startTime[9]}{meetingminute?.startTime[7]}{meetingminute?.startTime[5]}{meetingminute?.startTime[6]}{meetingminute?.startTime[4]}{meetingminute?.startTime[0]}{meetingminute?.startTime[1]}{meetingminute?.startTime[2]}{meetingminute?.startTime[3]} {meetingminute?.startHour[0]}{meetingminute?.startHour[1]}{meetingminute?.startHour[2]}{meetingminute?.startHour[3]}{meetingminute?.startHour[4]}&#62; &#60;{meetingminute?.endTime[8]}{meetingminute?.endTime[9]}{meetingminute?.endTime[7]}{meetingminute?.endTime[5]}{meetingminute?.endTime[6]}{meetingminute?.endTime[4]}{meetingminute?.endTime[0]}{meetingminute?.endTime[1]}{meetingminute?.endTime[2]}{meetingminute?.endTime[3]} {meetingminute?.endHour[0]}{meetingminute?.endHour[1]}{meetingminute?.endHour[2]}{meetingminute?.endHour[3]}{meetingminute?.endHour[4]}&#62;</h4> 
                                </Inline>
                                {/* añadir la hora y fecha real para las siguientes fases*/}
                            </div>
                        </Inline>
                    </div> 


                    <br />
                    <br />
                    <br />
                    
                    {/* CONTENIDO DEL MICROFRONTEND */}
                    <div
                    style={{
                        zIndex: 1,
                        display: 'flex',
                        margin: '0 auto',
                        marginLeft: '15px',
                        marginRight: '15px',
                        marginBottom: '30px',
                        flexDirection: 'column',
                    }}
                    
                    >

                        {/* Se comenta debido a solicitud de profesor guia: No es necesario mostrar el titulo de la seccion considerando que se tiene "ProgressTracker"*/}
                        {/* <h1 style={{ textAlign: 'center', fontSize: '60px' }}>En-reunión</h1> */}
                        {/* <h3 style={{ textAlign: 'center', marginLeft: '20px', marginRight: '20px'}}>Importante: Si recarga la página o la abandona, se perderá la información previamente ingresada en el formulario, por lo que deberá comenzar nuevamente. Los datos serán guardados una vez se presione el botón "Finalizar En-reunión"</h3> */}
                        
                        {/* <ProgressTracker items={items} /> */}
                        <br />

                        {/* ESPACIO PARA MOSTRAR LA INFORMACION DEL ACTA DIALOGICA -> mostrar de una forma mas elegante*/}
                        {/* <h2>Acta dialógica de Proyecto "{proyectoUser?.shortName}" - reunión {reunion?.number}</h2> */}
                        
                        {/* <div style={{ textAlign: 'left', margin: '15px' }}> */}
                        {/* popup para mostrar la informacion de la reunion */}
                        {/* SE DEBERA ELIMINAR EL POPUP, PUESTO A QUE SI SE TIENE MUCHA INFORMACION, NO SE PUEDE SCROLEAR HASTA QUE LA PANTALLA LO PERMITA */}
                        {/* POR DICHO MOTIVO, SE DEJARA MEJOR EN UN DIALOGO MODAL */}

                        <Button
                            style={{height: '100%', textAlign: 'left', width: '100%', marginTop: '5px'}}
                            iconBefore={<InfoIcon label="" size="medium" />}
                            appearance="link"
                            // isSelected={isOpenInformacion}
                            onClick={() => openModalInfoReu()}
                            >
                            {/* {isOpenInformacion ? 'Cerrar' : 'Abrir'} chat{' '} */}
                            {isOpenInformacion ? '' : ''} 
                                {/* se realiza la separacion debido a que se agrega un nuevo atributo al acta dialogia que indica el nombre corto del proyecto */}
                                {/* por lo tanto, puesto que algunas actas ya existentes no tiene dicho atributo, se deja la condicion de utilizar el formato anterior, cuando no estaba el atributo */}
                                {nombreCortoProyectoAux === "" || nombreCortoProyectoAux === undefined ? (
                                    <h2 style={{ color: 'black'}}>Acta dialógica de Proyecto "{proyectoUser?.shortName}" - reunión {reunion?.number}</h2>
                                ) : (
                                    <h2 style={{ color: 'black'}}>Acta dialógica de Proyecto "{nombreCortoProyectoAux}" - reunión {reunion?.number}</h2>
                                )}
                                {/* <h2 style={{ color: 'black'}}>Acta dialógica de Proyecto "{proyectoUser?.shortName}" - reunión {reunion?.number}</h2> */}
                            {' '}
                        </Button>
                        {/* seccion para mostrar compromisos previos a la reunion */}
                        {compromisosProyecto?.length != 0 && (
                            <>
                                <Box padding="space.400" backgroundColor="color.background.neutral" xcss={boxStyles2}>
                                    {/* FORMATO NUEVO */}
                                    <h2 style={{marginTop:'0px', textAlign:'center'}}>Estado del proyecto</h2>
                                    <br />
                                        <h3 style={{ marginTop: "5px", marginBottom: "5px" }}>Compromisos previos:</h3>
                                        {compromisosProyecto?.map((compromiso, index) => (
                                            <>
                                                {/* con esto me aseguro que no se muestren compromisos de reuniones futuras */}
                                                {compromiso.number < (meetingminute?.number ?? 0) && (
                                                    <>
                                                        {index == 0 && (
                                                            <>
                                                                <h4 key={index} style={{ marginLeft: '30px', marginTop: "5px", marginBottom: "5px" }}>{compromiso.participants}</h4>
                                                            </>
                                                        )}

                                                        {index !== 0 && (
                                                            <>
                                                                {/* // recorrer cada caracter de compromisosProyecto[index - 1].participants, de tal forma comparar caracter por caracter con compromiso.participants*/}    
                                                                {Array.from(compromisosProyecto[index - 1].participants).map((char: string, charIndex: number) => (
                                                                    <>
                                                                        <h4 key={charIndex} style={{ marginLeft: '30px', marginTop: "5px", marginBottom: "5px"}}>
                                                                            {char === compromiso.participants[charIndex] ? '' : (compromiso.participants)}
                                                                        </h4>
                                                                    </>
                                                                ))}
                                                            </>
                                                        )}
                                                        
                                                        {/* caso "compromiso.dateLimit" es menor a la fecha actual -> significa atrasado, por lo que es color rojo */}
                                                        <Inline>
                                                            {new Date(compromiso.dateLimit) < new Date() && (
                                                                <>
                                                                    <Stack>
                                                                        <h4 key={index} style={{ marginLeft: '50px', marginTop: "5px", marginBottom: "5px", color: 'red'}}>{compromiso.number}.{compromiso.position} Descripción: {compromiso.description}</h4>
                                                                        <h4 key={index} style={{ marginLeft: '50px', marginTop: "0px", marginBottom: "20px", color: 'red'}}>Fecha límite: {new Date(compromiso.dateLimit).toLocaleDateString("es-CL")}</h4>
                                                                    </Stack>
                                                                    {/* OPCION EN FORMATO BOTON, DE TAL FORMA SE PUEDA PINCHAR Y ABRIR UN DIALOGO MODAL CON MAS INFORMACION */}
                                                                    {/* <Button style={{ marginLeft: '50px'}} appearance="subtle"><h4 key={index} style={{margin:0, color: 'red'}}>{compromiso.number}.{compromiso.position}</h4></Button> */}
                                                                </>
                                                            )}
                                                            {/* caso "compromiso.dateLimit" es mayor a la fecha actual -> significa a tiempo, por lo que color verde */}
                                                            {new Date(compromiso.dateLimit) > new Date() && (
                                                                <>
                                                                    <Stack>
                                                                        <h4 key={index} style={{ marginLeft: '50px', marginTop: "5px", marginBottom: "5px", color: 'green'}}>{compromiso.number}.{compromiso.position} Descripción: {compromiso.description}</h4>
                                                                        <h4 key={index} style={{ marginLeft: '50px', marginTop: "0px", marginBottom: "20px", color: 'green'}}>Fecha límite: {new Date(compromiso.dateLimit).toLocaleDateString("es-CL")}</h4>
                                                                    </Stack>
                                                                    {/* OPCION EN FORMATO BOTON, DE TAL FORMA SE PUEDA PINCHAR Y ABRIR UN DIALOGO MODAL CON MAS INFORMACION */}
                                                                    {/* <Button style={{ marginLeft: '50px'}} appearance="subtle"><h4 key={index} style={{margin:0, color: 'green'}}>{compromiso.number}.{compromiso.position}</h4></Button> */}
                                                                </>
                                                            )}
                                                            {/* caso "compromiso.dateLimit" es igual a la fecha actual */}


                                                            {/* Mostrar la informacion sin los colores */}
                                                            {/* <h4 key={index} style={{ marginLeft: '50px', marginTop: "5px", marginBottom: "5px" }}>{compromiso.number}.{compromiso.position} Descripción: {compromiso.description}</h4> */}
                                                            {/* <br /> */}
                                                        </Inline>
                                                        
                                                    </>
                                                )}
                                            </>
                                        ))}
                                </Box>
                            </>
                        )}



                        <br />
                        <br />

                        {/* solamente los usuarios con rol de anfitrion o secretario pueden comenzar la reunion */}
                        {meetingminute?.leaders.includes(usuarioPerfilLog?.email ?? '') || meetingminute?.secretaries.includes(usuarioPerfilLog?.email ?? '') ? (
                            <>
                                {!iniciarReunion ? (
                                    <Button appearance="primary" onClick={() => botonIniciarReunion()}>Comenzar reunión</Button>
                                ):(
                                    <Button isDisabled appearance="primary" onClick={() => botonIniciarReunion()}>Comenzar reunión</Button>
                                )}
                            </>
                        ) : (
                            <>
                                {!iniciarReunion ? (
                                    <Button isDisabled appearance="primary" onClick={() => botonIniciarReunion()}>Comenzar reunión</Button>
                                ):(
                                    <Button isDisabled appearance="primary" onClick={() => botonIniciarReunion()}>Comenzar reunión</Button>
                                )}
                            </>
                        )}                        

                        <br />
                        <br />


                        {/* Cambio de seccion: se muestran los temas y se pueden añadir elementos dialogicos */}
                        {/* {iniciarReunion && ( */}

                        {meetingminute?.comenzoReunion && (
                            <>
                                {/* <h3>INFORMACION OCULTA (temas con la opcion de añadir elementos dialogicos)</h3>  */}
                                <h3 style={{ marginTop: "5px", marginBottom: "5px" }}>Temas:</h3>
                                {meetingminute?.topics.map((topic, index) => (
                                    <div key={index}>
                                        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                                            {/* propiedad "whiteSpace" hace que <h3> reconozca los saltos de linea */}
                                            <h4 id="texto" style={{ marginLeft: '30px', marginTop: "5px", marginBottom: "5px", whiteSpace: 'pre-line'}}>{index + 1}. {topic}</h4>
                                            {/* Permitir seleccionar el elemento dialogico que se desea añadir y añadir el respectivo "texto" que corresponda */}
                                            {/* para escoger el elemento dialogico, el usuario debera de presionar uno de los 4 botones que se le presentan. */}
                                            {/* una vez presionado uno de estos botones, se abrira un cuadro modal (https://atlassian.design/components/modal-dialog/examples) el cual le solicitara al usuario ingresar el texto correspondiente */}
                                            <br />
                                            <Inline space="space.200" alignInline="center" shouldWrap>

                                                {/* <Button appearance="primary" onClick={() => {openModalCompromiso(); numeroTemaSeleccionado = 0; numeroTemaSeleccionado = index + 1;}}>Compromiso</Button> */}
                                                <Button appearance="primary" onClick={() => {openModalCompromiso(); numeroTemaSeleccionado = 0; numeroTemaSeleccionado = index + 1; notificarParticipantes(index + 1);}} style={{ height: '60px'}}>
                                                    <Inline alignInline="center">
                                                        <Image src={i__CompromisoBlanco} alt="Simple example" testId="image" style={{ width: '50px', height: '50px', marginTop: '5px'  }} /> 
                                                        <div style={{ marginTop: '11.72px', marginLeft: '5px' }}>Compromiso</div>
                                                    </Inline>
                                                </Button>
                                                
                                                {/* <Button appearance="primary" onClick={() => {openModalAcuerdo(); numeroTemaSeleccionado = 0; numeroTemaSeleccionado = index + 1;}}>Acuerdo</Button> */}
                                                <Button appearance="primary" onClick={() => {openModalAcuerdo(); numeroTemaSeleccionado = 0; numeroTemaSeleccionado = index + 1; notificarParticipantes(index + 1);}} style={{ height: '60px'}}>
                                                    <Inline alignInline="center">
                                                        <Image src={i__AcuerdoBlanco} alt="Simple example" testId="image" style={{ width: '50px', height: '50px', marginTop: '5px' }} /> 
                                                        <div style={{ marginTop: '11.72px', marginLeft: '5px' }}>Acuerdo</div>
                                                    </Inline>
                                                </Button>

                                                {/* <Button appearance="primary" onClick={() => {openModalDesacuerdo(); numeroTemaSeleccionado = 0; numeroTemaSeleccionado = index + 1;}}>Desacuerdo</Button> */}
                                                <Button appearance="primary" onClick={() => {openModalDesacuerdo(); numeroTemaSeleccionado = 0; numeroTemaSeleccionado = index + 1; notificarParticipantes(index + 1);}} style={{ height: '60px'}}>
                                                    <Inline alignInline="center">
                                                        <Image src={i__DesacuerdoBlanco} alt="Simple example" testId="image" style={{ width: '50px', height: '50px', marginTop: '5px' }} /> 
                                                        <div style={{ marginTop: '11.72px', marginLeft: '5px' }}>Desacuerdo</div>
                                                    </Inline>
                                                </Button>

                                                {/* <Button appearance="primary" onClick={() => {openModalDuda(); numeroTemaSeleccionado = 0; numeroTemaSeleccionado = index + 1;}}>Duda</Button> */}
                                                <Button appearance="primary" onClick={() => {openModalDuda(); numeroTemaSeleccionado = 0; numeroTemaSeleccionado = index + 1; notificarParticipantes(index + 1);}} style={{ height: '60px'}}>
                                                    <Inline alignInline="center">
                                                        <Image src={i__DudaBlanco} alt="Simple example" testId="image" style={{ width: '50px', height: '50px', marginTop: '5px' }} /> 
                                                        <div style={{ marginTop: '11.72px', marginLeft: '5px' }}>Duda</div>
                                                    </Inline>
                                                </Button>

                                                <Button appearance="primary" onClick={() => {openModalTextoLibre(); numeroTemaSeleccionado = 0; numeroTemaSeleccionado = index + 1; notificarParticipantes(index + 1);}} style={{ height: '60px'}}>
                                                    <Inline alignInline="center">
                                                        <Image src={i__TextoLibreBlanco} alt="Simple example" testId="image" style={{ width: '48px', height: '48px', marginTop: '7px' }} /> 
                                                        <div style={{ marginTop: '11.72px', marginLeft: '7px' }}>Texto libre</div>
                                                    </Inline>
                                                </Button>
                                            </Inline>
                                        </div>
                                        <hr />
                                    </div>
                                ))}
                            {/* Cambio de seccion: se permiten añadir NUEVOS temas y se permite añadir elementos dialogicos  */}
                            <br />
                            {/* <Button appearance="primary">Añadir nuevo tema</Button> */}
                            <Button appearance="primary" onClick={() => {openModalNuevoTema(); notificarParticipantesVer2()}}>Añadir nuevo tema</Button>
                            <br />
                            <br /> 
                            </>
                        )}

                        {/* VERSIÓN ANTIGUA: Solamente el anfitrion podia pasar a la siguiente fase */}
                        {/* {!iniciarReunion ? (
                            <ButtonGroup>
                                <Inline space="space.200" alignInline="center">
                                <Button isDisabled onClick={() => cancelarOperacion()} style={{ marginTop: '20px', marginBottom: '20px'}}>Cancelar</Button>
                                <Button isDisabled appearance="primary" onClick={() => guardarFormularioFinal()} style={{ marginTop: '20px', marginBottom: '20px'}}>Finalizar En-reunión</Button>
                                </Inline>
                            </ButtonGroup>
                        ):(
                            <ButtonGroup>
                                <Inline space="space.200" alignInline="center">
                                <Button onClick={() => cancelarOperacion()} style={{ marginTop: '20px', marginBottom: '20px'}}>Cancelar</Button>
                                <Button appearance="primary" onClick={() => guardarFormularioFinal()} style={{ marginTop: '20px', marginBottom: '20px'}}>Finalizar En-reunión</Button>
                                </Inline>
                            </ButtonGroup>
                        )} */}

                        {/* VERSION NUEVA: Tanto el anfition como el secretario pueden pasar a la siguiente fase */}
                        {meetingminute?.leaders.includes(usuarioPerfilLog?.email ?? '') || meetingminute?.secretaries.includes(usuarioPerfilLog?.email ?? '') ? (
                            <>
                                {!iniciarReunion ? (
                                    <>
                                    <ButtonGroup>
                                        <Inline space="space.200" alignInline="center">
                                        <Button isDisabled onClick={() => cancelarOperacion()} style={{ marginTop: '20px', marginBottom: '20px'}}>Cancelar</Button>
                                        <Button isDisabled appearance="primary" onClick={() => guardarFormularioFinal()} style={{ marginTop: '20px', marginBottom: '20px'}}>Finalizar En-reunión</Button>
                                        </Inline>
                                    </ButtonGroup>
                                    </>
                                ):(
                                    <>
                                    <ButtonGroup>
                                        <Inline space="space.200" alignInline="center">
                                        <Button onClick={() => cancelarOperacion()} style={{ marginTop: '20px', marginBottom: '20px'}}>Cancelar</Button>
                                        <Button appearance="primary" onClick={() => guardarFormularioFinal()} style={{ marginTop: '20px', marginBottom: '20px'}}>Finalizar En-reunión</Button>
                                        </Inline>
                                    </ButtonGroup>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <ButtonGroup>
                                    <Inline space="space.200" alignInline="center">
                                        <Button isDisabled onClick={() => cancelarOperacion()} style={{ marginTop: '20px', marginBottom: '20px'}}>Cancelar</Button>
                                        <Button isDisabled appearance="primary" onClick={() => guardarFormularioFinal()} style={{ marginTop: '20px', marginBottom: '20px'}}>Finalizar En-reunión</Button>
                                    </Inline>
                                </ButtonGroup>
                            </>
                        )}

                    </div>
                </>
            
            // para ir a la siguiente etapa (post-reunion)
            ) : (
                <FormularioPostReunion />
            )}

            {/* ********************************************************************************************************************************************************** */}
            {/* ******************************************************************** Modal dialog de COMPROMISO ********************************************************** */}
            {/* ********************************************************************************************************************************************************** */}
            <ModalTransition>
                {isOpenComprimiso && (
                <Modal onClose={closeModalCompromiso} shouldScrollInViewport>

                    <Form<{ username: string }>
                        onSubmit={(data) => {
                            // console.log('form data', data);
                            return new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>
                                data.username === 'error' ? { username: 'IN_USE' } : undefined,
                            );
                        }}
                    >
                    {/* <form> */}
                    {({ formProps, submitting }) => (
                    <form {...formProps}>

                        <ModalHeader>
                            <ModalTitle>Añadir compromiso</ModalTitle>
                        </ModalHeader>
                        <ModalBody>

                            {/* Campa para indicar el responsable */}
                            <Field
                                aria-required={true}
                                name="encargadoCompromiso"
                                defaultValue=""
                                label="Encargado/a del compromiso"
                                isRequired
                            >
                                {({ fieldProps, error, valid }) => 
                                (
                                
                                    <Select
                                        {...fieldProps}
                                        // isMulti --> los compromisos solo tienen un responsable
                                        options={meetingminute?.participants.map((estudiante) => ({ value: estudiante, label: estudiante, email: estudiante }))}
                                        value={selectedStudentCompromiso}
                                        onChange={(newValue: PropsValue<Estudiantes>, actionMeta: ActionMeta<Estudiantes>) => {
                                            setSelectedStudentCompromiso(newValue);
                                            // Handle the onChange event here
                                            console.log(newValue);
                                        }}
                                        placeholder="Seleccione..."
                                    />
                                )}
                            </Field>

                            {/* Campo para que escriban el compromiso */}
                            <Field
                                id="compromiso"
                                name="compromiso"
                                label="Escriba el compromiso"
                                isRequired
                            >
                            {({ fieldProps }) => (
                                <Fragment>
                                <TextArea
                                    {...fieldProps}
                                    defaultValue=""
                                    value={undefined}
                                    onChange={() => {
                                        // Handle the onChange event here
                                        console.log('onChange');
                                    }}
                                />
                                {/* <HelperMessage>
                                    {name ? `Hello, ${name}` : ''}
                                </HelperMessage> */}
                                </Fragment>
                            )}
                            </Field>

                            {/* Campo para añadir la fecha de cumplimiento del compromiso (fecha y hora) */}
                            <Field
                                name="fechaCumplimientoCompromiso"
                                label="Fecha y hora para el cumplimiento"
                                validate={validateField}
                                // defaultValue={new Date().toISOString()}
                                isRequired
                            >
                                {({ fieldProps: { id, ...rest }, error }) => {
                                const validationState = error ? 'error' : 'default'; //REVISAR ESTO
                                return (
                                    <Fragment>
                                    <div style={{ width: '100%' }}>
                                    <DateTimePicker
                                        dateFormat="DD-MM-YYYY"
                                        timeFormat="HH:mm"
                                        timeIsEditable={true}
                                        datePickerProps={{ weekStartDay: 1 }}
                                        datePickerSelectProps={{ 
                                            placeholder: new Date().toLocaleDateString("es-CL"),
                                            validationState,
                                            inputId: id
                                        }} //REVISAR ESTO
                                        
                                        timePickerSelectProps={{
                                            placeholder: new Date().toLocaleTimeString("es-CL", { hour: '2-digit', minute: '2-digit' }),
                                            validationState,
                                            'aria-labelledby': `${id}-label`,
                                        }}
                                        {...rest}
                                    />
                                    {/* {error === 'REQUIRED' && (
                                        <ErrorMessage>Este campo es requerido</ErrorMessage>
                                    )}
                                    {error && <ErrorMessage>{error}</ErrorMessage>} */}
                                    </div>
                                    </Fragment>
                                );
                            }}
                            </Field>

                        </ModalBody>
                        <ModalFooter>
                            <Button appearance="subtle" onClick={closeModalCompromiso}>
                            Cancelar
                            </Button>
                            <Button appearance="primary" onClick={() => guardarCompromiso()} type="submit">
                            Añadir
                            </Button>
                        </ModalFooter>
                    </form>
                    )}
                    </Form>
                </Modal>
                )}
            </ModalTransition>
            {/* ********************************************************************************************************************************************************** */}
            {/* ********************************************************************************************************************************************************** */}
            {/* ********************************************************************************************************************************************************** */}


            {/* ********************************************************************************************************************************************************** */}
            {/* ******************************************************************** Modal dialog de ACUERDO ************************************************************* */}
            {/* ********************************************************************************************************************************************************** */}
            <ModalTransition>
                {isOpenAcuerdo && (
                <Modal onClose={closeModalAcuerdo} shouldScrollInViewport>

                    <Form<{ username: string }>
                        onSubmit={(data) => {
                            // console.log('form data', data);
                            return new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>
                                data.username === 'error' ? { username: 'IN_USE' } : undefined,
                            );
                        }}
                    >
                    {/* <form> */}
                    {({ formProps, submitting }) => (
                    <form {...formProps}>

                        <ModalHeader>
                            <ModalTitle>Añadir acuerdo</ModalTitle>
                        </ModalHeader>
                        <ModalBody>

                            {/* Campo para que escriban el acuerdo */}
                            <Field
                                id="acuerdo"
                                name="acuerdo"
                                label="Escriba el acuerdo"
                                isRequired
                            >
                            {({ fieldProps }) => (
                                <Fragment>
                                <TextArea
                                    {...fieldProps}
                                    defaultValue=""
                                    value={undefined}
                                    onChange={() => {
                                        // Handle the onChange event here
                                        console.log('onChange');
                                    }}
                                />
                                {/* <HelperMessage>
                                    {name ? `Hello, ${name}` : ''}
                                </HelperMessage> */}
                                </Fragment>
                            )}
                            </Field>
                        </ModalBody>
                        <ModalFooter>
                            <Button appearance="subtle" onClick={closeModalAcuerdo}>
                            Cancelar
                            </Button>
                            <Button appearance="primary" onClick={() => guardarAcuerdo()} type="submit">
                            Añadir
                            </Button>
                        </ModalFooter>
                    </form>
                    )}
                    </Form>
                </Modal>
                )}
            </ModalTransition>


            {/* ********************************************************************************************************************************************************** */}
            {/* ********************************************************************************************************************************************************** */}
            {/* ********************************************************************************************************************************************************** */}


            {/* ********************************************************************************************************************************************************** */}
            {/* ******************************************************************** Modal dialog de DESACUERDO ********************************************************** */}
            {/* ********************************************************************************************************************************************************** */}
            <ModalTransition>
                {isOpenDesacuerdo && (
                <Modal onClose={closeModalDesacuerdo} shouldScrollInViewport>


                    <Form<{ username: string }>
                        onSubmit={(data) => {
                            // console.log('form data', data);
                            return new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>
                                data.username === 'error' ? { username: 'IN_USE' } : undefined,
                            );
                        }}
                    >
                    {/* <form> */}
                    {({ formProps, submitting }) => (
                    <form {...formProps}>

                    <ModalHeader>
                        <ModalTitle>Añadir desacuerdo</ModalTitle>
                    </ModalHeader>
                    <ModalBody>

                        {/* Campo para que escriban el origenDesacuerdo */}
                        <Field
                            id="origenDesacuerdo"
                            name="origenDesacuerdo"
                            label="Escriba el origen del desacuerdo"
                            isRequired
                        >
                        {({ fieldProps }) => (
                            <Fragment>
                            <TextArea
                                {...fieldProps}
                                defaultValue=""
                                value={undefined}
                                onChange={() => {
                                    // Handle the onChange event here
                                    console.log('onChange');
                                }}
                            />
                            {/* <HelperMessage>
                                {name ? `Hello, ${name}` : ''}
                            </HelperMessage> */}
                            </Fragment>
                        )}
                        </Field>

                        {/* Campo para indicar dueño de la postura uno */}
                        <Field
                            aria-required={true}
                            name="listaParticipantesUno"
                            defaultValue=""
                            label="Dueño de la primera postura"
                            isRequired
                        >
                            {({ fieldProps, error, valid }) => 
                            (
                            
                                <Select
                                    {...fieldProps}
                                    options={meetingminute?.participants.map((estudiante) => ({ value: estudiante, label: estudiante, email: estudiante }))}
                                    value={selectedStudentDesacuerdoUno}
                                    onChange={(newValue: PropsValue<Estudiantes>, actionMeta: ActionMeta<Estudiantes>) => {
                                        setSelectedStudentDesacuerdoUno(newValue);
                                        // Handle the onChange event here
                                        console.log(newValue);
                                    }}
                                    placeholder="Seleccione..."
                                />
                            )}
                        </Field>

                        {/* Campo para que escriba la primera postura */}
                        <Field
                            id="posturaUno"
                            name="posturaUno"
                            label="Escriba la postura de la primera persona"
                            isRequired
                        >
                        {({ fieldProps }) => (
                            <Fragment>
                            <TextArea
                                {...fieldProps}
                                defaultValue=""
                                value={undefined}
                                onChange={() => {
                                    // Handle the onChange event here
                                    console.log('onChange');
                                }}
                            />
                            {/* <HelperMessage>
                                {name ? `Hello, ${name}` : ''}
                            </HelperMessage> */}
                            </Fragment>
                        )}
                        </Field>

                        {/* Campo para indicar dueño de la postura dos */}
                        <Field
                            aria-required={true}
                            name="listaParticipantesDos"
                            defaultValue=""
                            label="Dueño de la segunda postura"
                            isRequired
                        >
                            {({ fieldProps, error, valid }) => 
                            (
                            
                                <Select
                                    {...fieldProps}
                                    options={meetingminute?.participants.map((estudiante) => ({ value: estudiante, label: estudiante, email: estudiante }))}
                                    value={selectedStudentDesacuerdoDos}
                                    onChange={(newValue: PropsValue<Estudiantes>, actionMeta: ActionMeta<Estudiantes>) => {
                                        setSelectedStudentDesacuerdoDos(newValue);
                                        // Handle the onChange event here
                                        console.log(newValue);
                                    }}
                                    placeholder="Seleccione..."
                                />
                            )}
                        </Field>

                        {/* Campo para que escriban la segunda postura */}
                        <Field
                            id="posturaDos"
                            name="posturaDos"
                            label="Escriba la postura de la segunda persona"
                            isRequired
                        >
                        {({ fieldProps }) => (
                            <Fragment>
                            <TextArea
                                {...fieldProps}
                                defaultValue=""
                                value={undefined}
                                onChange={() => {
                                    // Handle the onChange event here
                                    console.log('onChange');
                                }}
                            />
                            {/* <HelperMessage>
                                {name ? `Hello, ${name}` : ''}
                            </HelperMessage> */}
                            </Fragment>
                        )}
                        </Field>

                    </ModalBody>
                    <ModalFooter>
                        <Button appearance="subtle" onClick={closeModalDesacuerdo}>
                        Cancelar
                        </Button>
                        <Button appearance="primary" onClick={() => guardarDesacuerdo()} type="submit">
                        Añadir
                        </Button>
                    </ModalFooter>
                    </form>
                    )}
                    </Form>
                </Modal>
                )}
            </ModalTransition>
            {/* ********************************************************************************************************************************************************** */}
            {/* ********************************************************************************************************************************************************** */}
            {/* ********************************************************************************************************************************************************** */}


            {/* ********************************************************************************************************************************************************** */}
            {/* ******************************************************************** Modal dialog de DUDA **************************************************************** */}
            {/* ********************************************************************************************************************************************************** */}
            <ModalTransition>
                {isOpenDuda && (
                <Modal onClose={closeModalDuda} shouldScrollInViewport>

                    <Form<{ username: string }>
                        onSubmit={(data) => {
                            // console.log('form data', data);
                            return new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>
                                data.username === 'error' ? { username: 'IN_USE' } : undefined,
                            );
                        }}
                    >
                    {/* <form> */}
                    {({ formProps, submitting }) => (
                    <form {...formProps}>

                        <ModalHeader>
                            <ModalTitle>Añadir duda</ModalTitle>
                        </ModalHeader>
                        <ModalBody>

                            {/* Campo para indicar el responsable */}
                            <Field
                                aria-required={true}
                                name="listaParticipantesDuda"
                                defaultValue=""
                                label="Dueño/a de la duda"
                                isRequired
                            >
                                {({ fieldProps, error, valid }) => 
                                (
                                
                                    <Select
                                        {...fieldProps}
                                        options={meetingminute?.participants.map((estudiante) => ({ value: estudiante, label: estudiante, email: estudiante }))}
                                        value={selectedStudentDuda}
                                        onChange={(newValue: PropsValue<Estudiantes>, actionMeta: ActionMeta<Estudiantes>) => {
                                            setSelectedStudentDuda(newValue);
                                            // Handle the onChange event here
                                            console.log(newValue);
                                        }}
                                        placeholder="Seleccione..."
                                    />
                                )}
                            </Field>

                            {/* Campo para que escriban la duda */}
                            <Field
                                id="duda"
                                name="duda"
                                label="Escriba la duda"
                                isRequired
                            >
                            {({ fieldProps }) => (
                                <Fragment>
                                <TextArea
                                    {...fieldProps}
                                    defaultValue=""
                                    value={undefined}
                                    onChange={() => {
                                        // Handle the onChange event here
                                        console.log('onChange');
                                    }}
                                />
                                {/* <HelperMessage>
                                    {name ? `Hello, ${name}` : ''}
                                </HelperMessage> */}
                                </Fragment>
                            )}
                            </Field>

                        </ModalBody>
                        <ModalFooter>
                            <Button appearance="subtle" onClick={closeModalDuda}>
                            Cancelar
                            </Button>
                            <Button appearance="primary" onClick={() => guardarDuda()} type="submit">
                            Añadir
                            </Button>
                        </ModalFooter>
                    </form>
                    )}
                    </Form>
                </Modal>
                )}
            </ModalTransition>

            {/* ********************************************************************************************************************************************************** */}
            {/* ********************************************************************************************************************************************************** */}
            {/* ********************************************************************************************************************************************************** */}


            {/* ********************************************************************************************************************************************************** */}
            {/* ******************************************************************** Modal dialog para añadir nuevo tema ************************************************* */}
            {/* ********************************************************************************************************************************************************** */}
            <ModalTransition>
                {isOpenNuevoTema && (
                <Modal onClose={closeModalNuevoTema} shouldScrollInViewport>

                    <Form<{ username: string }>
                        onSubmit={(data) => {
                            // console.log('form data', data);
                            return new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>
                                data.username === 'error' ? { username: 'IN_USE' } : undefined,
                            );
                        }}
                    >
                    {/* <form> */}
                    {({ formProps, submitting }) => (
                    <form {...formProps}>

                        <ModalHeader>
                            <ModalTitle>Añadir nuevo tema</ModalTitle>
                        </ModalHeader>
                        <ModalBody>

                            {/* Campo para que escriban el nuevo tema */}
                            <Field
                                id="nuevoTema"
                                name="nuevoTema"
                                label="Escriba el nuevo tema"
                                isRequired
                            >
                            {({ fieldProps }) => (
                                <Fragment>
                                <TextArea
                                    {...fieldProps}
                                    defaultValue=""
                                    value={undefined}
                                    onChange={() => {
                                        // Handle the onChange event here
                                        console.log('onChange');
                                    }}
                                />
                                {/* <HelperMessage>
                                    {name ? `Hello, ${name}` : ''}
                                </HelperMessage> */}
                                </Fragment>
                            )}
                            </Field>

                        </ModalBody>
                        <ModalFooter>
                            <Button appearance="subtle" onClick={closeModalNuevoTema}>
                            Cancelar
                            </Button>
                            <Button appearance="primary" onClick={() => agregarTemaNuevo()} type="submit">
                            Añadir
                            </Button>
                        </ModalFooter>
                    </form>
                    )}
                    </Form>
                </Modal>
                )}
            </ModalTransition>

            {/* ********************************************************************************************************************************************************** */}
            {/* ******************************************************************** Modal dialog Chat ******************************************************************* */}
            {/* ********************************************************************************************************************************************************** */}
            <ModalTransition>
                {isOpenChat && (
                <Modal onClose={closeModalChat} shouldScrollInViewport>

                    <Form<{ username: string }>
                        onSubmit={(data) => {
                            // console.log('form data', data);
                            return new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>
                                data.username === 'error' ? { username: 'IN_USE' } : undefined,
                            );
                        }}
                    >
                    {/* <form> */}
                    {({ formProps, submitting }) => (
                    <form {...formProps}>

                        <ModalHeader>
                            <ModalTitle>Chat de la reunión</ModalTitle>
                        </ModalHeader>
                        <ModalBody>

                            <MessagesInput send={send}/>
                            <Messages messages={messages}/>

                        </ModalBody>
                        <ModalFooter>
                            <Button appearance="subtle" onClick={closeModalChat}>
                            Cerrar
                            </Button>
                        </ModalFooter>
                    </form>
                    )}
                    </Form>
                </Modal>
                )}
            </ModalTransition>


            {/* ********************************************************************************************************************************************************** */}
            {/* ******************************************************************** Modal dialog para añadir texto libre ************************************************ */}
            {/* ********************************************************************************************************************************************************** */}
            <ModalTransition>
                {isOpenTextoLibre && (
                <Modal onClose={closeModalTextoLibre} shouldScrollInViewport>

                    <Form<{ username: string }>
                        onSubmit={(data) => {
                            // console.log('form data', data);
                            return new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>
                                data.username === 'error' ? { username: 'IN_USE' } : undefined,
                            );
                        }}
                    >
                    {/* <form> */}
                    {({ formProps, submitting }) => (
                    <form {...formProps}>

                        <ModalHeader>
                            <ModalTitle>Añadir texto libre</ModalTitle>
                        </ModalHeader>
                        <ModalBody>

                            {/* Campo para indicar el responsable */}
                            <Field
                                aria-required={true}
                                name="listaParticipantesTextoLibre"
                                defaultValue=""
                                label="Dueño/a del texto libre"
                                isRequired
                            >
                                {({ fieldProps, error, valid }) => 
                                (
                                
                                    <Select
                                        {...fieldProps}
                                        options={meetingminute?.participants.map((estudiante) => ({ value: estudiante, label: estudiante, email: estudiante }))}
                                        value={selectedStudentTextoLibre}
                                        onChange={(newValue: PropsValue<Estudiantes>, actionMeta: ActionMeta<Estudiantes>) => {
                                            setSelectedStudentTextoLibre(newValue);
                                            // Handle the onChange event here
                                            console.log(newValue);
                                        }}
                                        placeholder="Seleccione..."
                                    />
                                )}
                            </Field>

                            {/* Campo para que escriban el nuevo tema */}
                            <Field
                                id="TextoLibre"
                                name="TextoLibre"
                                label="Escriba el texto libre"
                                isRequired
                            >
                            {({ fieldProps }) => (
                                <Fragment>
                                <TextArea
                                    {...fieldProps}
                                    defaultValue=""
                                    value={undefined}
                                    onChange={() => {
                                        // Handle the onChange event here
                                        console.log('onChange');
                                    }}
                                />
                                </Fragment>
                            )}
                            </Field>

                        </ModalBody>
                        <ModalFooter>
                            <Button appearance="subtle" onClick={closeModalTextoLibre}>
                            Cancelar
                            </Button>
                            <Button appearance="primary" onClick={() => guardarTextoLibre()} type="submit">
                            Añadir
                            </Button>
                        </ModalFooter>
                    </form>
                    )}
                    </Form>
                </Modal>
                )}
            </ModalTransition>

            
            {/* ********************************************************************************************************************************************************** */}
            {/* ******************************************************************** Modal dialog para mostrar informacion de la reunion ********************************* */}
            {/* ********************************************************************************************************************************************************** */}
            <ModalTransition>
                {isOpenInfoReu && (
                <Modal width={'x-large'} onClose={closeModalInfoReu} shouldScrollInViewport>

                    <Form<{ username: string }>
                        onSubmit={(data) => {
                            // console.log('form data', data);
                            return new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>
                                data.username === 'error' ? { username: 'IN_USE' } : undefined,
                            );
                        }}
                    >
                    {/* <form> */}
                    {({ formProps, submitting }) => (
                    <form {...formProps}>

                        <ModalHeader>
                            <Button appearance="subtle">Informacion de la reunión</Button>
                        </ModalHeader>
                        <ModalBody>
                            
                            <Box padding="space.400" backgroundColor="color.background.discovery" xcss={boxStyles}>
                                <h2 style={{marginTop:'0px', textAlign:'center'}}>Descripción</h2>
                                <br />
                                <h3 style={{ marginTop: "5px", marginBottom: "5px" }}>Objetivo: {meetingminute?.title}</h3>
                                <br />
                                <h3 style={{ marginTop: "5px", marginBottom: "5px" }}>Lugar: {meetingminute?.place}</h3>
                                <br />

                                {/* si aun no inicia la reunion, se muestra la lista de temas que se van a tratar */}
                                {!iniciarReunion ? (
                                    <>
                                    <h3 style={{ marginTop: "5px", marginBottom: "5px" }}>Temas:</h3>
                                    {meetingminute?.topics.map((topic, index) => (
                                        <>
                                            {/* <h3 key={index}>{topic}</h3> */}
                                            <h4 key={index} style={{ marginLeft: '30px', marginTop: "5px", marginBottom: "5px" }}>{topic}</h4>
                                            <br />
                                        </>
                                    ))}
                                    <br />
                                    </>
                                ):(
                                    <>
                                    </>
                                )}

                                <h3 style={{ marginTop: "5px", marginBottom: "5px" }}>Anfitrión/a:</h3>
                                {meetingminute?.leaders.map((leader, index) => (
                                    <h4 key={index} style={{ marginLeft: '30px', marginTop: "5px", marginBottom: "5px" }}>{leader}</h4>
                                ))}
                                <br />
                                <h3 style={{ marginTop: "5px", marginBottom: "5px" }}>Secretario/a:</h3>
                                {meetingminute?.secretaries.map((secretari, index) => (
                                    <h4 key={index} style={{ marginLeft: '30px', marginTop: "5px", marginBottom: "5px" }}>{secretari}</h4>
                                ))}
                                <br />
                                <h3 style={{ marginTop: "5px", marginBottom: "5px" }}>Invitados/as:</h3>
                                {meetingminute?.participants.map((participant, index) => (
                                    <h4 key={index} style={{ marginLeft: '30px', marginTop: "5px", marginBottom: "5px" }}>{participant}</h4>
                                ))}
                                <br />
                                {/* condicion para mostrar la informacion siempre y cuando haya informacion que mostrar */}
                                {meetingminute?.externals.length != 0 && (
                                    <>
                                        <h3 style={{ marginTop: "5px", marginBottom: "5px" }}>Externos:</h3>
                                        {meetingminute?.externals.map((external, index) => (
                                            <h4 key={index} style={{ marginLeft: '30px', marginTop: "5px", marginBottom: "5px" }}>{external}</h4>
                                        ))}
                                    </>
                                )}

                                {/* LOS ASISTENTES SON LOS QUE FUERON INVITADOS Y SI FUERON... ESTO SOLO SE MOSTRATA EN LA ETAPA DE POST-REUNION */}
                                {/* <h3 style={{ marginTop: "5px", marginBottom: "5px" }}>Asistentes: {meetingminute?.assistants}</h3> */}
                                {/* <h3 style={{ marginTop: "5px", marginBottom: "5px" }}>Asistentes:</h3>
                                {meetingminute?.assistants.map((assistant, index) => (
                                    <h3 key={index} style={{ marginLeft: '30px', marginTop: "5px", marginBottom: "5px" }}> {assistant}</h3>
                                ))} */}                    

                                {/* <h3 style={{ marginTop: "5px", marginBottom: "5px" }}>Links: {meetingminute?.links}</h3> */}
                                {meetingminute?.links.length != 0 && (
                                    <>
                                        <h3 style={{ marginTop: "5px", marginBottom: "5px" }}>Links:</h3>
                                        {meetingminute?.links.map((link, index) => (
                                            <h4 key={index} style={{ marginLeft: '30px', marginTop: "5px", marginBottom: "5px" }}>{link}</h4>
                                        ))}
                                        <br />
                                    </>
                                )}
                            </Box>
                            <br />
                            

                            {/* {compromisosProyecto?.length != 0 && (
                                <>
                                    <Box padding="space.400" backgroundColor="color.background.neutral" xcss={boxStyles2}>
                                        <h2 style={{marginTop:'0px', textAlign:'center'}}>Estado del proyecto</h2>
                                        <br />
                                            <h3 style={{ marginTop: "5px", marginBottom: "5px" }}>Compromisos previos:</h3>
                                            {compromisosProyecto?.map((compromiso, index) => (
                                                <>
                                                    {compromiso.number < (meetingminute?.number ?? 0) && (
                                                        <>
                                                            {index == 0 && (
                                                                <>
                                                                    <h4 key={index} style={{ marginLeft: '30px', marginTop: "5px", marginBottom: "5px" }}>{compromiso.participants}</h4>
                                                                </>
                                                            )}
                                                            {index !== 0 && (
                                                                <>
                                                                    {Array.from(compromisosProyecto[index - 1].participants).map((char: string, charIndex: number) => (
                                                                        <>
                                                                            <h4 key={charIndex} style={{ marginLeft: '30px', marginTop: "5px", marginBottom: "5px"}}>
                                                                                {char === compromiso.participants[charIndex] ? '' : (compromiso.participants)}
                                                                            </h4>
                                                                        </>
                                                                    ))}
                                                                </>
                                                            )}
                                                            
                                                            <Inline>
                                                                {new Date(compromiso.dateLimit) < new Date() && (
                                                                    <>
                                                                        <Stack>
                                                                            <h4 key={index} style={{ marginLeft: '50px', marginTop: "5px", marginBottom: "5px", color: 'red'}}>{compromiso.number}.{compromiso.position} Descripción: {compromiso.description}</h4>
                                                                            <h4 key={index} style={{ marginLeft: '50px', marginTop: "0px", marginBottom: "20px", color: 'red'}}>Fecha límite: {new Date(compromiso.dateLimit).toLocaleDateString("es-CL")}</h4>
                                                                        </Stack>
                                                                    </>
                                                                )}
                                                                {new Date(compromiso.dateLimit) > new Date() && (
                                                                    <>
                                                                        <Stack>
                                                                            <h4 key={index} style={{ marginLeft: '50px', marginTop: "5px", marginBottom: "5px", color: 'green'}}>{compromiso.number}.{compromiso.position} Descripción: {compromiso.description}</h4>
                                                                            <h4 key={index} style={{ marginLeft: '50px', marginTop: "0px", marginBottom: "20px", color: 'green'}}>Fecha límite: {new Date(compromiso.dateLimit).toLocaleDateString("es-CL")}</h4>
                                                                        </Stack>
                                                                    </>
                                                                )}
                                                            </Inline>
                                                            
                                                        </>
                                                    )}
                                                </>
                                            ))}
                                    </Box>
                                </>
                            )} */}

                        </ModalBody>
                        <ModalFooter>
                            <Button appearance="subtle" onClick={closeModalInfoReu}>
                            Cerrar
                            </Button>
                        </ModalFooter>
                    </form>
                    )}
                    </Form>
                </Modal>
                )}
            </ModalTransition>

    </div>

);
};

export default FormularioEnReunion;