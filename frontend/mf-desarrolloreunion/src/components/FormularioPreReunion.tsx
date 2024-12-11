import React, { Fragment, useEffect, useState, useCallback } from "react";
import { Inline, Stack } from '@atlaskit/primitives';
import Form, { ErrorMessage, Field, FormFooter } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import TextArea from '@atlaskit/textarea';
import { DatePicker, DateTimePicker } from '@atlaskit/datetime-picker';
import Button, { ButtonGroup } from '@atlaskit/button';
import LoadingButton from '@atlaskit/button/loading-button';
import Select, { ActionMeta, MultiValue, PropsValue } from 'react-select';
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { ProgressTracker, Stages } from '@atlaskit/progress-tracker';
import { CreatableSelect, OptionType, ValueType } from '@atlaskit/select';
import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTitle,
    ModalTransition,
} from '@atlaskit/modal-dialog';
import Tooltip, { TooltipPrimitive } from '@atlaskit/tooltip';
import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';
import WarningIcon from '@atlaskit/icon/glyph/warning'
import AddIcon from '@atlaskit/icon/glyph/add'
import TrashIcon from '@atlaskit/icon/glyph/trash'
import AvatarGroup from '@atlaskit/avatar-group';
import Popup from '@atlaskit/popup';
import { Box, xcss } from '@atlaskit/primitives';
import CommentIcon from '@atlaskit/icon/glyph/comment';


import io, { Socket } from "socket.io-client";

import FormularioEnReunion from "./FormularioEnReunion";
import MessagesInput from "./MessageInput";
import Messages from "./Messages";

// Se obtiene el token del usuario logeado
const tokenUser = localStorage.getItem('tokenUser');

// Se obtiene el tipo de usuario logeado
const tipoDeUsuario = localStorage.getItem('tipoUsuario');

const descripcionReunion = localStorage.getItem('descripcionReunion');

var correoUserOwner: string = "";
correoUserOwner = localStorage.getItem('userOwner') ?? "";

// para validar el campo de fecha de inicio
const validateField = (value?: string) => {
    if (!value) {
        return 'Requerido';
    } else if (new Date(value) < new Date()) {
        return 'EXPIRED';
    }
};

// para validar el campo de fecha de termino
const validateField2 = (value?: string) => {
    if (!value) {
        return 'Requerido';
    } else if (new Date(value) < new Date()) {
        return 'EXPIRED';
    }
};

const contentStyles = xcss({
    padding: 'space.200',
    width: '600px',
    // height: '200px',
    
});

