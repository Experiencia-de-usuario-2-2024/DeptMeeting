import React, { Fragment, useEffect, useState, useCallback } from "react";
import { Inline, Stack } from '@atlaskit/primitives';
import Form, { ErrorMessage, Field, FormFooter } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import { DatePicker, DateTimePicker } from '@atlaskit/datetime-picker';
import Button, { ButtonGroup } from '@atlaskit/button';
import LoadingButton from '@atlaskit/button/loading-button';
import Select, { ActionMeta, MultiValue, PropsValue } from 'react-select';
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { ProgressTracker, Stages } from '@atlaskit/progress-tracker';
import { CreatableSelect, OptionType, ValueType } from '@atlaskit/select';
import { Box, xcss } from '@atlaskit/primitives';
import EditFilledIcon from '@atlaskit/icon/glyph/edit-filled'
import TextArea from '@atlaskit/textarea';
import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTitle,
    ModalTransition,
} from '@atlaskit/modal-dialog';
import AvatarGroup from '@atlaskit/avatar-group';
import Popup from '@atlaskit/popup';
import CommentIcon from '@atlaskit/icon/glyph/comment';
import InfoIcon from '@atlaskit/icon/glyph/info'
import RecentIcon from '@atlaskit/icon/glyph/recent'
import CalendarIcon from '@atlaskit/icon/glyph/calendar'
import Tooltip, { TooltipPrimitive } from '@atlaskit/tooltip';
import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';

import io, { Socket } from "socket.io-client";

import ActaDialogicaFinal from "./ActaDialogicaFinal";
import MessagesInput from "./MessageInput";
import Messages from "./Messages";


// Se obtiene el token del usuario logeado
const tokenUser = localStorage.getItem('tokenUser');

var numeroTemaSeleccionado: number;

var stringTemaSeleccionado: string;

const boxStyles = xcss({
    borderColor: 'color.border.selected',
    // width: '500px',
    backgroundColor: 'color.background.selected',
    borderStyle: 'solid',
    borderRadius: 'border.radius',
    borderWidth: 'border.width',
});

