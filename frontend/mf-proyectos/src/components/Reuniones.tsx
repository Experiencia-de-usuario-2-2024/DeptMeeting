import React, { useEffect } from "react";
import { Stack } from "@atlaskit/primitives";
import axios from "axios";
import Button from '@atlaskit/button';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import EditFilledIcon from '@atlaskit/icon/glyph/edit-filled';
import { jwtDecode } from 'jwt-decode';
import Proyectos from "./Proyectos";
import InfoReunion from "./InfoReunion";
import FormularioNuevaReunion from "./FormularioNuevaReunion";
import ActualizarProyecto from "./ActualizarProyecto";
import Tooltip from '@atlaskit/tooltip';
import styled from '@emotion/styled';
import '../styles/reuniones.css';

// Se obtiene el token del usuario logeado
const tokenUser = localStorage.getItem('tokenUser');
let mailUser = "";

const InlineDialog = styled(Tooltip)({
    background: 'white',
    width: '750px',
    borderRadius: '4px',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
    boxSizing: 'content-box',
    padding: '8px 12px',
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
                                        <div className="reunionesContainer">
                                            <div className="reunionesHeader">
                                                <h1>Reunión Departamento {proyectoUser?.shortName}</h1>
                                                <div className="actionButtons">
                                                    <Button
                                                        className="backButton"
                                                        iconBefore={<ArrowLeftIcon label="" />}
                                                        onClick={() => cancelarOperacion()}
                                                    >
                                                        Regresar
                                                    </Button>
                                                    {mailUser === proyectoUser?.userOwner && (
                                                        <Button
                                                            className="backButton"
                                                            iconBefore={<EditFilledIcon label="" />}
                                                            onClick={() => editarProyectoFuncion()}
                                                        >
                                                            Editar
                                                        </Button>
                                                    )}
                                                    <Button
                                                        className="addButton"
                                                        onClick={() => nuevaReunion()}
                                                    >
                                                        + Añadir nueva reunión
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="reunionesList">
                                                {reunionesProyecto.map((reunion) => (
                                                    <div
                                                        key={reunion._id}
                                                        className="reunionCard"
                                                        onClick={() => seleccionReunion(reunion._id, reunion.name, reunion.state)}
                                                    >
                                                        <div className="reunionTitle">
                                                            <span>Reunión {reunion.number}</span>
                                                            <span>{reunion.state}</span>
                                                        </div>
                                                    </div>
                                                ))}
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