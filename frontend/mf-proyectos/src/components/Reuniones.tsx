import React, { useEffect } from "react";
import { Box, Inline, Stack, xcss } from "@atlaskit/primitives";
import axios from "axios";
import Button, { ButtonGroup } from '@atlaskit/button';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left'
import EditFilledIcon from '@atlaskit/icon/glyph/edit-filled'
import { jwtDecode } from 'jwt-decode';
import Proyectos from "./Proyectos";
import InfoReunion from "./InfoReunion";
import FormularioNuevaReunion from "./FormularioNuevaReunion";
import ActualizarProyecto from "./ActualizarProyecto";
import Tooltip, { TooltipPrimitive } from '@atlaskit/tooltip';
import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';
import CheckIcon from "@atlaskit/icon/glyph/check";
import MoreIcon from '@atlaskit/icon/glyph/more'



// Se obtiene el token del usuario logeado
const tokenUser = localStorage.getItem('tokenUser');
let mailUser = "";


const listStyles = xcss({
    paddingInlineStart: 'space.0',
});
const boxStyles = xcss({
    color: 'color.text',
    backgroundColor: 'color.background.selected',
    borderWidth: 'border.width',
    borderStyle: 'solid',
    borderColor: 'color.border.selected',
    borderRadius: 'border.radius.100',
    transitionDuration: '200ms',
    listStyle: 'none',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '15px', // Add margin left
    marginRight: '15px', // Add margin right
    '::before': {
        paddingInlineEnd: 'space.050',
    },
    '::after': {
        paddingInlineStart: 'space.050',
    },
    ':hover': {
        backgroundColor: 'color.background.selected.bold.hovered',
        color: 'color.text.inverse',
        transform: 'scale(1.02)',
    },
});

const InlineDialog = styled(TooltipPrimitive)({
    background: 'white',
    width: '750px',
    borderRadius: token('border.radius', '4px'),
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
    boxSizing: 'content-box',
    padding: `${token('space.100', '8px')} ${token('space.150', '12px')}`,
});