const boxStyles2 = xcss({
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

const InlineDialog = styled(TooltipPrimitive)({
    background: 'white',
    width: '1000px',
    borderRadius: token('border.radius', '4px'),
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
    boxSizing: 'content-box',
    padding: `${token('space.100', '8px')} ${token('space.150', '12px')}`,
});


var idReunionAux: string;
var idProyectoAux: string;
var numeroReunion: number;

var nombreCortoProyectoAux: string = "";

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
        percentageComplete: 100,
        status: 'disabled',
        href: '#',
    },
    {
        id: 'post-reunion',
        label: 'Post-reunión',
        percentageComplete: 0,
        status: 'current',
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

var listaMiembrosOriginal: string[] = [];

var estadoReunion: string;

const FormularioPostReunion: React.FC = () => {

    // para el popup de la informacion de la reunion
    const [isOpenInformacion, setIsOpenInformacion] = useState(false)

    // Interfaz para ver los datos de un acta dialogica (meetingminute)
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
        nombreCortoProyecto: string;
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


    // Para determinar si se muestra en la parte central el acta dialogica o no (en cualquiera que sea su etapa, pre, in, post o finalizada)
    const [verActaDialogica, setVerActaDialogica] = React.useState(false);

    // para guardar los datos del acta dialogica (meetingminute)
    const [meetingminute, setMeetingMinute] = React.useState<MeetingMinute>();

    // Estado para tener la informacion del usuario logeado
    const [usuarioPerfilLog, setusuarioPerfilLog] = React.useState<Usuario>();

    const [usuarioInvitado, setusuarioInvitado] = React.useState<EstudiantesInvitados>();
    var nombreCortoProyectoUsuarioInvitado: string;

    // para guardar los datos de la reunion
    const [reunion, setReunion] = React.useState<Reunion>();
    // para guardar datos del proyecto
    const [proyectoUser, setProyectsUser] = React.useState<ProyectoUser>();

    // para saber los participantes que estan en la reunion (room)
    const [listaParticipantes, setListaParticipantes] = React.useState<Usuario[]>([]);
    var listaParticipantesAux: Usuario[] = [];

    // para guardar todos los compromisos del proyecto (despues de haber pasado todos los filtros)
    const [compromisosProyecto, setcompromisosProyecto] = React.useState<Compromiso[]>();

    // para mantener una lista de participantes conectados a la reunion
    const agregarParticipante = (participante: Usuario) => {
        setListaParticipantes(listaParticipantes => {
            if (!listaParticipantes.find(p => p.email === participante.email)) {
                listaParticipantesAux = [...listaParticipantes, participante];
                return [...listaParticipantes, participante];
            }
            return listaParticipantes;
        });
    }

    // para el popup
    const [isOpen, setIsOpen] = useState(false)

    // websocket
    const [socket, setSocket] = useState<Socket>();

    // par el envio de mensajes mediante websockets
    const [messages, setMessages] = useState<string[]>([]);

    // funciona separando el chat en salas
    const send = (value: string) => {
        const decodedToken: any = tokenUser ? jwtDecode(tokenUser) : null;
        var correoElectronico = decodedToken.email;
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

    useEffect(() => {
        // websocket
        const newSocket = io(`${process.env.REACT_APP_BACKEND_IO}`);
        setSocket(newSocket);

        // escuchar al evento de recarga de pagina
        newSocket.on('new_reload', () => {
            window.location.reload();
        });

        // escuchar al evento de cambiar de fase
        newSocket.on('new_reload_ver3', () => {
            localStorage.setItem('estadoReunion', "Finalizada");
            localStorage.setItem('iniciarReunion', JSON.stringify(false));
            window.location.reload();
        });

        // escucar al evento de notificar a los participantes que un usuario esta editando
        newSocket.on('new_notificar_participante_editando', (payload: any) => {
            const decodedToken: any = tokenUser ? jwtDecode(tokenUser) : null;
            const correoElectronico = decodedToken.email;
            if (correoElectronico !== payload.user) {
                window.alert("El participante " + payload.user + " esta editando el tema n°" + payload.tema);
            }
        });

        // CAMBIAR DE NOMBRE A LOS EVENTOS PARA QUE NO HAGA CONFLICTO CON LOS EVENTOS DE LA FASE ANTERIOR
        // // Identificar al nuevo usuario conectado
        newSocket.on('new_user', (payload) => {
            agregarParticipante(payload);
            newSocket.emit('event_lista_participantes_ver2', { room: localStorage.getItem('idMeetingMinute'), lista: listaParticipantesAux });
        });

        // Recoger la lista de participantes
        newSocket.on('new_lista_participantes_ver2', (payload: any[]) => {
            if (payload.length === 1) {
                return;
            }
            console.log("------------- a")
            payload.forEach((participant: any) => {
                console.log("correo: " + participant.email);
            });
            setListaParticipantes(payload);
            // window.location.reload(); -> si hago esto, se queda en un bucle infinito
        });


        // Obtener los datos del usuario logeado
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
                setusuarioPerfilLog(response.data);
                newSocket.emit('event_join', { room: localStorage.getItem('idMeetingMinute'), user: response.data });
                if (response.data.type === "estudiante") {
                    localStorage.setItem('idPerfil', response.data._id);
                    // setVerPerfil(true);
                }

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
        const storedValue = localStorage.getItem('verActaDialogica');
        if (storedValue) {
            const parsedValue = JSON.parse(storedValue);
            setVerActaDialogica(parsedValue);
        }

        estadoReunion = localStorage.getItem('estadoReunion') ?? '';
        // Se obtienen los datos del acta dialogica (meetingminute) a partir de su id que esta almacenado en local storage
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
                // cuarto filtro, que dateLimit sea menor a la fecha actual, de tal forma obtener los compromisos atrados -> ya no se realiza porque importan los compromisos previos que estan en desarrollo
                // filteredData = filteredData.filter((item: Compromiso) => new Date(item.dateLimit) < new Date());
                // Se añade filteredData a "setcompromisosProyecto"
                // quinto filtro (se añade mas abajo, antes de mostrar los compromisos, pero se requiere aqui): los compromisos solo pueden ser de reuniones previas a la actual
                filteredData = filteredData.filter((item: Compromiso) => item.number < numeroReunion);
                setcompromisosProyecto(compromisosProyecto => [...(compromisosProyecto || []), ...filteredData]);
            } catch (error) {
                console.error(error);
            }
        }



        async function obtenerMeetingMinutePorId() {
            // window.alert("id de la minuta DENTRO DE LA FUNCION: " + idMeetingMinute);
            try {
                // Solo se requiere del token del usuario para realizar la petición
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_GATEWAY}/api/meeting-minute/` + localStorage.getItem('idMeetingMinute'), {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("INFORMACION DEL ACTA DIALOGICA ******** post reunion *****");
                console.log(response.data);
                setMeetingMinute(response.data[0]);
                nombreCortoProyectoAux = response.data[0].nombreCortoProyecto;
                idReunionAux = response.data[0].meeting;
                numeroReunion = response.data[0].number;
                // se recorre la lista de participantes de la reunion para obtener los compromisos de cada uno utilizando la funcion "obtenerCompromisosUsuario"
                response.data[0].participants.forEach((participante: string) => {
                    obtenerCompromisosUsuario(participante);
                });

                // localStorage.setItem('idReunion', response.data[0].meeting);
            } catch (error) {
                console.log("ERROR AL OBTENER LA INFORMACION DEL ACTA DIALOGICA ******** post reunion *****");
                console.error(error);
            }
        }
        // obtenerMeetingMinutePorId();
        // obtenerDatosUsuarioLog();

        // Obtener datos de la reunion a partir del id
        // const idReunion = localStorage.getItem('idReunion') ?? ''; // id de la reunion traido desde local storage -> ya no se obtiene de local storage, se obtiene a partir de la minuta
        async function datosReunion() {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_GATEWAY}/api/meeting/` + localStorage.getItem('idReunion'), {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Datos de la reunión ******** post reunion *****");
                console.log(response.data);
                setReunion(response.data);
                idProyectoAux = response.data.project[0];
                // localStorage.setItem('idProyecto', response.data.project[0]);
            } catch (error) {
                console.error(error);
            }
        }
        // datosReunion();

        // obtener proyecto del usuario por id
        async function obtenerProyectoPorId() {
            try {
                // Solo se requiere del token del usuario para realizar la petición
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_GATEWAY}/api/project/getProjectbyID/` + localStorage.getItem('idProyecto'), {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });

                setProyectsUser(response.data);
                console.log(response.data);
                listaMiembrosOriginal = response.data.userMembersOriginal;

            } catch (error) {
                console.error(error);
            }
        }

        const fetchData = async () => {
            await obtenerMeetingMinutePorId();
            await datosReunion();
            await obtenerProyectoPorId();
        };

        fetchData();



    }, []);


    // Entrada: ninguna
    // Salida: ninguna
    // Funcion: cambia el valor de la variable verActaDialogica, de tal forma se abandona la ventana de acta dialogica (se deja de ver)
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

    // Entrada: ninguna
    // Salida: ninguna
    // Funcion: cambiar el estado de la reunion a "Finalizada"
    const guardarFormularioFinal = () => {
        // paso 1: revisar que los campos esten completos -> no se requiere de hacer esto porque si se decide editar un tema se realiza la comprobacion

        // Se le pregunta al usuario si esta seguro de finalizar la revision de la reunion
        var respuesta = window.confirm("¿Está seguro de finalizar la revisión de la reunión? Finalizada la etapa de post-reunión no podrá volver a editar la información.");
        if (!respuesta) {
            window.alert("Operación cancelada: la revisión de la reunión no ha sido finalizada");
            return;
        }
        // window.alert("Revisión de la reunión finalizada exitosamente");

        // paso 2.1: realizar peticion para cambiar el estado de la reunion
        const idReunion = localStorage.getItem('idReunion') ?? ''; // id de la reunion traido desde local storage
        async function cambiarEstadoEnReunion() {
            try {
                const response = await axios.put(`${process.env.REACT_APP_BACKEND_GATEWAY}/api/meeting/` + idReunion, {
                    state: "Finalizada"
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

        // paso 2.2: realizar la peticion para actualizar el acta dialogica (esto con el contenido capturado en la reunion) -> NO ES NECESARIO PORQUE SE ACTUALIZA CUANDO SE EDITA UN TEMA

        // paso 2.2 actualizar los atributos de los participantes de la reunion
        async function ActualizarParticipantes(correoEstudiante: string, idActa: string, estadoReu: string) {
            try {
                const response = await axios.put(`${process.env.REACT_APP_BACKEND_GATEWAY}/api/user/update/` + correoEstudiante + '/usuarioperfil', {
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

        
        // se recorre la lista de participantes, de tal forma actualizar todos
        meetingminute?.participants.forEach((participante: string) => {
            obtenerDatosUsuarioInvitado(participante).then(() => {
                if (nombreCortoProyectoAux === nombreCortoProyectoUsuarioInvitado) {
                    ActualizarParticipantes(participante, localStorage.getItem('idMeetingMinute') ?? '', "Finalizada");
                }
            });
        });

        // FORMA ANTIGUA DE HACCERLO, se actualizan todos los participantes de la rueion, sin importar si pertenecen o no al proyecto
        // meetingminute?.participants.forEach((participante: string) => {
        //     // POSIBILIDAD DE MEJORA: si el participante acude a una reunion que no es de su proyecto, no se le actualiza el atributo "currentMeetingId"
        //     ActualizarParticipantes(participante, localStorage.getItem('idMeetingMinute') ?? '', "Finalizada");
        // });

        // paso 3: cambiar valores de variable almancenada en local storage para ir a la siguiente etapa (en-reunion)
        localStorage.setItem('estadoReunion', "Finalizada");

        // se actualiza el proyecto, eliminando a aquellos invitados a la reunion que no pertenecen al proyecto
        async function ActualizarProyecto(idProyecto: string) {
            try {
                const response = await axios.put(`${process.env.REACT_APP_BACKEND_GATEWAY}/api/project/` + idProyecto, {
                    userMembers: listaMiembrosOriginal
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
        ActualizarProyecto(localStorage.getItem('idProyecto') ?? '');

        // se envia correo a los participantes de la reunion, indicandoles que la reunion se archivara
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
                        fase: "finalizada",
                        nombreCortoProyecto: meetingminute?.nombreCortoProyecto
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

        // window.alert("ESPERANDO A LOS RESULTADOS DE LA CONSOLA");
        window.alert("Revisión de la reunión finalizada exitosamente");

        // websocket
        // paso final: recargar la pagina para todos los usuarios conectados a la sala utilizando websockets
        // const idMeetingMinute = localStorage.getItem('idMeetingMinute');
        const decodedToken: any = tokenUser ? jwtDecode(tokenUser) : null;
        const correoElectronico = decodedToken.email;
        const payload = {
            room: localStorage.getItem('idMeetingMinute'),
            user: correoElectronico,
        };
        socket?.emit('event_reload_ver3', payload);

        // paso 4: recargar pagina -> comentado debido a que esto se realiza mediante websockets
        // window.location.reload();
    }

    // Funcion encargada de emitir una alerta mediante websockets a los participantes de la reunion, de tal forma todos sepan que participante esta editando
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
        socket?.emit('event_notificar_participante_editando', payload);
    }

    // **************************************************************************************************************************************************************************************** //
    // ****************************************************** Variables utilizadas para los dialogos modales  ********************************************************************************* //
    // **************************************************************************************************************************************************************************************** //

    // Para modal dialog para "editar tema"
    const [isOpenEditarTema, setIsOpenEditarTema] = useState(false);
    const openModalEditarTema = useCallback(() => setIsOpenEditarTema(true), []);
    const closeModalEditarTema = useCallback(() => setIsOpenEditarTema(false), []);

    // Para modal dialog que muestra la informacion de la ruenion
    const [isOpenInfoReu, setIsOpenInfoReu] = useState(false);
    const openModalInfoReu = useCallback(() => setIsOpenInfoReu(true), []);
    const closeModalInfoReu = useCallback(() => setIsOpenInfoReu(false), []);

    // **************************************************************************************************************************************************************************************** //
    // **************************************************************************************************************************************************************************************** //
    // **************************************************************************************************************************************************************************************** //

    const actualizarTema = () => {
        // paso 1: capturar el valor del campo de texto
        var editarTemaValue = (document.getElementsByName("editarTema")[0] as HTMLInputElement).value;

        // paso 2: revisar que el campo no este vacio
        if (editarTemaValue === "" || editarTemaValue === " ") {
            window.alert("El campo no puede estar vacio");
            return;
        }

        // window.alert("Numero de tema a editar: " + numeroTemaSeleccionado + "\nTema editado: \n" + editarTemaValue);

        // paso 3: consultar al usuario si esta seguro de realizar los cambios
        var confirmacion = window.confirm("¿Esta seguro de realizar los cambios?");
        if (confirmacion == false) {
            window.alert("Operación cancelada: los cambios no se han realizado");
            return;
        }

        // paso 3.1: actualizar el tema para posteriormente realizar la peticion
        // lista de string que contendra los temas originales y el actualizado
        var listaTemas: string[] = [];
        // se iguala la lista de temas con la lista de temas original
        listaTemas = meetingminute?.topics ?? [];
        // ahora se cambia el tema seleccionado por el nuevo tema
        listaTemas[numeroTemaSeleccionado - 1] = editarTemaValue;

        // paso 4: realizar la peticion al backend para actualizar la lista de temas
        const idMeetingMinute = localStorage.getItem('idMeetingMinute');
        async function actualizarTemaEnMeetingMinute() {
            try {
                const response = await axios.put(`${process.env.REACT_APP_BACKEND_GATEWAY}/api/meeting-minute/` + idMeetingMinute, {
                    topics: listaTemas
                }, {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Tema actualizado exitosamente");
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        actualizarTemaEnMeetingMinute();

        // avisar al usuario del exito de la operacion
        window.alert("Cambios realizados exitosamente");

        // websocket
        // paso final: recargar la pagina para todos los usuarios conectados a la sala utilizando websockets
        // const idMeetingMinute = localStorage.getItem('idMeetingMinute');
        const decodedToken: any = tokenUser ? jwtDecode(tokenUser) : null;
        const correoElectronico = decodedToken.email;
        const payload = {
            room: idMeetingMinute,
            user: correoElectronico,
        };
        socket?.emit('event_reload', payload);

        // paso 5: cerrar el dialogo modal -> revisar si no es necesario recargar la pagina
        closeModalEditarTema();
    }



    // Contenido que se muestra 
    return (
        <div>
            {estadoReunion === "Post-reunión" || estadoReunion === "post-reunión" ? (
                <>
                    {/* PARTE FIJA DEL MICROFRONTEND: AVATAR GROUP, CHAT y BARRA DE PROGRESO DE LA REUNION */}
                    <div style={{ position: "fixed", top: 96, width: "100%", zIndex: 10 }}>
                        <Inline>
                            {/* CONTENIDO DE LA IZQUIERDA: fotos de los participantes de la reunion y boton que da acceso al chat */}
                            {/* <div style={{textAlign: "left", height: '100px', width: '450px', backgroundColor: 'white'}}> */}
                            <div style={{ textAlign: "left", height: '100px', width: '550px', backgroundColor: 'white' }}>
                                <Inline space="space.200">
                                    {/* fotos de los integrantes conectados */}
                                    <div style={{ marginTop: '28px' }}>
                                        <AvatarGroup appearance="stack" data={data} borderColor="#388BFF" size="large" maxCount={4} />
                                    </div>

                                    {/* popup para colocar un chat en la reunion */}
                                    <div style={{ marginTop: '28px' }}>
                                        <Popup
                                            isOpen={isOpen}
                                            onClose={() => setIsOpen(false)}
                                            placement="bottom-start"

                                            // aqui colocar el componente del chat
                                            content={() => <Box xcss={contentStyles}>
                                                <MessagesInput send={send} />
                                                <Messages messages={messages} />
                                            </Box>}

                                            trigger={(triggerProps) => (
                                                <Button
                                                    style={{ height: 44 }}
                                                    iconBefore={<CommentIcon label="" size="medium" />}
                                                    {...triggerProps}
                                                    appearance="primary"
                                                    isSelected={isOpen}
                                                    onClick={() => setIsOpen(!isOpen)}
                                                >
                                                    {/* {isOpen ? 'Cerrar' : 'Abrir'} chat{' '} */}
                                                    {isOpen ? '' : ''} <p style={{ marginTop: 3, marginBottom: 0 }}>chat</p>{' '}
                                                </Button>
                                            )}
                                        />
                                        {/* IMPLEMENTACION DEL CHAT COMO UN DIALOGO MODAL, NO SE USARA */}
                                        {/* <Button appearance="primary" onClick={() => {openModalChat()}}>ABRIR CHAT</Button> */}
                                    </div>
                                </Inline>
                            </div>

                            {/* CONTENIDO DEL MEDIO: barra de progreso */}
                            <div style={{ textAlign: "center", height: '100px', width: '60%', backgroundColor: 'white' }}>
                                {/* barra de progreso en la renuion fija en pantalla*/}
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <ProgressTracker items={items} />
                                </div>
                            </div>

                            {/* CONTENIDO DE LA DERECHA: informacion sobre el llamado de la reunion*/}
                            <div style={{ textAlign: "left", height: '100px', width: '550px', backgroundColor: 'white' }}>
                                <Inline space="space.100">
                                    <div style={{ marginTop: '22px' }}><RecentIcon label="" size="medium" /></div>
                                    {/* <h4 style={{ marginTop: "24px"}}>Llamado: &#60;{new Date(meetingminute?.startTime ?? "").toLocaleDateString("es-CL")} {meetingminute?.startHour.split("-")[0]}&#62; &#60;{new Date(meetingminute?.endTime ?? "").toLocaleDateString("es-CL")} {meetingminute?.endHour.split("-")[0]}&#62;</h4> */}
                                    {/* DE ESTA FORMA, SE RESTABA UN DIA A LO QUE ESTABA GUARDADO EN LA BASE DE DATOS */}
                                    {/* <h4 style={{ marginTop: "24px" }}>Llamado: &#60;{new Date(meetingminute?.startTime ?? "").toLocaleDateString("es-CL")} {meetingminute?.startHour[0]}{meetingminute?.startHour[1]}{meetingminute?.startHour[2]}{meetingminute?.startHour[3]}{meetingminute?.startHour[4]}&#62; &#60;{new Date(meetingminute?.endTime ?? "").toLocaleDateString("es-CL")} {meetingminute?.endHour[0]}{meetingminute?.startHour[1]}{meetingminute?.startHour[2]}{meetingminute?.startHour[3]}{meetingminute?.startHour[4]}&#62;</h4> */}
                                    <h4 style={{ marginTop: "24px" }}>Llamado: &#60;{meetingminute?.startTime[8]}{meetingminute?.startTime[9]}{meetingminute?.startTime[7]}{meetingminute?.startTime[5]}{meetingminute?.startTime[6]}{meetingminute?.startTime[4]}{meetingminute?.startTime[0]}{meetingminute?.startTime[1]}{meetingminute?.startTime[2]}{meetingminute?.startTime[3]} {meetingminute?.startHour[0]}{meetingminute?.startHour[1]}{meetingminute?.startHour[2]}{meetingminute?.startHour[3]}{meetingminute?.startHour[4]}&#62; &#60;{meetingminute?.endTime[8]}{meetingminute?.endTime[9]}{meetingminute?.endTime[7]}{meetingminute?.endTime[5]}{meetingminute?.endTime[6]}{meetingminute?.endTime[4]}{meetingminute?.endTime[0]}{meetingminute?.endTime[1]}{meetingminute?.endTime[2]}{meetingminute?.endTime[3]} {meetingminute?.endHour[0]}{meetingminute?.endHour[1]}{meetingminute?.endHour[2]}{meetingminute?.endHour[3]}{meetingminute?.endHour[4]}&#62;</h4> 
                                </Inline>
                                <Inline space="space.100">
                                    <div style={{}}><CalendarIcon label="" size="medium" /></div>
                                    {/* <h4 style={{margin:0, marginTop: '2px'}}>Real: &#60;{meetingminute?.realStartTime.split(",")[0]} {meetingminute?.realStartTime.split(",")[1].split(":").slice(0, 2).join(":")}&#62; &#60;{meetingminute?.realEndTime.split(",")[0]} {meetingminute?.realEndTime.split(",")[1].split(":").slice(0, 2).join(":")}&#62;</h4> */}
                                    <h4 style={{ margin: 0, marginTop: '2px' }}>Real: &#60;{meetingminute?.realStartTime[0]}{meetingminute?.realStartTime[1]}{meetingminute?.realStartTime[2]}{meetingminute?.realStartTime[3]}{meetingminute?.realStartTime[4]}{meetingminute?.realStartTime[5]}{meetingminute?.realStartTime[6]}{meetingminute?.realStartTime[7]}{meetingminute?.realStartTime[8]}{meetingminute?.realStartTime[9]} {meetingminute?.realStartTime[12]}{meetingminute?.realStartTime[13]}{meetingminute?.realStartTime[14]}{meetingminute?.realStartTime[15]}{meetingminute?.realStartTime[16]}&#62; &#60;{meetingminute?.realEndTime[0]}{meetingminute?.realEndTime[1]}{meetingminute?.realEndTime[2]}{meetingminute?.realEndTime[3]}{meetingminute?.realEndTime[4]}{meetingminute?.realEndTime[5]}{meetingminute?.realEndTime[6]}{meetingminute?.realEndTime[7]}{meetingminute?.realEndTime[8]}{meetingminute?.realEndTime[9]} {meetingminute?.realEndTime[12]}{meetingminute?.realEndTime[13]}{meetingminute?.realEndTime[14]}{meetingminute?.realEndTime[15]}{meetingminute?.realEndTime[16]}&#62;</h4>
                                </Inline>
                            </div>
                        </Inline>
                    </div>
                    <br />
                    <br />
                    <br />

                    {/* RESTO DEL CONTENIDO DEL MICROFRONTEND */}
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
                        {/* <h1 style={{ textAlign: 'center', fontSize: '60px' }}>Post-reunión</h1> */}
                        {/* <h3 style={{ textAlign: 'center', marginLeft: '20px', marginRight: '20px'}}>Importante: Si recarga la página o la abandona, se perderá la información previamente ingresada en el formulario, por lo que deberá comenzar nuevamente. Los datos serán guardados una vez se presione el botón "Finalizar Post-reunión"</h3> */}

                        {/* <ProgressTracker items={items} /> */}
                        <br />



                        {/* <h2>Acta dialogica</h2> */}
                        {/* <h2>Acta dialógica de Proyecto "{proyectoUser?.shortName}" - reunión {reunion?.number}</h2> */}

                        {/* se cambia el popup por un dialogo modal */}
                        <Button
                            style={{ height: '100%', textAlign: 'left', width: '100%' }}
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
                                <h2 style={{ color: 'black' }}>Acta dialógica de Proyecto "{proyectoUser?.shortName}" - reunión {reunion?.number}</h2>
                            ) : (
                                <h2 style={{ color: 'black' }}>Acta dialógica de Proyecto "{nombreCortoProyectoAux}" - reunión {reunion?.number}</h2>
                            )}
                            {/* <h2 style={{ color: 'black'}}>Acta dialógica de Proyecto "{proyectoUser?.shortName}" - reunión {reunion?.number}</h2> */}
                            {' '}
                        </Button>
                        {/* se muestran los compromisos previos */}
                        {compromisosProyecto?.length != 0 && (
                                            <>
                                                <Box padding="space.400" backgroundColor="color.background.discovery" xcss={boxStyles2}>
                                                    <h2 style={{ marginTop: '0px', textAlign: 'center' }}>Estado del proyecto</h2>
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
                                                                                    <h4 key={charIndex} style={{ marginLeft: '30px', marginTop: "5px", marginBottom: "5px" }}>
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
                                                                                    <h4 key={index} style={{ marginLeft: '50px', marginTop: "5px", marginBottom: "5px", color: 'red' }}>{compromiso.number}.{compromiso.position} Descripción: {compromiso.description}</h4>
                                                                                    <h4 key={index} style={{ marginLeft: '50px', marginTop: "0px", marginBottom: "20px", color: 'red' }}>Fecha límite: {new Date(compromiso.dateLimit).toLocaleDateString("es-CL")}</h4>
                                                                                </Stack>
                                                                            </>
                                                                        )}
                                                                        {new Date(compromiso.dateLimit) > new Date() && (
                                                                            <>
                                                                                <Stack>
                                                                                    <h4 key={index} style={{ marginLeft: '50px', marginTop: "5px", marginBottom: "5px", color: 'green' }}>{compromiso.number}.{compromiso.position} Descripción: {compromiso.description}</h4>
                                                                                    <h4 key={index} style={{ marginLeft: '50px', marginTop: "0px", marginBottom: "20px", color: 'green' }}>Fecha límite: {new Date(compromiso.dateLimit).toLocaleDateString("es-CL")}</h4>
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
                                        )}
                        <br />
                        <br />






                        <Box padding="space.400" backgroundColor="color.background.discovery" xcss={boxStyles}>


                            {/* temas */}
                            {/* <h3 style={{ marginTop: "5px", marginBottom: "5px" }}>Temas:</h3>
                                {meetingminute?.topics.map((topic, index) => (
                                    // <h3 key={index}>{topic}</h3>
                                    <h3 key={index} style={{ marginLeft: '30px', marginTop: "5px", marginBottom: "5px" }}>&#8226; {topic}</h3>
                            ))}
                            <br /> */}

                            {meetingminute?.topics.map((topic, index) => (
                                <div key={index}>
                                    <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                                        {/* propiedad "whiteSpace" hace que <h3> reconozca los saltos de linea */}
                                        <h4 id="texto" style={{ marginLeft: '30px', marginTop: "5px", marginBottom: "5px", whiteSpace: 'pre-line' }}>{index + 1}. {topic}</h4>
                                        {/* añadir un boton que diga: "Editar", ASI SE PODRA EDITAR CADA TEMA DE FORMA INDEPENDIENTE */}
                                        <div style={{ textAlign: 'center' }}>
                                            <br />
                                            {/* el boton solo estara disponible si quien lo mira es anfitrion o secretario, debido a que ellos son los unicos que lo pueden editar en esta fase */}
                                            {meetingminute?.leaders.includes(usuarioPerfilLog?.email ?? '') || meetingminute?.secretaries.includes(usuarioPerfilLog?.email ?? '') ? (
                                                <Button iconBefore={<EditFilledIcon label="" size="medium" />} appearance="primary" onClick={() => { openModalEditarTema(); numeroTemaSeleccionado = 0; numeroTemaSeleccionado = index + 1; stringTemaSeleccionado = topic; notificarParticipantes(index + 1) }}>Editar</Button>
                                            ) : (
                                                <Button isDisabled iconBefore={<EditFilledIcon label="" size="medium" />} appearance="primary" onClick={() => { openModalEditarTema(); numeroTemaSeleccionado = 0; numeroTemaSeleccionado = index + 1; stringTemaSeleccionado = topic; notificarParticipantes(index + 1) }}>Editar</Button>
                                            )}
                                            {/* <Button iconBefore={<EditFilledIcon label="" size="medium" />} appearance="primary" onClick={() => {openModalEditarTema(); numeroTemaSeleccionado = 0; numeroTemaSeleccionado = index + 1; stringTemaSeleccionado = topic}}>Editar</Button> */}
                                        </div>
                                        <br />
                                    </div>
                                    <hr />
                                </div>
                            ))}

                        </Box>




                        {meetingminute?.leaders.includes(usuarioPerfilLog?.email ?? '') || meetingminute?.secretaries.includes(usuarioPerfilLog?.email ?? '') ? (
                            <ButtonGroup>
                                <Inline space="space.200" alignInline="center">
                                    <Button onClick={() => cancelarOperacion()} style={{ marginTop: '20px', marginBottom: '20px' }}>Cancelar</Button>
                                    <Button appearance="primary" onClick={() => guardarFormularioFinal()} style={{ marginTop: '20px', marginBottom: '20px' }}>Finalizar Post-reunión</Button>
                                </Inline>
                            </ButtonGroup>
                        ) : (
                            <ButtonGroup>
                                <Inline space="space.200" alignInline="center">
                                    <Button isDisabled onClick={() => cancelarOperacion()} style={{ marginTop: '20px', marginBottom: '20px' }}>Cancelar</Button>
                                    <Button isDisabled appearance="primary" onClick={() => guardarFormularioFinal()} style={{ marginTop: '20px', marginBottom: '20px' }}>Finalizar Post-reunión</Button>
                                </Inline>
                            </ButtonGroup>
                        )}
                    </div>
                </>

            ) : (
                <ActaDialogicaFinal />
            )}

            {/* ********************************************************************************************************************************************************** */}
            {/* ******************************************************************** Modal dialog de editar temas ******************************************************** */}
            {/* ********************************************************************************************************************************************************** */}
            <ModalTransition>
                {isOpenEditarTema && (
                    <Modal onClose={closeModalEditarTema} shouldScrollInViewport>

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
                                        <ModalTitle>Editar tema</ModalTitle>
                                    </ModalHeader>
                                    <ModalBody>

                                        {/* Campo para que escriban el acuerdo */}
                                        <Field
                                            id="editarTema"
                                            name="editarTema"
                                            label="Edite el tema"
                                            isRequired
                                        >
                                            {({ fieldProps }) => (
                                                <Fragment>
                                                    <TextArea
                                                        {...fieldProps}
                                                        defaultValue={stringTemaSeleccionado}
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
                                        <Button appearance="subtle" onClick={closeModalEditarTema}>
                                            Cancelar
                                        </Button>
                                        <Button appearance="primary" onClick={() => actualizarTema()} type="submit">
                                            Guardar
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
                                        <ModalTitle>
                                            <Button appearance="subtle">Informacion de la reunión</Button>
                                        </ModalTitle>
                                    </ModalHeader>
                                    <ModalBody>
                                        <Box padding="space.400" backgroundColor="color.background.discovery" xcss={boxStyles}>
                                            <h2 style={{ marginTop: '0px', textAlign: 'center' }}>Descripción</h2>
                                            <br />
                                            <h3 style={{ marginTop: "5px", marginBottom: "5px" }}>Objetivo: {meetingminute?.title}</h3>
                                            <br />
                                            <h3 style={{ marginTop: "5px", marginBottom: "5px" }}>Lugar: {meetingminute?.place}</h3>
                                            <br />

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

                                            {/* AQUI */}
                                            {/* se muestran los compromisos atrasados que se encuentran en compromisosProyecto */}
                                            {/* se añade una condicion de mostrar el campo solo si existen compromisos atrasados */}
                                            {/* FORMATO ANTIGUO */}
                                            {/* {compromisosProyecto?.length != 0 && (
                                    <>
                                    <h3 style={{ marginTop: "5px", marginBottom: "5px" }}>Compromisos atrasados:</h3>
                                    {compromisosProyecto?.map((compromiso, index) => (
                                        <>
                                            <h4 key={index} style={{ marginLeft: '30px', marginTop: "5px", marginBottom: "5px" }}>Encargado/a: {compromiso.participants}</h4>
                                            <h4 key={index} style={{ marginLeft: '30px', marginTop: "5px", marginBottom: "5px" }}>Descripción: {compromiso.description}</h4>
                                            <br />
                                        </>
                                    ))}
                                    </>
                                )} */}
                                        </Box>

                                        <br />

                                        {/* {compromisosProyecto?.length != 0 && (
                                            <>
                                                <Box padding="space.400" backgroundColor="color.background.discovery" xcss={boxStyles2}>
                                                    <h2 style={{ marginTop: '0px', textAlign: 'center' }}>Estado del proyecto</h2>
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
                                                                                    <h4 key={charIndex} style={{ marginLeft: '30px', marginTop: "5px", marginBottom: "5px" }}>
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
                                                                                    <h4 key={index} style={{ marginLeft: '50px', marginTop: "5px", marginBottom: "5px", color: 'red' }}>{compromiso.number}.{compromiso.position} Descripción: {compromiso.description}</h4>
                                                                                    <h4 key={index} style={{ marginLeft: '50px', marginTop: "0px", marginBottom: "20px", color: 'red' }}>Fecha límite: {new Date(compromiso.dateLimit).toLocaleDateString("es-CL")}</h4>
                                                                                </Stack>
                                                                            </>
                                                                        )}
                                                                        {new Date(compromiso.dateLimit) > new Date() && (
                                                                            <>
                                                                                <Stack>
                                                                                    <h4 key={index} style={{ marginLeft: '50px', marginTop: "5px", marginBottom: "5px", color: 'green' }}>{compromiso.number}.{compromiso.position} Descripción: {compromiso.description}</h4>
                                                                                    <h4 key={index} style={{ marginLeft: '50px', marginTop: "0px", marginBottom: "20px", color: 'green' }}>Fecha límite: {new Date(compromiso.dateLimit).toLocaleDateString("es-CL")}</h4>
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

export default FormularioPostReunion;