// estados de la reunion (para la barra de progreso)
const items: Stages = [
    {
        id: 'pre-reunion',
        label: 'Pre-reunión',
        percentageComplete: 0,
        status: 'current',
        href: '#',
    },
    {
        id: 'en-reunion',
        label: 'En-reunión',
        percentageComplete: 0,
        status: 'unvisited',
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


const InlineDialog = styled(TooltipPrimitive)({
    background: 'white',
    width: '600px',
    borderRadius: token('border.radius', '4px'),
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
    boxSizing: 'content-box',
    padding: `${token('space.100', '8px')} ${token('space.150', '12px')}`,
});

var listaMiembrosOriginal: string[] = [];

// variables globales
var objetivoValue: string;
var lugarValue: string;

var fechaInicioValue: string;
var fechaInicio: string;
var horaInicio: string;

var fechaTerminoValue: string;
var fechaTermino: string;
var horaTermino: string;

var listaParticipantesValue: string[] = [];
var listaParticipantesFueraProyectoValue: string[] = [];

var listaParticipantesValueFinal: string[] = [];
var listaParticipantesFueraProyectoValueFinal: string[] = [];

var listaAnfitrionesValue: string[] = [];
var listaAnfitrionesValueFinal: string[] = [];
var secretarioValue: string;

var listaTemas: string[] = [];

var listaEnlaces: string[] = [];

var estadoReunion: string;

var nombreCortoProyectoAux: string;

const FormularioPreReunion: React.FC = () => {

    // par el envio de mensajes mediante websockets
    const [messages, setMessages] = useState<string[]>([]);

    // funciona separando el chat en salas
    const send = (value:string) => {
        const decodedToken: any = tokenUser ? jwtDecode(tokenUser) : null;
        correoElectronico = decodedToken.email;
        const payload = {
            room: localStorage.getItem('idReunion'),
            user: correoElectronico,
            message: value,
        };
        socket?.emit('messageVer3', payload);
    }

    // funciona separando el chat en salas
    const messageListener = (message: string, user: string) => {
        setMessages([...messages, "- " + user + ": " + message]);
    }

    // funciona separando el chat en salas
    useEffect(() => {
        socket?.on('messageVer3', (payload: any) => {
            messageListener(payload.message, payload.user);
        });
        return () => {
            socket?.off('messageVer3', messageListener);
        }
        // setMessages([]); -> comentado

    }, [messageListener]);

    // para el popup del chat
    const [isOpen, setIsOpen] = useState(false)

    // websocket
    // const [socket, setSocket] = useState<Socket | null>(null);
    const [socket, setSocket] = useState<Socket>();

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

    const profesorOwner: ProfesorOwner = {
        email: correoUserOwner,
        value: correoUserOwner,
        label: correoUserOwner
    };

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

    // interfaz para obtener los datos de la reunion
    interface Reunion {
        name: string;
        description: string;
        number: number;
        state: string;
        project: string[];
        createdAt: string;
        updatedAt: string;
    }

    // Intefaz para almacenar la informacion del primer formulario
    interface Formulario1 {
        objetivo: string;
        lugar: string;
        fechaInicio: Date;
        fechaTermino: Date;
        listaParticipantes: string[];
        listaAnfitriones: string[];
        secretario: string;
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

    // const [formulario1, setFormulario1] = useState<Formulario1>({    
    const [formulario1, setFormulario1] = React.useState<Formulario1>();
    var correoElectronico: string;

    //OBTENER TODOS LOS ESTUDIANTES AL PRINCIPIO
    const [estudiantes, setEstudiantes] = React.useState<Estudiantes[]>([]);

    const [usuarioPerfil, setusuarioPerfil] = React.useState<Estudiantes>();

    const [usuarioInvitado, setusuarioInvitado] = React.useState<EstudiantesInvitados>();
    var nombreCortoProyectoUsuarioInvitado: string;

    // para separar en el listado que se le muestra al profesor
    const [estudiantesEnProyecto, setEstudiantesEnProyecto] = React.useState<Estudiantes[]>([]);
    const [estudiantesNoProyecto, setEstudiantesNoProyecto] = React.useState<Estudiantes[]>([]);

    // Obtener los datos de la reunion al inicio
    const [reunion, setReunion] = React.useState<Reunion>();

    // Para determinar si se muestra en la parte central el acta dialogica o no (en cualquiera que sea su etapa, pre, in, post o finalizada)
    const [verActaDialogica, setVerActaDialogica] = React.useState(false);

    // Para determinar si completo el primer formulario
    const [iniciarFormulario, setIniciarFormulario] = React.useState(false);

    // Para lista de invitados (pertenecen al proyecto)
    const [selectedInvitados, setSelectedInvitados] = useState<PropsValue<Estudiantes>>([]);

    // Para la lista de invitados (No pertenecen al proyecto)
    const [selectedInvitadosNoProyecto, setSelectedInvitadosNoProyecto] = useState<PropsValue<Estudiantes>>([]);

    // Para lista de anfitriones
    const [selectedAnfitriones, setSelectedAnfitriones] = useState<PropsValue<Estudiantes>>([]);

    // Para lista de secretarios
    const [selectedSecretario, setSelectedSecretario] = useState<PropsValue<Estudiantes>>([]);

    // para guardar datos del proyecto
    const [proyectoUser, setProyectsUser] = React.useState<ProyectoUser>();

    // Para mostrar los temas que añade el usuario y que se actualice en tiempo real
    const [temasUsuario, setTemasUsuarios] = React.useState<string[]>();

    // para guardar los datos del acta dialogica (meetingminute)
    const [meetingminute, setMeetingMinute] = React.useState<MeetingMinute>();

    const [listaParticipantes, setListaParticipantes] = React.useState<Usuario[]>([]);
    var listaParticipantesAux: Usuario[] = [];

    var idProyectoDeReunion: string;
    var estudiantesProfesor: Estudiantes[] = [];
    var estudiantesProyecto: string[] = [];
    var estudiantesProyectoAux: Estudiantes[] = [];
    var estudiantesFueraProyectoAux: Estudiantes[] = [];

    var usuarioLog: Estudiantes;

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
        const newSocket = io(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_IO_PORT}`);
        setSocket(newSocket);

        // Identificar al nuevo usuario conectado
        newSocket.on('new_user', (payload) => {
            agregarParticipante(payload);
            newSocket.emit('event_lista_participantes_ver3', { room: localStorage.getItem('idReunion'), lista: listaParticipantesAux });
        });

        // Recoger la lista de participantes
        newSocket.on('new_lista_participantes_ver3', (payload: any[]) => {
            if (payload.length === 1) {
                return;
            }
            console.log("------------- a")
            payload.forEach((participant: any) => {
                console.log("correo: " + participant.email);
            });
            setListaParticipantes(payload);
        });

        newSocket.on('new_reload_ver4', () => {
            localStorage.setItem('estadoReunion', "En-reunión");
            window.location.reload();
        });

        // CONDICION PARA SETEAR LISTA TEMAS. Si la reunion actual corresponde a la reunion 1, lista temas se setea como vacio, en caso contrario se setea con un tema predeterminado
        // el proceso de la condicion se deja dentro de la funcion "datosReunion"
        // se setea los temas de usuario como vacio
        // setTemasUsuarios(listaTemas);

        const storedValue = localStorage.getItem('verActaDialogica');
        if (storedValue) {
            const parsedValue = JSON.parse(storedValue);
            setVerActaDialogica(parsedValue);
        }

        // Cada vez que se recargue la pagina, como se pierden los datos, se resetea "iniciarFormulario"
        localStorage.setItem('iniciarFormulario', JSON.stringify(false));
        const storedValue2 = localStorage.getItem('iniciarFormulario');
        if (storedValue2) {
            const parsedValue2 = JSON.parse(storedValue2);
            setIniciarFormulario(parsedValue2);
        }

        // obtener los datos del usuario logeado
        const idPerfil = localStorage.getItem('idPerfil');
        async function obtenerDatosUsuario() {
            try {
                // Solo se requiere del token del usuario para realizar la petición
                const response = await axios.get(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/user/perfil/` + idPerfil, {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("$%$%$%$% INFORMACION DEL USUARIO PRE-REU");
                console.log(response.data);
                response.data.value = response.data.email;
                response.data.label = response.data.email;
                setusuarioPerfil(response.data);
                usuarioLog = response.data;
                newSocket.emit('event_join', { room: localStorage.getItem('idReunion'), user: response.data });
            } catch (error) {
                console.error(error);
                console.error("NO HAY NINGUN ID EN LOCAL STORAGE PARA CARGAR EL PERFIL DEL USUARIO");
            }
        }

        const idReunion = localStorage.getItem('idReunion') ?? ''; // id de la reunion traido desde local storage
        // Obtener datos de la reunion a partir del id, de tal forma el numero de la reunion pueda quedar almacenado en el acta dialogica
        async function datosReunion() {
            try {
                const response = await axios.get(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/meeting/` + idReunion, {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log(response.data);
                setReunion(response.data);
                idProyectoDeReunion = response.data.project;

                // si responde.data.number es igual a cero, se setea la lista de temas como vacia
                if (response.data.number === 0) {
                    setTemasUsuarios(listaTemas);
                }
                else {
                    listaTemas.push("Revisar compromisos previos");
                    setTemasUsuarios(listaTemas);
                }

            } catch (error) {
                console.error(error);
            }
        }
        // datosReunion();

        estadoReunion = localStorage.getItem('estadoReunion') ?? '';
        // Se cambia el estado de la reunión a "pre-reunión"
        async function cambiarEstado() {
            try {
                const response = await axios.put(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/meeting/` + idReunion, {
                    state: "Pre-reunión"
                }, {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Estado cambiado exitosamente");
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        }

        // Se obtienen los estudiantes para mostrarlos en el formulario
        async function obtenerEstudiantes() {
            try {
                // ACTUALIZACION: PUESTO QUE AHORA UN USUARIO ESTUDIATE PUEDE COMPLETAR EL FORMULARIO DE PRE-REUNION, YA NO SE REQUIERE DE ESTO, puesto que el correo del usuario profesor dueño del proyecto quedo almacenado en localstorage
                // A partir del token del usuario logeado se obtiene el correo electronico, que sera usado para obtener los estudiantes del usuario logeado
                // const decodedToken: any = tokenUser ? jwtDecode(tokenUser) : null;
                // correoElectronico = decodedToken.email;
                // console.log("email traido desde el token: ", correoElectronico);


                const response = await axios.get(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/user/list/email/` + correoUserOwner, {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Todos los usuarios");
                console.log(response.data);
                setEstudiantes(response.data);
                estudiantesProfesor = response.data;

            } catch (error) {
                console.error(error);
            }
        }
        // obtenerEstudiantes();

        // Obtener datos del proyecto
        async function obtenerProyectoPorId() {
            // window.alert("id del proyecto: " + idProyectoDeReunion)
            try {
                // Solo se requiere del token del usuario para realizar la petición
                const response = await axios.get(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/project/getProjectbyID/` + idProyectoDeReunion, {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });

                setProyectsUser(response.data);
                nombreCortoProyectoAux = response.data.shortName;
                estudiantesProyecto = response.data.userMembers;
                listaMiembrosOriginal = response.data.userMembersOriginal;

            } catch (error) {
                console.error(error);
            }
        }
        // obtenerProyectoPorId();

        // para solamente obtener los estudiantes que son parte del proyecto
        async function filtrarEstudiantesProyecto() {
            var listaAux: ProfesorOwner[] = [];
            // se añade a la lista de estudiantes en el proyecto al usuario logeado -> profesor
            //ACTUALIZACION: Ahora un usuario estudiante tambien puede completar el formulario, por lo que se cambio esta logica para que agregue siempre al usuario profesor dueño del proyecto
            if (profesorOwner) {
                estudiantesProyectoAux.push(profesorOwner);
                listaAux.push(profesorOwner);
            }
            // if (usuarioLog) {
            //     estudiantesProyectoAux.push(usuarioLog);
            // }
            estudiantesProfesor.forEach((estudiante) => {
                if (estudiantesProyecto.includes(estudiante.email)) {
                    console.log("Estudiante del proyecto:" + estudiante.email);
                    estudiantesProyectoAux.push(estudiante);
                    // setEstudiantesEnProyecto([...estudiantesEnProyecto, estudiante]);
                    var eAux: ProfesorOwner = {email: estudiante.email, value: estudiante.email, label: estudiante.email};
                    listaAux.push(eAux);
                }
                else {
                    console.log("Estudiante NO del proyecto:" + estudiante.email);
                    estudiantesFueraProyectoAux.push(estudiante);
                    // setEstudiantesNoProyecto([...estudiantesNoProyecto, estudiante]);
                }
            });
            
            setEstudiantesEnProyecto(estudiantesProyectoAux);
            setSelectedInvitados(listaAux);
            // console.log("Estudiantes en proyecto PPPPPPPPPPPPPPPPPPPPPPPPP: ", estudiantesProyectoAux);
            setEstudiantesNoProyecto(estudiantesFueraProyectoAux);
        }


        // asegurar que las funciones se ejecuten en el orden establecido
        const fetchData = async () => {
            await obtenerDatosUsuario ();
            await datosReunion();
            if (reunion?.state === "nueva" || reunion?.state === "Nueva" || reunion?.state === "new" || reunion?.state === "New") {
                await cambiarEstado();
            };

            await obtenerEstudiantes();

            await obtenerProyectoPorId();
            await filtrarEstudiantesProyecto();
        };
        fetchData();


    }, [setSocket]);

    // avatar group para mostrar
    const data = listaParticipantes.map((d, i) => ({
        key: d.email,
        name: d.name + " - " + d.email,
        href: '#',
        src: d.avatar,
    }));


    // Entrada: ninguna
    // Salida: ninguna (guardar en variables globales los datos del formulario 1)
    // Funcion que se encarga de guardar los datos del formulario 1 en variables globales
    const guardarFormulario1 = () => {

        const decodedToken: any = tokenUser ? jwtDecode(tokenUser) : null;
        correoElectronico = decodedToken.email;

        objetivoValue = (document.getElementsByName("objetivo")[0] as HTMLInputElement).value;
        lugarValue = (document.getElementsByName("lugar")[0] as HTMLInputElement).value;

        fechaInicioValue = (document.getElementsByName("fechaInicio")[0] as HTMLInputElement).value;
        fechaInicio = fechaInicioValue.split("T")[0];
        // se añade un dia a la fecha de inicio, para que la fecha de inicio sea igual a la ingresada por el usuario
        const fechaInicioDate = new Date(fechaInicio);
        fechaInicioDate.setDate(fechaInicioDate.getDate() + 1);


        // fechaInicio = fechaInicioDate.toISOString().split("T")[0]; ----> COMENTADO PORQUE DABA UN ERROR ANTES DE HACER LAS VERIFICACIONES


        horaInicio = fechaInicioValue.split("T")[1];

        fechaTerminoValue = (document.getElementsByName("fechaTermino")[0] as HTMLInputElement).value;
        fechaTermino = fechaTerminoValue.split("T")[0];
        // se añade un dia a la fecha de termino, para que la fecha de termino sea igual a la ingresada por el usuario
        const fechaTerminoDate = new Date(fechaTermino);
        fechaTerminoDate.setDate(fechaTerminoDate.getDate() + 1);


        // fechaTermino = fechaTerminoDate.toISOString().split("T")[0]; ----> COMENTADO PORQUE DABA UN ERROR ANTES DE HACER LAS VERIFICACIONES



        horaTermino = fechaTerminoValue.split("T")[1];

        const listaParticipantesValueAux = (document.getElementsByName("listaParticipantes"));
        const listaParticipantesFueraProyectoValueAux = (document.getElementsByName("listaParticipantesNoProyecto"));
        const listaAnfitrionesValueAux = (document.getElementsByName("listaAnfitriones"));
        secretarioValue = (document.getElementsByName("secretario")[0] as HTMLInputElement).value;


        // de forma automatica, se añade al creador de la reunion como anfitrion y participante -> YA NO, DEBIDO A QUE AHORA EL CREADOR DEBERA SELECCIONARSE PARA ESO
        listaParticipantesValueAux.forEach((element: HTMLElement) => {
            listaParticipantesValue.push((element as HTMLInputElement).value);
        });
        // listaParticipantesValue.push(correoElectronico);

        listaParticipantesFueraProyectoValueAux.forEach((element: HTMLElement) => {
            listaParticipantesFueraProyectoValue.push((element as HTMLInputElement).value);
        });

        listaAnfitrionesValueAux.forEach((element: HTMLElement) => {
            listaAnfitrionesValue.push((element as HTMLInputElement).value);
        });
        // listaAnfitrionesValue.push(correoElectronico);



        // comprobacion solo para las fechas (considerando que los usuarios tienden a no ingresar valores)
        if (fechaInicioValue === "" || fechaInicioValue === " " || fechaTerminoValue === "" || fechaTerminoValue === " ") {
            window.alert("Debe completar los campos de fecha y hora de inicio y termino");
            return;
        }

        // comprobacion de los datos (no pueden ser vacios) -> no es necesario revisar "listaParticipantesFueraProyectoValue", dado a que puede quedar vacio
        if (objetivoValue === "" || objetivoValue === " " || lugarValue === "" || lugarValue === " " || fechaInicioValue === "" || fechaInicioValue === " " || fechaTerminoValue === "" || fechaTerminoValue === " " || listaParticipantesValue.length === 0 || listaAnfitrionesValue.length === 0 || secretarioValue === "" || secretarioValue === " ") {
            window.alert("Debe completar todos los campos obligatorios (*) antes de continuar");
            return;
        }

        // cambiar el valor de iniciarFormulario (en el codigo como tambien en el local storage)
        const newValue = !iniciarFormulario;
        localStorage.setItem('iniciarFormulario', JSON.stringify(newValue));
        if (iniciarFormulario == false) {
            setIniciarFormulario(true);
        }
        else {
            setIniciarFormulario(false);
        }


        // si pasa la comprobacion, puedo guardar en la variable global aquellos que corresponden a listas
        listaParticipantesValueFinal = [];
        listaParticipantesValueAux.forEach((element: HTMLElement) => {
            listaParticipantesValueFinal.push((element as HTMLInputElement).value);
        });

        // en caso de que secretarioValue no sea parte de los participantes, se añade
        if (!listaParticipantesValueFinal.includes(secretarioValue)) {
            listaParticipantesValueFinal.push(secretarioValue);
        }
        // listaParticipantesValueFinal.push(correoElectronico);

        listaParticipantesFueraProyectoValueFinal = [];
        listaParticipantesFueraProyectoValueAux.forEach((element: HTMLElement) => {
            listaParticipantesFueraProyectoValueFinal.push((element as HTMLInputElement).value);
        });

        listaAnfitrionesValueFinal = [];
        listaAnfitrionesValueAux.forEach((element: HTMLElement) => {
            listaAnfitrionesValueFinal.push((element as HTMLInputElement).value);
        });
        // en caso que el anfitrion no sea parte de los participantes, se añade
        if (!listaParticipantesValueFinal.includes(listaAnfitrionesValueFinal[0])) {
            listaParticipantesValueFinal.push(listaAnfitrionesValueFinal[0]);
        }

        // listaAnfitrionesValueFinal.push(correoElectronico);

        // console.log("Participantes: ", listaParticipantesValue);
        try {
            const response = await axios.put(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/meeting/`, {
                state: "En-reunión"
            }, {
                headers: {
                    Authorization: `Bearer ${tokenUser}`
                }
            });
            console.log("Evento creado exitosamente en Google Calendar");
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }


        window.alert("Informacion guardada correctamente");
    }

    // Entrada: ninguna
    // Salida: ninguna (guardar en variables globales los datos del formulario 2)
    // Funcion que se encarga de guardar los datos del formulario 2 en variables globales
    const guardarFormulario2 = () => {
        const temasValue = (document.getElementsByName("temas")[0] as HTMLInputElement).value;
        //comprobar que el campo no este vacio
        if (temasValue === "" || temasValue === " ") {
            window.alert("Debe completar el campo para añadir un tema");
            return;
        }

        // comprobar si el tema actual fue previamente añadido (revisar repeticion del tema)
        for (let i = 0; i < listaTemas.length; i++) {
            if (listaTemas[i] === temasValue) {
                window.alert("El tema ya fue añadido previamente");
                return;
            }
        }

        // En caso de pasar las comprobaciones, se añade el tema
        listaTemas.push(temasValue);
        // temasUsuario?.push(temasValue);
        // setTemasUsuarios(listaTemas);
        // window.alert("temas: " + temasUsuario)
        console.log("Temas: ", listaTemas);
        closeModalTemas();
    }

    // Entrada: ninguna
    // Salida: ninguna (guardar en variables globales los datos del formulario 3)
    // Funcion que se encarga de guardar los datos del formulario 3 en variables globales
    const guardarFormulario3 = () => {
        var enlacesValue = (document.getElementsByName("enlaces")[0] as HTMLInputElement).value;
        var descripcionEnlacesValue = (document.getElementsByName("descripcionEnlaces")[0] as HTMLInputElement).value;
        // si tiene un punto final, este se elimina, puesto que despues se agrega uno y la idea no es que hayan dos puntos
        if (descripcionEnlacesValue.endsWith(".")) {
            descripcionEnlacesValue = descripcionEnlacesValue.slice(0, -1);
        }

        //comprobar que el campo no este vacio
        if (enlacesValue === "" || enlacesValue === " " || descripcionEnlacesValue === "" || descripcionEnlacesValue === " ") {
            window.alert("Debe completar los campo para añadir un enlace");
            return;
        }

        // comprobar si el enlace actual fue previamente añadido (revisar repeticion del enlace)
        for (let i = 0; i < listaEnlaces.length; i++) {
            if (listaEnlaces[i] === enlacesValue) {
                window.alert("El enlace ya fue añadido previamente");
                return;
            }
        }

        // En caso de pasar las comprobaciones, se añade el enlace

        // CASO NUEVO: puesto que ahora se considera una descripción, se concatenaran los strings
        var enlacesValueAux: string = enlacesValue + ". " + descripcionEnlacesValue + ".";
        // enlacesValue.concat(". ", descripcionEnlacesValue);
        // CASO NUEVO: se le añade un punto final al enlace
        // enlacesValue.concat(".");
        listaEnlaces.push(enlacesValueAux);
        console.log("Enlaces: ", listaEnlaces);
        // window.alert("Enlaces añadidos exitosamente");
        closeModalEnlaces();
    }

    // Entrada: ninguna
    // Salida: ninguna (guardar en variables globales los datos del formulario 3)
    // Funcion que se encarga de regresar a la pestaña principal
    const cancelarOperacion = () => {
        const newValue = !verActaDialogica;
        // Guardar valor de la variable en local storage
        localStorage.setItem('verActaDialogica', JSON.stringify(newValue));
        if (verActaDialogica == false) {
            setVerActaDialogica(true);
        }
        else {
            setVerActaDialogica(false);
        }
        window.location.reload();
    }

    // FUNCION NO UTILIZADA
    const verTemasActuales = () => {
        window.alert("Temas actuales:\n\n" + listaTemas.map(tema => `- ${tema}`).join("\n\n"));
    }

    // Funcion que se encarga de eleminar el ultimo tema añadido
    const borrarUltimoTema = () => {
        listaTemas.pop();
        closeModalTemasBorrar();
    }

    // FUNCION NO UTILIZADA
    const verEnlacesActuales = () => {
        window.alert("Enlaces actuales:\n\n" + listaEnlaces.map(enlace => `- ${enlace}`).join("\n\n"));
    }

    // Funcion que se encarga de eleminar el ultimo enlace añadido
    const borrarUltimoEnlace = () => {
        listaEnlaces.pop();
        closeModalEnlacesBorrar();
    }


    // Entrada: ninguna
    // Salida: ninguna, cambia variables en local storage y realiza peticiones al backend
    // Funcion que realiza la comprobacion de los datos ingresados por el usuario (guardados en variables globales), y realiza dos peticiones al backend. La primera para cmabiar el estado de lar reunion y la segunda para crear el acta dialogica
    const guardarFormularioFinal = () => {

        // paso 1: revisar que los campos esten completos
        if (objetivoValue === "" || objetivoValue === " " || lugarValue === "" || lugarValue === " " || fechaInicioValue === "" || fechaInicioValue === " " || fechaTerminoValue === "" || fechaTerminoValue === " " || listaParticipantesValueFinal.length === 0 || listaAnfitrionesValueFinal.length === 0 || secretarioValue === "" || secretarioValue === " " || listaTemas.length === 0) {
            window.alert("Debe completar todos los campos obligatorios (*) antes de continuar");
            return;
        }

        // paso 2.1: realizar peticion para cambiar el estado de la reunion
        const idReunion = localStorage.getItem('idReunion') ?? ''; // id de la reunion traido desde local storage
        async function cambiarEstadoEnReunion() {
            try {
                const response = await axios.put(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/meeting/` + idReunion, {
                    state: "En-reunión"
                }, {
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

        // paso 2.2: realizar la peticion para crear el acta dialogica (la reunion que se realizara) -> (en proceso), SE VERA PRIMERO EL CAMBIO DE FASE ENTRE ETAPAS
        async function crearActa() {
            try {
                listaParticipantesValueFinal = listaParticipantesValueFinal.concat(listaParticipantesFueraProyectoValueFinal);
                // eliminar todos los elementos vacios de la lista de participantes -> en caso de que no se hayan añadido invitados externos al proyecto
                listaParticipantesValueFinal = listaParticipantesValueFinal.filter((participante) => participante !== '');
                listaAnfitrionesValueFinal = listaAnfitrionesValueFinal.filter((anfitrion) => anfitrion !== '');
                const response = await axios.post(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/meeting-minute`, {
                    title: objetivoValue,
                    place: lugarValue,
                    startTime: fechaInicio,
                    endTime: fechaTermino,
                    startHour: horaInicio,
                    endHour: horaTermino,
                    // La hora de inicio se indicara en el componente "FormularioEnReunion", esto cuando el anfitrion presione "Comenzar Reunion"
                    topics: listaTemas,
                    participants: listaParticipantesValueFinal,
                    secretaries: [secretarioValue],
                    leaders: listaAnfitrionesValueFinal,
                    links: listaEnlaces,
                    meeting: idReunion,
                    number: reunion?.number,
                    fase: "pre-reunión",
                    cantElementos: 0,
                    nombreCortoProyecto: nombreCortoProyectoAux,
                    comenzoReunion: false,
                }, {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Acta creada exitosamente");
                console.log(response.data);
                setMeetingMinute(response.data)
                // se guarda en local storage el id del acta dialogica creada, para que en la siguiente etapa, se pueda rescatar dicho id y se pueda realizar la peticion al backend
                localStorage.setItem('idMeetingMinute', response.data._id);
            } catch (error) {
                console.error(error);
            }
        }
        crearActa();

        // paso 2.3: actualizar al usuario -> para que se indique el id del acta (utlima reunion que tuvo o que esta activa)
        async function ActualizarParticipantes(correoEstudiante: string, idActa: string, estadoReu: string) {
            try {
                const response = await axios.put(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/user/update/` + correoEstudiante + '/usuarioperfil', {
                    currentMeetingId: idActa,
                    currentMeeting: estadoReu,
                    lastLink: idReunion,
                    currentProjectId: proyectoUser?._id,
                    currentProject: proyectoUser?.shortName,
                }, {
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
                const response = await axios.get(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/user/perfil/email/` + correoEstudiante, {
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

        // MEJORA QUE PIDIO EL PROFE: si el participante acude a una reunion que no es de su proyecto, no se le actualiza el atributo "currentMeetingId" --> esto para que en el home profesor, cuando se presione a un estudiante solo se vaya a sus reuniones

        // se recorre la lista de participantes, de tal forma actualizar todos
        listaParticipantesValueFinal.forEach((participante: string) => {
            // POSIBILIDAD DE MEJORA: si el participante acude a una reunion que no es de su proyecto, no se le actualiza el atributo "currentMeetingId"

            // para aplicar esa mejora, necesito hacer una peticion para traer los datos del estudiante, y de ahi, comparar si el proyecto de la reunion es igual al proyecto del estudiante, si es asi, ejecuto la funcion
            obtenerDatosUsuarioInvitado(participante).then(() => {
                if (nombreCortoProyectoAux === nombreCortoProyectoUsuarioInvitado) {
                    ActualizarParticipantes(participante, localStorage.getItem('idMeetingMinute') ?? '', "En-reunión");
                }
            });

            // de esta forma actualizo a todos los invitados, sin importar si pertenecen o no al proyecto
            // ActualizarParticipantes(participante, localStorage.getItem('idMeetingMinute') ?? '', "En-reunión");
        });

        // paso 2.3.1: Se añaden los participantes que no pertenecen al proyecto al proyecto, de tal forma puedan ingresar a la reunion
        // 3.2: Añadir los nuevos miembros del proyecto al atributo "userMembersOriginal"
        async function ActualizarProyecto(idProyecto: string, nuevosIntegrantes: string[]) {
            try {
                const response = await axios.put(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/project/` + idProyecto, {
                    userMembers: listaMiembrosOriginal.concat(nuevosIntegrantes)
                }, {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Proyecto actualizado correctamente: Se añadieron al proyecto aquellos invitados que no pertenecen");
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        ActualizarProyecto(localStorage.getItem('idProyecto') ?? '', listaParticipantesFueraProyectoValueFinal);


        // paso 2.4: enviar notificacion a los participantes de la reunion (meetingminute)
        async function EnviarCorreo() {
            try {
                listaParticipantesValueFinal = listaParticipantesValueFinal.concat(listaParticipantesFueraProyectoValueFinal);
                // eliminar todos los elementos vacios de la lista de participantes -> en caso de que no se hayan añadido invitados externos al proyecto
                listaParticipantesValueFinal = listaParticipantesValueFinal.filter((participante) => participante !== '');
                listaAnfitrionesValueFinal = listaAnfitrionesValueFinal.filter((anfitrion) => anfitrion !== '');
                const response = await axios.post(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/meeting-minute/notify/state/change`, {
                    meetingMinuteDTO: {
                        title: objetivoValue,
                        place: lugarValue,
                        startTime: fechaInicio,
                        endTime: fechaTermino,
                        startHour: horaInicio,
                        endHour: horaTermino,
                        topics: listaTemas,
                        participants: listaParticipantesValueFinal,
                        secretaries: [secretarioValue],
                        leaders: listaAnfitrionesValueFinal,
                        links: listaEnlaces,
                        meeting: idReunion,
                        number: reunion?.number,
                        fase: "pre-reunión",
                        nombreCortoProyecto: nombreCortoProyectoAux,
                    },
                }, {
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

        // paso 3.1: cambiar valores de variable almancenada en local storage para ir a la siguiente etapa (en-reunion)
        localStorage.setItem('estadoReunion', "En-reunión");

        // paso 3.2: setear un valor en local storage para indicar que aun NO se inicia la reunion
        localStorage.setItem('iniciarReunion', JSON.stringify(false));

        // paso 4: informar al usuario del exito de la operacion 
        window.alert("Acta dialógica creada con éxito"); //Cambiar el mensaje

        // determinar el correo del usuario a partir de su token
        const decodedToken: any = tokenUser ? jwtDecode(tokenUser) : null;
        correoElectronico = decodedToken.email;

        // PASO FINAL: Crear la "sala" mediante websockets
        socket?.emit('event_meet', { room: localStorage.getItem('idMeetingMinute'), user: correoElectronico });

        // websocket
        // paso final: recargar la pagina para todos los usuarios conectados a la sala utilizando websockets
        const sala = localStorage.getItem('idReunion');
        const payload = {
            room: sala,
            user: correoElectronico,
        };
        socket?.emit('event_reload_ver4', payload);
        

        // paso 5: recargar pagina
        // window.location.reload();
    }


    //**********************************************************************
    //*******************  */ CAMPOS DEL FORMULARIO ************************
    //**********************************************************************
    const Objetivo = () => (
        <Field
            aria-required={true}
            name="objetivo"
            defaultValue= {descripcionReunion}
            label="Objetivo de la reunión"
            isRequired
        >
            {/* {({ fieldProps, error, valid }) => <TextField {...fieldProps} />} */}
            {({ fieldProps, error, valid }) => <TextField {...fieldProps} value={fieldProps.value ?? ''} />}
        </Field>
    );

    const Lugar = () => (
        <Field
            aria-required={true}
            name="lugar"
            defaultValue=""
            label="Lugar de la reunión (puede ser online, en tal caso indicar plataforma y enlace)"
            isRequired
        >
            {({ fieldProps, error, valid }) => <TextField {...fieldProps} />}
        </Field>
    );

    // FECHA Y HORA DE INICIO
    const FechaInicio = () => (
        <Field
            name="fechaInicio"
            label="Fecha y hora de inicio"
            // defaultValue={new Date().toISOString()}
            isRequired
        >
            {({ fieldProps: { id, ...rest }, error }) => {
                const validationState = error ? 'error' : 'default'; //REVISAR ESTO
                return (
                    <Fragment>
                        <div style={{ width: '300px' }}>
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
                            {error && <ErrorMessage>Este campo es obligatorio</ErrorMessage>}
                        </div>
                    </Fragment>
                );

            }}
        </Field>
    );

    // FECHA Y HORA DE INICIO
    const FechaTermino = () => (
        <Field
            name="fechaTermino"
            label="Fecha y hora de término"
            // defaultValue={new Date().toISOString()}
            isRequired
        >
            {({ fieldProps: { id, ...rest }, error }) => {
                const validationState = error ? 'error' : 'default'; //REVISAR ESTO
                return (
                    <Fragment>
                        <div style={{ width: '300px' }}>
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
                                    // placeholder: new Date().toLocaleTimeString("es-CL", { hour: '2-digit', minute: '2-digit' }),
                                    // se le añade una hora mas a la hora actual                                    
                                    placeholder: new Date(Date.now() + 60 * 60 * 1000).toLocaleTimeString("es-CL", { hour: '2-digit', minute: '2-digit' }),
                                    validationState,
                                    'aria-labelledby': `${id}-label`,
                                }}
                                {...rest}
                            />
                            {error && <ErrorMessage>Este campo es obligatorio</ErrorMessage>}
                        </div>
                    </Fragment>
                );
            }}
        </Field>
    );


    // En el presente campo solo se consideran a los estudiantes que son parte del proyecto
    const ListaParticipantes = () => {
        const [selectedStudent, setSelectedStudent] = useState<PropsValue<Estudiantes>>([]);
        return (
            <Field
                aria-required={true}
                name="listaParticipantes"
                defaultValue=""
                label="Invitados/as del proyecto a la reunión"
                isRequired
            >
                {({ fieldProps, error, valid }) =>
                (

                    <Select
                        {...fieldProps}
                        isMulti
                        // EN "estudiantes" TENGO A TODOS LOS ESTUDIANTES DEL PROFE... -> debo filtrar para solo entregar a los que son parte del proyecto
                        //options={estudiantes.map((estudiante) => ({ value: estudiante.email, label: estudiante.email, email: estudiante.email }))}
                        options={estudiantesEnProyecto.map((estudiante) => ({ value: estudiante.email, label: estudiante.email, email: estudiante.email }))}
                        value={selectedInvitados}
                        onChange={(newValue: PropsValue<Estudiantes>, actionMeta: ActionMeta<Estudiantes>) => {
                            setSelectedStudent(newValue);
                            setSelectedInvitados(newValue);
                            // Handle the onChange event here
                            console.log(newValue);
                        }}
                        placeholder="Seleccione..."
                    />
                )}
            </Field>
        );
    };

    // En el presente campo solo se consideran a los estudiantes que NO son parte del proyecto pero son estudiantes asociados al profesor que esta creando la reunion
    const ListaParticipantesNoProyecto = () => {
        const [selectedStudent, setSelectedStudent] = useState<PropsValue<Estudiantes>>([]);
        return (
            <Field
                aria-required={true}
                name="listaParticipantesNoProyecto"
                defaultValue=""
                label="Invitados/as fuera del proyecto a la reunión"
            // isRequired -> no es necesario
            >
                {({ fieldProps, error, valid }) =>
                (
                    <Select
                        {...fieldProps}
                        isMulti
                        // EN "estudiantes" TENGO A TODOS LOS ESTUDIANTES DEL PROFE... -> debo filtrar para solo entregar a los que son parte del proyecto
                        //options={estudiantes.map((estudiante) => ({ value: estudiante.email, label: estudiante.email, email: estudiante.email }))}
                        options={estudiantesNoProyecto.map((estudiante) => ({ value: estudiante.email, label: estudiante.email, email: estudiante.email }))}
                        value={selectedInvitadosNoProyecto}
                        onChange={(newValue: PropsValue<Estudiantes>, actionMeta: ActionMeta<Estudiantes>) => {
                            setSelectedStudent(newValue);
                            setSelectedInvitadosNoProyecto(newValue);
                            // Handle the onChange event here
                            console.log(newValue);
                        }}
                        placeholder="Seleccione..."
                    />
                )}
            </Field>
        );
    };

    const ListaAnfitriones = () => {
        const [selectedStudent, setSelectedStudent] = useState<PropsValue<Estudiantes>>([]);
        return (
            <Field
                aria-required={true}
                name="listaAnfitriones"
                defaultValue={correoElectronico}
                label="Anfitrión/a de la reunión"
                isRequired
            >
                {({ fieldProps, error, valid }) =>
                (

                    <Select
                        {...fieldProps}
                        // isMulti -> solamente se puede un anfitrion
                        // defaultValue={[{ value: estudiantesEnProyecto[1].email, label: estudiantesEnProyecto[1].email, email: estudiantesEnProyecto[1].email }]}
                        options={estudiantesEnProyecto.map((estudiante) => ({ value: estudiante.email, label: estudiante.email, email: estudiante.email }))}
                        value={selectedAnfitriones}
                        onChange={(newValue: PropsValue<Estudiantes>, actionMeta: ActionMeta<Estudiantes>) => {
                            setSelectedStudent(newValue);
                            setSelectedAnfitriones(newValue)
                            // Handle the onChange event here
                            console.log(newValue);
                        }}
                        placeholder="Seleccione..."
                    />
                )}
            </Field>
        );
    };

    const Secretario = () => {
        const [selectedStudent, setSelectedStudent] = useState<PropsValue<Estudiantes>>([]);
        return (
            <Field
                aria-required={true}
                name="secretario"
                defaultValue=""
                label="Secretario/a de la reunión"
                isRequired
            >
                {({ fieldProps, error, valid }) =>
                (

                    <Select
                        {...fieldProps}
                        // isMulti
                        options={estudiantesEnProyecto.map((estudiante) => ({ value: estudiante.email, label: estudiante.email, email: estudiante.email }))}
                        value={selectedSecretario}
                        onChange={(newValue: PropsValue<Estudiantes>, actionMeta: ActionMeta<Estudiantes>) => {
                            setSelectedStudent(newValue);
                            setSelectedSecretario(newValue)
                            // Handle the onChange event here
                            console.log(newValue);
                        }}
                        placeholder="Seleccione..."
                    />
                )}
            </Field>
        );
    };


    const Temas = () => (
        <Field
            aria-required={true}
            name="temas"
            defaultValue=""
            label="Tema que se abordará en la reunión"
            isRequired
        >
            {({ fieldProps, error, valid }) => <TextField {...fieldProps} />}
        </Field>
    );

    const Enlaces = () => (
        <Field
            aria-required={true}
            name="enlaces"
            defaultValue=""
            label="Enlace para compartir con los participantes"
        >
            {({ fieldProps, error, valid }) => <TextField {...fieldProps} />}
        </Field>
    );

    const DescripcionEnlaces = () => (
        <Field
            aria-required={true}
            name="descripcionEnlaces"
            defaultValue=""
            label="Descripción del enlace"
        >
            {/* {({ fieldProps, error, valid }) => <TextField {...fieldProps} />} */}
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
    );

    //emails de usuarios externos... -> considerar solo a miembros que estan en la plataforma pero que no son parte del proyecto -> ESTO AUN NO SE CONSIDERA

    //**********************************************************************
    //**********************************************************************
    //**********************************************************************

    // Para modal dialog para "Temas" -> añadir tema
    const [isOpenTemas, setIsOpenTemas] = useState(false);
    const openModalTemas = useCallback(() => setIsOpenTemas(true), []);
    const closeModalTemas = useCallback(() => setIsOpenTemas(false), []);

    // Para modal dialog para "Temas" -> borrar tema
    const [isOpenTemasBorrar, setIsOpenTemasBorrar] = useState(false);
    const openModalTemasBorrar = useCallback(() => setIsOpenTemasBorrar(true), []);
    const closeModalTemasBorrar = useCallback(() => setIsOpenTemasBorrar(false), []);

    // Para modal dialog para "Enlace"
    const [isOpenEnlaces, setIsOpenEnlaces] = useState(false);
    const openModalEnlaces = useCallback(() => setIsOpenEnlaces(true), []);
    const closeModalEnlaces = useCallback(() => setIsOpenEnlaces(false), []);

    // Para modal dialog para "Enlace" -> borrar enlace
    const [isOpenEnlacesBorrar, setIsOpenEnlacesBorrar] = useState(false);
    const openModalEnlacesBorrar = useCallback(() => setIsOpenEnlacesBorrar(true), []);
    const closeModalEnlacesBorrar = useCallback(() => setIsOpenEnlacesBorrar(false), []);


    //**********************************************************************
    //**********************************************************************
    //**********************************************************************

    // Contenido que se muestra 
    return (
        <div>
            {estadoReunion === "Nueva" || estadoReunion === "nueva" || estadoReunion === "New" || estadoReunion === "new" || estadoReunion === "Pre-reunión" || estadoReunion === "pre-reunión" ? (
                <div
                    style={{
                        display: 'flex',
                        // width: '400px',
                        // maxWidth: '100%',
                        margin: '0 auto',
                        marginLeft: '15px',
                        marginRight: '15px',
                        marginBottom: '30px',
                        flexDirection: 'column',
                        // alignItems: 'center',
                        // justifyContent: 'center',
                    }}
                >
                    {/* Se comenta debido a solicitud de profesor guia: No es necesario mostrar el titulo de la seccion considerando que se tiene "ProgressTracker"*/}
                    {/* <h1 style={{ textAlign: 'center', fontSize: '60px' }}>Pre-reunión</h1> */}
                    {/* <h3 style={{ textAlign: 'center', marginLeft: '20px', marginRight: '20px'}}>Importante: Si recarga la página o la abandona, se perderá la información previamente ingresada en el formulario, por lo que deberá comenzar nuevamente. Los datos serán guardados una vez se presione el botón "Finalizar Pre-reunión"</h3> */}
                    <Tooltip
                        component={InlineDialog}
                        // informacion del proyecto
                        content={() =>
                            <>
                                <p style={{ textAlign: 'center', marginLeft: '20px', marginRight: '20px' }}>Si recarga la página o la abandona, se perderá la información previamente ingresada en el formulario, por lo que deberá comenzar nuevamente. Los datos serán guardados una vez se presione el botón "Finalizar Pre-reunión"</p>
                            </>
                        }
                    >
                        {(tooltipProps) => (
                            <>
                                <br />
                                {/* <Button iconBefore={<WarningIcon label="" size="large" />} appearance="warning" style={{ height: "100%", width: "170px" }} {...tooltipProps}> IMPORTANTE </Button> */}
                                {/* <ProgressTracker items={items} /> */}
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
                                                                {isOpen ? '' : ''} <p style={{marginTop:3, marginBottom:0}}>chat</p>{' '}
                                                            </Button>
                                                        )}
                                                    />
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

                                        {/* CONTENIDO DE LA DERECHA: no utilizada en esta fase*/}
                                        <div style={{textAlign: "left", height: '100px', width: '550px', backgroundColor: 'white'}}>
                                            <Button iconBefore={<WarningIcon label="" size="large" />} appearance="warning" style={{width: "170px", marginTop:'30px' }} {...tooltipProps}> IMPORTANTE </Button>
                                        </div>
                                    </Inline>
                                </div> 

                            </>
                        )}
                    </Tooltip>

                    {/* <ProgressTracker items={items} /> */}

                    {/* ACTUALIZACION: ESTO YA NO ES ASI Y CUALQUIER USUARIO PUEDE COMPLETAR EL FORMULARIO DE PRE-REUNION */}
                    {/* OJO: Solo los usuarios de tipo "profesor" pueden interactuar con la etapa de "pre-reunion". Esto debido a que se hace uso de elementos que solo dichos usuarios tienen*/}
                    {/* {tipoDeUsuario === "profesor" || tipoDeUsuario === "Profesor" ? ( */}
                        <>
                            {/* FORMULARIO PRIMERA PARTE */}
                            <Form<{ username: string }>
                                onSubmit={(data) => {
                                    // console.log('form data', data);
                                    return new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>
                                        data.username === 'error' ? { username: 'IN_USE' } : undefined,
                                    );
                                }}
                            >
                                {({ formProps, submitting }) => (
                                    <form {...formProps}>
                                        <br/>
                                        <br/>
                                        <br/>
                                        <br/>
                                        <br/>
                                        <br/>
                                        <Inline space="space.500" alignInline="center" shouldWrap>
                                            <FechaInicio/>
                                            <FechaTermino/>
                                        </Inline>
                                        <br/>
                                        <Objetivo/>
                                        <br/>
                                        <Lugar/>
                                        <br/>
                                        <ListaParticipantes/>
                                        <br/>
                                        <ListaAnfitriones/>
                                        <br/>
                                        <Secretario/>
                                        <br/>
                                        <ListaParticipantesNoProyecto/>

                                        <FormFooter>
                                            <ButtonGroup>
                                                <Button
                                                    type="submit"
                                                    appearance="primary"
                                                    onClick={() => guardarFormulario1()}
                                                    // style={{ marginLeft: '5px' }}
                                                >
                                                    Confirmar datos
                                                </Button>
                                            </ButtonGroup>
                                        </FormFooter>
                                    </form>
                                )}
                            </Form>

                            {!iniciarFormulario && <>
                                <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br /></>}

                            {/* me aseguro que el usuario presione el boton antes de continuar */}
                            {iniciarFormulario ? (
                                <>
                                    <div>
                                        <br />
                                        <hr></hr>
                                    </div>

                                    <Inline space="space.200">
                                        <h2>Temas: </h2> 
                                        {/* 19.920px */}
                                        <div style={{ marginTop: '17px' }}>
                                            <Button iconBefore={<AddIcon label="" size="medium" />} type="submit" appearance="subtle" onClick={() => openModalTemas()}></Button>
                                        </div>
                                    </Inline>
                                    {/* FORMULARIO SEGUNDA PARTE: añadir los temas que se abordaran en la reunion */}
                                    <div>
                                        {listaTemas.map((tema, index) => (
                                            <h3 style={{marginLeft:'20px'}} key={index}> {index + 1}. {tema}</h3>
                                        ))}
                                    </div>
                                    <FormFooter>
                                        <Inline space="space.200" shouldWrap>
                                            {/* <Button appearance="danger" onClick={() => borrarUltimoTema()}>Borrar último tema</Button> */}
                                            <Button iconBefore={<TrashIcon label="" size="medium" />} appearance="danger" onClick={() => openModalTemasBorrar()}>Borrar último tema</Button>
                                            {/* <Button onClick={() => verTemasActuales()}>Ver temas añadidos</Button> */}
                                            <Button iconBefore={<AddIcon label="" size="medium" />} type="submit" appearance="primary" onClick={() => openModalTemas()}> Añadir tema </Button>
                                        </Inline>
                                    </FormFooter>
                                    <div>
                                        <br />
                                        <hr></hr>
                                    </div>


                                    <Inline space="space.200" shouldWrap>
                                        <h2>Enlaces: </h2>
                                        <div style={{ marginTop: '17px' }}>
                                        <Button iconBefore={<AddIcon label="" size="medium" />} type="submit" appearance="subtle" onClick={() => openModalEnlaces()}></Button>
                                        </div>
                                    </Inline>
                                    {/* FORMULARIO TERCERA PARTE: añadir links que se compartiran con los participantes de la reunion */}
                                    <div>
                                        {listaEnlaces.map((enlace, index) => (
                                            <h3 style={{marginLeft:'20px'}} key={index}> {index + 1}. {enlace}</h3>
                                        ))}
                                    </div>
                                    <FormFooter>
                                        <Inline space="space.200" shouldWrap>
                                            {/* <Button appearance="danger" onClick={() => borrarUltimoTema()}>Borrar último tema</Button> */}
                                            <Button iconBefore={<TrashIcon label="" size="medium" />} appearance="danger" onClick={() => openModalEnlacesBorrar()}>Borrar último enlace</Button>
                                            {/* <Button onClick={() => verTemasActuales()}>Ver temas añadidos</Button> */}
                                            <Button iconBefore={<AddIcon label="" size="medium" />} type="submit" appearance="primary" onClick={() => openModalEnlaces()}> Añadir enlace </Button>
                                        </Inline>
                                    </FormFooter>


                                    {/* Boton para finalizar el formulario (realizar la peticion al backend) */}
                                    <div>
                                        <br />
                                        <hr />
                                        <br />
                                    </div>

                                    <ButtonGroup>
                                        <Inline space="space.200" alignInline="center">
                                            <Button onClick={() => cancelarOperacion()} style={{ marginTop: '20px', marginBottom: '20px' }}>Cancelar</Button>
                                            <Button appearance="primary" onClick={() => {
                                                guardarFormularioFinal();
                                            }}
                                                style={{ marginTop: '20px', marginBottom: '20px' }}>
                                                Finalizar Pre-reunión
                                            </Button>
                                        </Inline>
                                    </ButtonGroup>

                                </>
                            ) : (
                                <>
                                </>
                            )}
                        </>
                    {/* ACTUALIZACION: YA NO APLICA ESTE CASO PORQUE CUALQUIER USUARIO PUEDE COMPLETAR EL FORMULARIO */}
                    {/* //     // Caso el usuario que ingresa es de tipo estudiante
                    // ) : (
                    //     <h1 style={{ textAlign: "center" }}>Solamente un usuario "profesor/a" puede ingresar a la fase "pre-reunión"</h1>
                    // )} */}

                </div>
            ) : (
                <FormularioEnReunion />
            )}


            {/* ********************************************************************************************************************************************************** */}
            {/* ******************************************************************** Modal dialog de TEMA ************************************************************* */}
            {/* ********************************************************************************************************************************************************** */}
            <ModalTransition>
                {isOpenTemas && (
                    <Modal onClose={closeModalTemas} shouldScrollInViewport>

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
                                        <ModalTitle>Añadir Tema</ModalTitle>
                                    </ModalHeader>
                                    <ModalBody>
                                        <Temas />
                                    </ModalBody>

                                    <ModalFooter>
                                        <Button appearance="subtle" onClick={closeModalTemas}>
                                            Cancelar
                                        </Button>
                                        <Button appearance="primary" onClick={() => guardarFormulario2()} type="submit">
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
            {/* ******************************************************************** Modal dialog de TEMA: borrar ************************************************************* */}
            {/* ********************************************************************************************************************************************************** */}
            <ModalTransition>
                {isOpenTemasBorrar && (
                    <Modal onClose={closeModalTemasBorrar} shouldScrollInViewport>

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
                                        <ModalTitle appearance="warning">Borrar último tema</ModalTitle>
                                    </ModalHeader>
                                    <ModalBody>
                                        ¿Esta seguro de querer borrar el último tema agregado?
                                    </ModalBody>

                                    <ModalFooter>
                                        <Button appearance="subtle" onClick={closeModalTemasBorrar}>
                                            Cancelar
                                        </Button>
                                        <Button appearance="warning" onClick={() => borrarUltimoTema()} type="submit">
                                            Borrar
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
            {/* ******************************************************************** Modal dialog de Enlaces ************************************************************* */}
            {/* ********************************************************************************************************************************************************** */}
            <ModalTransition>
                {isOpenEnlaces && (
                    <Modal onClose={closeModalEnlaces} shouldScrollInViewport>

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
                                        <ModalTitle>Añadir Enlace</ModalTitle>
                                    </ModalHeader>

                                    <ModalBody>
                                        <Enlaces />
                                        <DescripcionEnlaces />
                                    </ModalBody>

                                    <ModalFooter>
                                        <Button appearance="subtle" onClick={closeModalEnlaces}>
                                            Cancelar
                                        </Button>
                                        <Button appearance="primary" onClick={() => guardarFormulario3()} type="submit">
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
            {/* ******************************************************************** Modal dialog de Enlaces: borrar un enlace******************************************** */}
            {/* ********************************************************************************************************************************************************** */}
            <ModalTransition>
                {isOpenEnlacesBorrar && (
                    <Modal onClose={closeModalEnlacesBorrar} shouldScrollInViewport>

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
                                        <ModalTitle appearance="warning">Eliminar enlace</ModalTitle>
                                    </ModalHeader>

                                    <ModalBody>
                                        ¿Esta seguro de querer borrar el último enlace agregado?
                                    </ModalBody>

                                    <ModalFooter>
                                        <Button appearance="subtle" onClick={closeModalEnlacesBorrar}>
                                            Cancelar
                                        </Button>
                                        <Button appearance="warning" onClick={() => borrarUltimoEnlace()} type="submit">
                                            Borrar
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


        </div>



    );
};

export default FormularioPreReunion;