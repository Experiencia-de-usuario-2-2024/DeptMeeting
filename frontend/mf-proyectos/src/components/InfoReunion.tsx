import React, { useEffect } from "react";
import { Inline, Stack } from "@atlaskit/primitives";
import axios from "axios";
import Button, { ButtonGroup } from '@atlaskit/button';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left'
import Reuniones from "./Reuniones";
import LinkIcon from '@atlaskit/icon/glyph/link'


// Se obtiene el token del usuario logeado
const tokenUser = localStorage.getItem('tokenUser');

const InfoReunion: React.FC = () => {

    // Interfaz para ver los datos de una reunion
    interface Reunion {
        name: string;
        description: string;
        number: number;
        state: string;
        project: string[]; 
        createdAt: Date;
        updatedAt: Date;
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
    }


    // Para determinar si se muestra pestaña que contiene la informacion de la reunion o no
    const [verReunion, setVerReunion] = React.useState(false);

    // Para determinar si se muestra en la parte central el acta dialogica o no (en cualquiera que sea su etapa, pre, in, post o finalizada)
    const [verActaDialogica, setVerActaDialogica] = React.useState(false);

    // Para guardar los datos de la runion
    const [reunionProyecto, setReunionProyecto] = React.useState<Reunion>(); 
    const [reunionNueva, setReunionNueva] = React.useState(false); 

    // para guardar la informacion de la meeting minute (acta dialogica)
    const [meetingminute, setMeetingMinute] = React.useState<MeetingMinute>();


    useEffect(() => {
        // Obtener valor de variable almacenada en el localStorage (para saber si se tiene que mostrar o no el formulario apenas carga la pagina)
        const storedValue = localStorage.getItem('verReunion');
        if (storedValue) {
            const parsedValue = JSON.parse(storedValue);
            setVerReunion(parsedValue);
        }

        const storedValue2 = localStorage.getItem('verActaDialogica');
        if (storedValue2) {
            const parsedValue2 = JSON.parse(storedValue2);
            setVerActaDialogica(parsedValue2);
        }

        // Peticion para obtener la informacion de la reunion
        const idReunion = localStorage.getItem('idReunion');
        async function obtenerReunionPorId() {
            try {
                // Solo se requiere del token del usuario para realizar la petición
                const response = await axios.get(`http://deptmeeting.diinf.usach.cl/api/api/meeting/` + idReunion, {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("INFORMACION DE LA REUNION");
                console.log(response.data);
                setReunionProyecto(response.data);
                localStorage.setItem('descripcionReunion', response.data.description);

                // Si la reunion es nueva, se muestra el boton para dirigir a la reunion en sus respectivos estados
                if (
                    response.data.state !== "nueva" ||
                    response.data.state !== "Nueva" ||
                    response.data.state !== "new" ||
                    response.data.state !== "New"
                ) {
                    setReunionNueva(false);
                } else {
                    setReunionNueva(true);
                }
                localStorage.setItem('reunionNueva', JSON.stringify(reunionNueva));
            } catch (error) {
                console.error(error);
            }
        }
        obtenerReunionPorId();
    }, []);



    // Funcion para regresar a la ventana que contiene la informacion del proyecto y sus reuniones
    // Entrada: ninguna
    // Salida: ninguna, modificar el valor almacenado en local storage
    const cancelarOperacion = () => {
        const newValue = !verReunion;
        // Guardar valor de la variable en local storage
        localStorage.setItem('verReunion', JSON.stringify(newValue));
        if (verReunion == false) {
            setVerReunion(true);
        }
        else{
            setVerReunion(false);    
        }
        
    }

    // FUNCION NO UTILIZADA
    const minutaPorId = (idReunion: string) => {
        async function obtenerMeetingMinute() {
            try {
                // Solo se requiere del token del usuario para realizar la petición
                const response = await axios.get(`http://deptmeeting.diinf.usach.cl/api/api/meeting-minute/reunion/` + idReunion, {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log(" +++++++++++++++ INFORMACION DEL ACTA DIALOGICA +++++++++++++++");
                console.log(response.data);
                window.alert(" ++++++ id de la reunion: " + idReunion + " id de la minuta: " + response.data[0]._id);
                localStorage.setItem('idMeetingMinute', meetingminute?._id ?? '');
                setMeetingMinute(response.data[0]);
            } catch (error) {
                console.log("ERROR AL OBTENER LA INFORMACION DEL ACTA DIALOGICA");
                console.error(error);
            }
        }
        obtenerMeetingMinute();
        localStorage.setItem('idMeetingMinute', meetingminute?._id ?? '');
        window.alert("id de la reunion: " + idReunion + " id de la minuta: " + meetingminute?._id);
    }


    // Entrada: id de la reunion
    // Salida: ninguna
    // Funcion para cambiar el estado de una reunion a "pre-reunión"
    async function cambiarEstado(idReunion: string) {
        try {            
            const response = await axios.put(`http://deptmeeting.diinf.usach.cl/api/api/meeting/` + idReunion, {
                state: "Pre-reunión"
            },{
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


    // Funcion para dirigir a la pagina de la reunion
    // Entrada: ninguna
    // Salida: ninguna, modificar y agregar un valor en local storage
    const irReunion = () => {
        // se guarda el id de la reunion en local storage, para que se pueda cargar en la pagina correspondiente
        localStorage.setItem('idReunion', reunionProyecto?._id ?? '');
        // se guarda el estado de la reunion en local storage, para cargar el acta dialogica en su respectiva etapa (pre, en, post y fin)
        localStorage.setItem('estadoReunion', reunionProyecto?.state ?? '');

        // variable auxiliar para mostrar el id de la reunion en el mensaje emergente (borrar una vez se finalizen todas las pruebas)
        const aux = localStorage.getItem('idReunion');

        // se cambia la variable de verActaDialogica a true, para que se muestre el acta dialogica, posteriormente se actualiza su valor en local storage
        const verActaValorOriginal = verActaDialogica
        const newValue = !verActaDialogica;

        // si esta en true, no se actualiza en local storage, en caso contrario se actualiza
        if (verActaValorOriginal === false) {
            localStorage.setItem('verActaDialogica', JSON.stringify(newValue));

        }
        // localStorage.setItem('verActaDialogica', JSON.stringify(newValue));
        localStorage.setItem('verPerfil', JSON.stringify(false));

        // AGREGAR: buscar el id de la meeting minute mediante una peticion considerando el id de la reunion
        async function obtenerMeetingMinute() {
            // window.alert("Entre a la funcion obtenerMeetingMinute");
            try {
                // Solo se requiere del token del usuario para realizar la petición
                const response = await axios.get(`http://deptmeeting.diinf.usach.cl/api/api/meeting-minute/reunion/` + aux, {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log(" +++++++++++++++ INFORMACION DEL ACTA DIALOGICA +++++++++++++++");
                console.log(response.data);
                localStorage.setItem('idMeetingMinute', response.data[0]._id);
                setMeetingMinute(response.data[0]);

                if (verActaValorOriginal == false) {
                    setVerActaDialogica(true);
                }
                else{
                    // setVerActaDialogica(false); | Jyr comentario: ??????????????????????????????????????????
                    window.location.reload();
                }

                window.location.reload();
                
            } catch (error) { //Puede entrar aqui en caso de que no exista una minuta para la reunion, pero aun asi se debe ir a la pre reunion

                // se cambia el estado a la reunion a pre 
                const idReunion = localStorage.getItem('idReunion') ?? '';
                // Se cambia el estado de la reunión a "pre-reunión"
                if(reunionProyecto?.state === "nueva" || reunionProyecto?.state === "Nueva" || reunionProyecto?.state === "new" || reunionProyecto?.state === "New"){
                    cambiarEstado(idReunion);
                };
                if (verActaDialogica == false) {
                    setVerActaDialogica(true);
                }
                else{
                    setVerActaDialogica(false);    
                }
                window.location.reload();
                console.error(error);
            }
        }

        
        obtenerMeetingMinute();
    }




    return (
        <div>
            {!verReunion ? (
                <Reuniones />
            ) : (
                <>
                    {/* INFORMACION DE LA REUNION */}
                    <Stack space="space.100">
                        {
                            <div style={{ textAlign: 'left', margin: '15px' }}>
                                <Inline>
                                    <h2>{localStorage.getItem('nombreProyecto')} / {reunionProyecto?.name}</h2>
                                </Inline>
                                <hr />

                                <h4>Número de reunión: {reunionProyecto?.number}</h4>
                                <hr />

                                <h4>Descripción: {reunionProyecto?.description}</h4>
                                <hr />

                                <h4>Estado: {reunionProyecto?.state}</h4>
                                <hr />

                            </div>
                        }
                    </Stack>

                    {/* BOTONES PARA IR A LA REUNION O REGRESAR */}
                    <div>
                        <ButtonGroup>
                            <Button iconBefore={<ArrowLeftIcon label="" size="medium" />} onClick={() => cancelarOperacion()} style={{ marginRight: '5px'}}> Ir al proyecto </Button>
                            {/* se comenta esta opción, la cual es la original, puesto que ahora la etiqueta del boton se correspondera con el estado de la reunion */}
                            {reunionProyecto?.state === "Nueva" && (
                                <Button appearance="primary" iconBefore={<LinkIcon label="" size="medium" />} onClick={() => irReunion()} style={{ marginLeft: '5px' }}> Ir a pre-reunión </Button>
                            )}
                            {reunionProyecto?.state === "Pre-reunión" && (
                                <Button appearance="primary" iconBefore={<LinkIcon label="" size="medium" />} onClick={() => irReunion()} style={{ marginLeft: '5px' }}> Ir a pre-reunión </Button>
                            )}
                            {reunionProyecto?.state === "En-reunión" && (
                                <Button appearance="primary" iconBefore={<LinkIcon label="" size="medium" />} onClick={() => irReunion()} style={{ marginLeft: '5px' }}> Ir a reunión </Button>
                            )}
                            {reunionProyecto?.state === "Post-reunión" && (
                                <Button appearance="primary" iconBefore={<LinkIcon label="" size="medium" />} onClick={() => irReunion()} style={{ marginLeft: '5px' }}> Ir a post-reunión </Button>
                            )}
                            {reunionProyecto?.state === "Finalizada" && (
                                <Button appearance="primary" iconBefore={<LinkIcon label="" size="medium" />} onClick={() => irReunion()} style={{ marginLeft: '5px' }}> Ir al acta </Button>
                            )}
                        </ButtonGroup>
                    </div>

                </>
            )}
        </div>
    );
};

export default InfoReunion;