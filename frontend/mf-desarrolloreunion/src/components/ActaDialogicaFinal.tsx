import React, {Fragment, useEffect, useState, useRef, LegacyRef} from "react";
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
import RecentIcon from '@atlaskit/icon/glyph/recent'
import CalendarIcon from '@atlaskit/icon/glyph/calendar'

import { PDFDownloadLink, Document, Page, Text } from '@react-pdf/renderer';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import io , { Socket } from "socket.io-client";


// Se obtiene el token del usuario logeado
const tokenUser = localStorage.getItem('tokenUser');


const boxStyles = xcss({
    borderColor: 'color.border.selected',
    // width: '500px',
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
        percentageComplete: 100,
        status: 'disabled',
        href: '#',
    },
    {
        id: 'finalizar',
        label: 'Reunión finalizada',
        percentageComplete: 0,
        status: 'current',
        href: '#',
    },
];


var estadoReunion: string;
var idReunionAux: string;
var idProyectoAux: string;
var nombreCortoProyecto: string;
var numeroReunion: string;
var nombreCortoProyectoAux: string = "";
var numeroReunionActa: number;

const ActaDialogicaFinal: React.FC = () => {

    // websocket
    const [socket, setSocket] = useState<Socket>();

    useEffect(() => {
        // websocket
        const newSocket = io(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_IO_PORT}`);
        setSocket(newSocket);

        // Obtener los datos del usuario logeado
        async function obtenerDatosUsuarioLog() {
            try {
                const decodedToken: any = tokenUser ? jwtDecode(tokenUser) : null;
                const correoElectronico = decodedToken.email;
                // Solo se requiere del token del usuario para realizar la petición
                const response = await axios.get(`http://deptmeeting.diinf.usach.cl/api/api/user/perfil/email/` + correoElectronico, {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                setusuarioPerfilLog(response.data);
                // salir inmediatamente de la sala de la minuta -> si esto provoca errores, comentarlo
                newSocket.emit('event_leave', { room: localStorage.getItem('idMeetingMinute'), user: response.data });
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

    const pdfRef = useRef<HTMLDivElement>(null);
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

    // Para determinar si se muestra en la parte central el acta dialogica o no (en cualquiera que sea su etapa, pre, in, post o finalizada)
    const [verActaDialogica, setVerActaDialogica] = React.useState(false);
    // para guardar los datos del acta dialogica (meetingminute)
    const [meetingminute, setMeetingMinute] = React.useState<MeetingMinute>();
    // Para mostrar un spinner en el boton de descargar pdf
    const [valorCarga, setValorCarga] = useState(false);

    // para guardar los datos de la reunion
    const [reunion, setReunion] = React.useState<Reunion>();
    // para guardar datos del proyecto
    const [proyectoUser, setProyectsUser] = React.useState<ProyectoUser>();
    // para guardar todos los compromisos del proyecto (despues de haber pasado todos los filtros)
    const [compromisosProyecto, setcompromisosProyecto] = React.useState<Compromiso[]>();

    // Estado para tener la informacion del usuario logeado
    const [usuarioPerfilLog, setusuarioPerfilLog] = React.useState<Usuario>(); 
    

    useEffect(() => {

        const storedValue = localStorage.getItem('verActaDialogica');
        if (storedValue) {
            const parsedValue = JSON.parse(storedValue);
            setVerActaDialogica(parsedValue);
        }

        // obtenerDatosUsuarioLog();

        const idProyecto = localStorage.getItem('idProyecto') ?? '';
        // funcion utilizada para traer los compromisos de los usuarios -> esta funcion posteriormente se utilizara de forma iterativa sobre una lista de participantes
        async function obtenerCompromisosUsuario(correoUsuario: string) {
            try {
                const decodedToken: any = tokenUser ? jwtDecode(tokenUser) : null;
                const response = await axios.get(`http://deptmeeting.diinf.usach.cl/api/api/element/participants/` + correoUsuario, {
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
                filteredData = filteredData.filter((item: Compromiso) => item.number < numeroReunionActa);

                // Se añade filteredData a "setcompromisosProyecto"
                setcompromisosProyecto(compromisosProyecto => [...(compromisosProyecto || []), ...filteredData]);
            } catch (error) {
                console.error(error);
            }
        }


        estadoReunion = localStorage.getItem('estadoReunion') ?? '';
        // Se obtienen los datos del acta dialogica (meetingminute) a partir de su id que esta almacenado en local storage
        const idMeetingMinute = localStorage.getItem('idMeetingMinute');
        async function obtenerMeetingMinutePorId() {
            try {
                // Solo se requiere del token del usuario para realizar la petición
                const response = await axios.get(`http://deptmeeting.diinf.usach.cl/api/api/meeting-minute/`+ idMeetingMinute, {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("INFORMACION DEL ACTA DIALOGICA *** EN FINAL ***");
                console.log(response.data);
                setMeetingMinute(response.data[0]);
                nombreCortoProyectoAux = response.data[0].nombreCortoProyecto;
                idReunionAux = response.data[0].meeting;
                numeroReunionActa = response.data[0].number;
                // se recorre la lista de participantes de la reunion para obtener los compromisos de cada uno utilizando la funcion "obtenerCompromisosUsuario"
                response.data[0].participants.forEach((participante: string) => {
                    obtenerCompromisosUsuario(participante);
                });
                
            } catch (error) {
                console.log("ERROR AL OBTENER LA INFORMACION DEL ACTA DIALOGICA **** EN FINAL ***");
                console.error(error);
            }
        }
        // obtenerMeetingMinutePorId();

        // Obtener datos de la reunion a partir del id
        // const idReunion = localStorage.getItem('idReunion') ?? ''; // id de la reunion traido desde local storage -> ya no se obtiene de local storage, se obtiene a partir de la minuta
        async function datosReunion() {
            try {            
                const response = await axios.get(`http://deptmeeting.diinf.usach.cl/api/api/meeting/`+ localStorage.getItem('idReunion'),{
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Datos de la reunión");
                console.log(response.data);
                setReunion(response.data);
                numeroReunion = response.data.number;
                idProyectoAux = response.data.project[0];
            } catch (error) {
                console.error(error);
            }
        }
        // datosReunion();

        // obtener proyecto del usuario por id
        async function obtenerProyectoPorId() {
            // window.alert("id de la reunion: " + idReunion);
            try {
                // Solo se requiere del token del usuario para realizar la petición
                const response = await axios.get(`http://deptmeeting.diinf.usach.cl/api/api/project/getProjectbyID/`+ localStorage.getItem('idProyecto'), {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                
                setProyectsUser(response.data);
                nombreCortoProyecto = response.data.shortName;
                

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

    const descargarPdf = () => {
        // window.alert("Por favor, procure cerrar los dos menus laterales, cuyos botones se encuentran en la parte superior izquierda y derecha de la página para que el PDF se genere correctamente.");
        const input = pdfRef.current;        
        if (input) {
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4', true);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = (pdfHeight - imgHeight * ratio) / 2;
            // const imgY = 30;
            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            // considerar el siguiente formato: acta-dialogica-<nombre-corto-proyecto>-<R-numero-reunion>.pdf
            pdf.save('Acta dialogica - ' + nombreCortoProyecto + ' - R ' + numeroReunion +'.pdf');
            // pdf.addImage(imgData, 'PNG', 0, 0);
            // pdf.save('acta-dialogica.pdf');
            window.alert("Archivo PDF generado exitosamente");
            setValorCarga(false);
        });
        }
        
    }






// Contenido que se muestra 
return (
    <div>
            {estadoReunion === "Finalizada" || estadoReunion === "finalizada" ? (
                <>
                <div ref={pdfRef}>
                    {/* PARTE FIJA DEL MICROFRONTEND: AVATAR GROUP, CHAT y BARRA DE PROGRESO DE LA REUNION */}
                    <div style={{width: "100%"}}>
                        <Inline>
                            {/* CONTENIDO DE LA IZQUIERDA: no tiene nada, se deja para mantener la simetria */}
                            <div style={{textAlign: "left", height: '100px', width: '550px', backgroundColor: 'white'}}> </div>

                            {/* CONTENIDO DEL MEDIO: barra de progreso */}
                            <div style={{textAlign: "center", height: '100px', width: '60%', backgroundColor: 'white'}}>
                                {/* barra de progreso en la renuion fija en pantalla*/}
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <ProgressTracker items={items} />
                                </div>
                            </div>

                            {/* CONTENIDO DE LA DERECHA: informacion sobre el llamado de la reunion*/}
                            <div style={{textAlign: "left", height: '100px', width: '550px', backgroundColor: 'white'}}>
                                <Inline space="space.100">
                                    <div style={{marginTop: '22px'}}><RecentIcon label="" size="medium"/></div>
                                    <h4 style={{ marginTop: "24px"}}>Llamado: &#60;{new Date(meetingminute?.startTime ?? "").toLocaleDateString("es-CL")} {meetingminute?.startHour.split("-")[0]}&#62; &#60;{new Date(meetingminute?.endTime ?? "").toLocaleDateString("es-CL")} {meetingminute?.endHour.split("-")[0]}&#62;</h4>
                                </Inline>
                                <Inline space="space.100">
                                    <div style={{}}><CalendarIcon label="" size="medium"/></div>
                                    <h4 style={{margin:0, marginTop: '2px'}}>Real: &#60;{meetingminute?.realStartTime.split(",")[0]} {meetingminute?.realStartTime.split(",")[1].split(":").slice(0, 2).join(":")}&#62; &#60;{meetingminute?.realEndTime.split(",")[0]} {meetingminute?.realEndTime.split(",")[1].split(":").slice(0, 2).join(":")}&#62;</h4>
                                </Inline>
                                {/* <h4 style={{ marginTop: "22 px"}}>Llamado: &#60;{new Date(meetingminute?.startTime ?? "").toLocaleDateString("es-CL")} {meetingminute?.startHour.split("-")[0]}&#62; &#60;{new Date(meetingminute?.endTime ?? "").toLocaleDateString("es-CL")} {meetingminute?.endHour.split("-")[0]}&#62;</h4>
                                <h4>Real: &#60;{meetingminute?.realStartTime.split(",")[0]} {meetingminute?.realStartTime.split(",")[1].split(":").slice(0, 2).join(":")}&#62; &#60;{meetingminute?.realEndTime.split(",")[0]} {meetingminute?.realEndTime.split(",")[1].split(":").slice(0, 2).join(":")}&#62;</h4> */}
                            </div>
                        </Inline>
                    </div> 
                
                    <div
                    style={{
                        display: 'flex',
                        margin: '0 auto',
                        marginLeft: '15px',
                        marginRight: '15px',
                        marginBottom: '30px',
                        flexDirection: 'column',
                    }}
                    
                    >
                        {/* Se comenta debido a solicitud de profesor guia: No es necesario mostrar el titulo de la seccion considerando que se tiene "ProgressTracker"*/}
                        {/* <h1 style={{ textAlign: 'center', fontSize: '60px' }}>Reunión finalizada</h1>     */}
                        
                        {/* <ProgressTracker items={items} /> */}

                        <div>
                            {/* <h2>Acta dialogica</h2> */}
                            {/* <h2>Acta dialógica de Proyecto "{proyectoUser?.shortName}" - reunión {reunion?.number}</h2> */}
                            {nombreCortoProyectoAux === "" || nombreCortoProyectoAux === undefined ? (
                                <h2 style={{ color: 'black'}}>Acta dialógica de Proyecto "{proyectoUser?.shortName}" - reunión {reunion?.number}</h2>
                            ) : (
                                <h2 style={{ color: 'black'}}>Acta dialógica de Proyecto "{nombreCortoProyectoAux}" - reunión {reunion?.number}</h2>
                            )}
                            <Box padding="space.400" backgroundColor="color.background.discovery" xcss={boxStyles}>
                                <h2 style={{marginTop:'0px', textAlign:'center'}}>Descripción</h2>
                                <br />
                                {/* objetivo */}
                                <h3 style={{ marginTop: "5px", marginBottom: "5px" }}>Objetivo: {meetingminute?.title}</h3>
                                <br />
                                {/* lugar */}
                                <h3 style={{ marginTop: "5px", marginBottom: "5px" }}>Lugar: {meetingminute?.place}</h3>
                                <br />
                                {/* anfitriones */}
                                <h3 style={{ marginTop: "5px", marginBottom: "5px" }}>Anfitrión/a:</h3>
                                {meetingminute?.leaders.map((leader, index) => (
                                    <h4 key={index} style={{ marginLeft: '30px', marginTop: "5px", marginBottom: "5px" }}>{leader}</h4>
                                ))}
                                <br />
                                {/* secretario */}
                                <h3 style={{ marginTop: "5px", marginBottom: "5px" }}>Secretario/a:</h3>
                                {meetingminute?.secretaries.map((secretari, index) => (
                                    <h4 key={index} style={{ marginLeft: '30px', marginTop: "5px", marginBottom: "5px" }}>{secretari}</h4>
                                ))}

                                <br />

                                {/* participantes invitados */}
                                <h3 style={{ marginTop: "5px", marginBottom: "5px" }}>Invitados/as:</h3>
                                {meetingminute?.participants.map((participant, index) => (
                                    <h4 key={index} style={{ marginLeft: '30px', marginTop: "5px", marginBottom: "5px" }}>{participant}</h4>
                                ))}
                                <br />
                                {/* participantes invitados que si asistieron: Asistentes */}
                                <h3 style={{ marginTop: "5px", marginBottom: "5px" }}>Asistentes:</h3>
                                {meetingminute?.assistants.map((participant, index) => (
                                    <h4 key={index} style={{ marginLeft: '30px', marginTop: "5px", marginBottom: "5px" }}>{participant}</h4>
                                ))}
                                <br />
                                {/* participantes externos invitados */}
                                {meetingminute?.externals.length != 0 && (
                                    <div>
                                        <h3 style={{ marginTop: "5px", marginBottom: "5px" }}>Externos:</h3>
                                        {meetingminute?.externals.map((external, index) => (
                                            <h4 key={index} style={{ marginLeft: '30px', marginTop: "5px", marginBottom: "5px" }}>{external}</h4>
                                        ))}
                                        <br />
                                    </div>
                                    
                                )}

                                {/* enlaces */}
                                {meetingminute?.links.length != 0 && (
                                    <>
                                    <h3 style={{ marginTop: "5px", marginBottom: "5px" }}>Links:</h3>
                                    {meetingminute?.links.map((link, index) => (
                                        <h4 key={index} style={{ marginLeft: '30px', marginTop: "5px", marginBottom: "5px" }}>{link}</h4>
                                    ))}
                                    </>
                                )}
                                <br />
                            </Box>

                            <br />

                            {compromisosProyecto?.length != 0 && (
                                <>
                                    <Box padding="space.400" backgroundColor="color.background.discovery" xcss={boxStyles2}>
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

                            <Box padding="space.400" backgroundColor="color.background.discovery" xcss={boxStyles}>
                                <h2 style={{marginTop:'0px', textAlign:'center'}}>Desarrollo de la reunión</h2>
                                <br />
                                <br />

                                <h3 style={{ marginTop: "5px", marginBottom: "5px" }}>Temas de la reunión:</h3>
                                <hr />
                                {/* temas */}
                                {meetingminute?.topics.map((topic, index) => (
                                    <div key={index}>
                                        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                                            {/* propiedad "whiteSpace" hace que <h3> reconozca los saltos de linea */}
                                            <h4 id="texto" style={{ marginLeft: '30px', marginTop: "5px", marginBottom: "5px", whiteSpace: 'pre-line'}}>{index + 1}. {topic}</h4>
                                            <br />
                                        </div>
                                        <hr />
                                    </div>
                                ))}
                            </Box>
                        </div>
                        
                        <br />
                        
                        

                    </div>

                {/* hasta este div se considera el archivo pdf que se descarga */}
                </div>

                <div style={{display: 'flex',margin: '0 auto',marginLeft: '15px',marginRight: '15px',marginBottom: '30px',flexDirection: 'column'}}>
                    <h3 style={{textAlign: 'center' }}> Antes de descargar el PDF de la reunión, procure cerrar los dos menus laterales, cuyos botones se encuentran en la parte superior izquierda y derecha de la página, además de mantener el navegador en pantalla completa, para que el PDF se genere correctamente.</h3>
                    {/* // window.alert("Por favor, procure cerrar los dos menus laterales, cuyos botones se encuentran en la parte superior izquierda y derecha de la página para que el PDF se genere correctamente."); */}
                    <ButtonGroup>
                        <Inline space="space.200" alignInline="center">
                            <Button onClick={() => cancelarOperacion()} style={{ marginTop: '20px', marginBottom: '20px'}}>Regresar al inicio</Button>
                            <Button  appearance="primary" onClick={() => {descargarPdf()}} style={{ marginTop: '20px', marginBottom: '20px'}}>Descargar PDF reunión</Button >
                        </Inline>
                    </ButtonGroup>
                </div>

                </>
            ) : (
                <h1>Cargando...</h1>
            )}
    </div>



);
};

export default ActaDialogicaFinal;