const Reuniones: React.FC = () => {


    // Interfaz para los proyectos del usuario
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

    // Interfaz para las reuniones de un proyecto
    interface ReunionesProyecto {
        name: string;
        description: string;
        number: number;
        state: string;
        project: string[]; 
        createdAt: Date;
        updatedAt: Date;
        _id: string;
    }

    // Estado para saber que pestaña mostrar al usuario
    const [verProyecto, setVerProyecto] = React.useState(false);
    const [verReunion, setVerReunion] = React.useState(false);
    const [proyectoUser, setProyectsUser] = React.useState<ProyectoUser>(); 
    const [reunionesProyecto, setReunionesProyecto] = React.useState<ReunionesProyecto[]>([]); 
    const [mostrarFormularioReunion, setMostrarFormularioReunion] = React.useState(false);
    const [editarProyecto, setEditarProyecto] = React.useState(false);



    //Se trae la informacion del proyecto para mostrarla al usuario
    useEffect(() => {
        // Obtener valor de variable almacenada en el localStorage para saber si se debe mostrar la lista de proyectos o si se debe mostrar la informacion del proyecto
        const storedValue = localStorage.getItem('verProyecto');
        if (storedValue) {
            const parsedValue = JSON.parse(storedValue);
            setVerProyecto(parsedValue);
            
        }

        // Guardar el correo electronico del usuario logeado utilizando el token
        const decodedToken: any = tokenUser ? jwtDecode(tokenUser) : null;
        mailUser= decodedToken.email;

        // Obtener valor de variable almacenada en el localStorage, la cual indica el id del proyecto seleccionado, de tal forma se puede realizar la petición para obtener la información del proyecto
        const idProyecto = localStorage.getItem('idProyecto');
        // // Obtener proyecto del usuario por id
        async function obtenerProyectoPorId() {
            try {
                // Solo se requiere del token del usuario para realizar la petición
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/project/getProjectbyID/` + idProyecto, {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                setProyectsUser(response.data);
                localStorage.setItem('userOwner', response.data.userOwner);
            } catch (error) {
                console.error(error);
            }
        }
        obtenerProyectoPorId();

        // Obtener las reuniones de un proyecto
        async function reunionesDeProyecto() {
            try {
                // Solo se requiere del token del usuario para realizar la petición
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/meeting/project/` + idProyecto, {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Reuniones para el proyecto seleccionado:");
                console.log(response.data);
                localStorage.setItem('cantidadReuniones', JSON.stringify(response.data.length));
                
                setReunionesProyecto(response.data.reverse());

            } catch (error) {
                console.error(error);
            }
        }
        reunionesDeProyecto();

    }, []);


    // Funcion para regresar al listado de proyectos
    // Entrada: ninguna
    // Salida: regresar a la página principal de proyectos
    const cancelarOperacion = () => {
        const newValue = !verProyecto;
        // Guardar valor de la variable en local storage
        localStorage.setItem('verProyecto', JSON.stringify(newValue));
        if (verProyecto == false) {
            setVerProyecto(true);
        }
        else{
            setVerProyecto(false);    
        }
        
    }


    // Funcion para crear una reunion
    // Entrada: ninguna
    // Salida: cambiar el valor de la variable en local storage, para asi mostrar el formulario para crear una nueva reunion
    const nuevaReunion = () => {
        // OJO CON EL FORMULARIO DE CREAR REUNION, EN ESPECIFICO CON LOS VALORES DEL CAMPO STATE... (si se deja en ingles, sera un cacho para mostrar la informacion)
        const newValue = !mostrarFormularioReunion;
        // Guardar valor de la variable en local storage
        localStorage.setItem('mostrarFormularioReunion', JSON.stringify(newValue));
        if (mostrarFormularioReunion == false) {
            setMostrarFormularioReunion(true);
        }
        else{
            setMostrarFormularioReunion(false);    
        }

    }

    // Funcion para editar la informacion del proyecto
    // Entrada: ninguna
    // Salida: cambiar el valor de la variable en local storage, para asi mostrar el formulario para editar la informacion del proyecto
    const editarProyectoFuncion = () => {
        const newValue = !editarProyecto;
        // Guardar valor de la variable en local storage
        localStorage.setItem('editarProyecto', JSON.stringify(newValue));
        if (editarProyecto == false) {
            setEditarProyecto(true);
        }
        else{
            setEditarProyecto(false);    
        }
    }

    // Funcion para seleccionar una reunion
    // Entrada: id de la reunion y nombre de la reunion
    // Salida: cambiar valor de variable en local storage para mostrar la informacion de la reunion
    const seleccionReunion = (idReunion: string, nameReunion:string, estadoReunion:string) => {
        console.log("Viendo la reunion: ", nameReunion, "con el id: ", idReunion);
        const newValue = !verReunion;
        localStorage.setItem('verReunion', JSON.stringify(newValue));
        // Guardar el id de la reunion seleccionada en local storage, para posteriormente cargar la informacion de la reunion en la respectiva ventana
        localStorage.setItem('idReunion', idReunion);
        // Guardar el estado de la reunion seleccionada
        localStorage.setItem('estadoReunion', estadoReunion);
        if (verReunion == false) {
            setVerReunion(true);
        }
        else{
            setVerReunion(false);    
        }
    }




    return (
        <div>

            {/* IF_1: el usuario decide volver a la lista de proyectos */}
            {!verProyecto ? (
                <Proyectos />
            ) : (
                <>
                {/* IF_2: el usuario decide seleccionar una reunion */}
                {verReunion ? (
                        <InfoReunion />
                    ) : (
                        <>
                        {/* IF_3: el usuario decide crear una nueva reunion */}
                        {mostrarFormularioReunion ? (
                            <FormularioNuevaReunion />
                        ) : (
                            <>
                                {/* IF_4: el usuario quiere editar la informacion de un proyecto */}
                                {editarProyecto ? (
                                    <ActualizarProyecto />
                                ) : (
                                    <>
                                        {/* Código adicional */}
                                        {/* // ELSE mostrar la informacion del proyecto seleccionado por el usuario (incluye mostrar las reuniones y boton para crear nueva reunion) */}
                                        <div>
                                            {/* MOSTRAR LA INFORMACION DEL PROYECTO */}
                                            <Stack space="space.100">
                                            {
                                                <div style={{ textAlign: 'left', margin: '15px' }}>
                                                    {/* NOMBRE ABREVIADO DEL PROYECTO: se muestra la informacion del proyecto como un mensaje "tooltip" */}
                                                    <Tooltip
                                                        component={InlineDialog}
                                                        // informacion del proyecto
                                                        content={() =>  
                                                            <>
                                                                <h4>Nombre completo: {proyectoUser?.name}</h4>
                                                                <hr />

                                                                <h4>Descripción: {proyectoUser?.description}</h4>
                                                                <hr />

                                                                {proyectoUser?.projectDateI && <h4>Fecha de inicio: {proyectoUser?.projectDateI}</h4>}

                                                                {proyectoUser?.projectDateT && <h4>Fecha de termino: {proyectoUser?.projectDateT}</h4> && <hr />}

                                                                <h4>Dueño del proyecto: {proyectoUser?.userOwner}</h4>
                                                                <hr />

                                                                {Array.isArray(proyectoUser?.guests) && proyectoUser?.guests.length > 0 && (
                                                                    <>
                                                                        <h4>Invitados al proyecto: </h4>
                                                                        {proyectoUser?.guests.map((member: string, index: number) => (
                                                                            <h4 key={index} style={{ marginLeft: '30px' }}>{member}</h4>
                                                                        ))}
                                                                        <hr />
                                                                    </>
                                                                )}
                                                                
                                                                {/* <h4>{proyectoUser?.userMembers}</h4> */}
                                                                {Array.isArray(proyectoUser?.userMembers) && proyectoUser?.userMembers.length > 0 && (
                                                                    <>
                                                                        <h4>Miembros del proyecto: </h4>
                                                                        {proyectoUser?.userMembers.map((member: string, index: number) => (
                                                                            <h4 key={index} style={{ marginLeft: '30px' }}>{member}</h4>
                                                                        ))}
                                                                        <hr />
                                                                    </>
                                                                )}
                                                            </>
                                                        }
                                                    >
                                                        {(tooltipProps) => (
                                                            <>
                                                                {/* nombre del proyecto y la opcion de editar si el usuario es el dueño */}
                                                                <Inline>
                                                                    {/* appearance="link" */}
                                                                    <Button style={{height:"100%"}} appearance="link" {...tooltipProps}>
                                                                        <h1 style={{ color: 'black'}}>{proyectoUser?.shortName}</h1>
                                                                    </Button>
                                                                    {mailUser == proyectoUser?.userOwner && (
                                                                        <div style={{ marginTop: '21.440px' }}>
                                                                            <Button appearance="subtle" iconBefore={<EditFilledIcon label="" size="medium" />} onClick={() => editarProyectoFuncion()}></Button>
                                                                        </div>
                                                                    )}
                                                                </Inline>
                                                            </>
                                                        )}
                                                    </Tooltip>

                                                    {/* opcion de regresar y crear nueva reunion al comienzo de la ventana -> solo se mostrara hayan muchas reuniones mostrandose (de momento se consideran 12)*/}
                                                    <br />
                                                    {reunionesProyecto.length > 12 && (
                                                        <div style={{ marginBottom: '15px' }}>
                                                            <ButtonGroup>
                                                                <Button iconBefore={<ArrowLeftIcon label="" size="medium" />} onClick={() => cancelarOperacion()} style={{ marginRight: '5x' }}> Proyectos </Button>
                                                                <Button className="botonNuevoProyecto" appearance="primary" onClick={() => nuevaReunion()} style={{ marginLeft: '5px' }}>+ Añadir nueva reunión</Button>
                                                            </ButtonGroup>
                                                        </div>
                                                    )}
                                                    
                                                </div>
                                            }
                                            </Stack>

                                            {/* Lista de reuniones del proyecto */}
                                            <Stack space="space.100">
                                                {reunionesProyecto.map((reunionProyecto) => (
                                                    <>
                                                        {reunionProyecto.state.toLowerCase() === "finalizada" ? (
                                                            // CASO DE UNA REUNION FINALIZADA
                                                            <Box xcss={boxStyles} as="li" key={reunionProyecto._id} onClick={() => seleccionReunion(reunionProyecto._id, reunionProyecto.name, reunionProyecto.state)}>
                                                                {/* <h4 style={{ marginTop: "13.5px", marginBottom:"13.5px" }}>{reunionProyecto.name}</h4> */}
                                                                <h4 style={{ marginTop: "13.5px", marginBottom:"13.5px" }}>{reunionProyecto.name} <CheckIcon label="Check" size="small" /></h4>
                                                            </Box>
                                                        ) : (
                                                            // CASO DE UNA REUNION NO FINALIZADA
                                                            <Box xcss={boxStyles} as="li" key={reunionProyecto._id} onClick={() => seleccionReunion(reunionProyecto._id, reunionProyecto.name, reunionProyecto.state)}>
                                                                <h4 style={{ marginTop: "13.5px", marginBottom:"13.5px" }}>{reunionProyecto.name} <MoreIcon label="Check" size="small" /></h4>
                                                            </Box>
                                                        )}

                                                        {/* <Box xcss={boxStyles} as="li" key={reunionProyecto._id} onClick={() => seleccionReunion(reunionProyecto._id, reunionProyecto.name, reunionProyecto.state)}>
                                                            <h4 style={{ marginTop: "13.5px", marginBottom:"13.5px" }}>{reunionProyecto.name}</h4>
                                                        </Box> */}

                                                    </>
                                                ))}
                                            </Stack>

                                            <br />

                                            {/* opcion de regresar y crear nueva reunion al final de la ventana */}
                                            <div style={{ marginBottom: '30px' }}>
                                            <ButtonGroup>
                                                    <Button iconBefore={<ArrowLeftIcon label="" size="medium" />} onClick={() => cancelarOperacion()} style={{ marginRight: '5x' }}> Proyectos </Button>
                                                    <Button className="botonNuevoProyecto" appearance="primary" onClick={() => nuevaReunion()} style={{ marginLeft: '5px' }}>+ Añadir nueva reunión</Button>
                                            </ButtonGroup>
                                            </div>
                                            
                                        </div>
                                    </>
                                // IF_4
                                )}
                                </>
                            // IF_3
                            )}
                        </>
                    // IF_2
                    )}
                </>
            // IF_1
            )}
        </div>
    );
};

export default Reuniones;