import React, { useEffect } from "react";
import { Box, Stack, xcss } from "@atlaskit/primitives";
import axios from "axios";
import Button from '@atlaskit/button';
import FormularioNuevoProyecto from './FormularioNuevoProyecto';
import Reuniones from "./Reuniones";
import '../styles/proyectos.css';

// Se obtiene el token del usuario logeado
const tokenUser = localStorage.getItem('tokenUser');
const tipoDeUsuario = localStorage.getItem('tipoUsuario');

const Proyectos: React.FC = () => {

    // Interfaz para los proyectos del usuario
    interface ProyectosUser {
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

    // Estado para mostrar el formulario de nuevo proyecto
    const [mostrarFormulario, setMostrarFormulario] = React.useState(false);
    // Estado para mostrar el proyecto con su informacion y reuniones
    const [verProyecto, setVerProyecto] = React.useState(false);

    // Obtener todos los proyectos del usuario al inicio
    const [proyectosUser, setProyectosUser] = React.useState<ProyectosUser[]>([]);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        // Obtener valor de variable almacenada en el localStorage (para saber si se tiene que mostrar o no el formulario apenas carga la pagina)
        const storedValue = localStorage.getItem('mostrarFormulario');
        if (storedValue) {
            const parsedValue = JSON.parse(storedValue);
            setMostrarFormulario(parsedValue);
        }

        // Obtener el valor de la variable almacenada en el localStorage (para saber si se tiene que mostrar el proyecto con su informacion y reuniones apernas carga)
        const storedValue2 = localStorage.getItem('verProyecto');
        if (storedValue2) {
            const parsedValue2 = JSON.parse(storedValue2);
            setVerProyecto(parsedValue2);
        }

        // Función para obtener los proyectos del usuario
        async function obtenerProyectosUser() {
            try {
                // Solo se requiere del token del usuario para realizar la petición
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/project/get/findByUser`, {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Períodos del usuario:");
                console.log(response.data);
                // se invierte la lista de proyectos del usuario, de tal forma se mostraran primero los proyectos mas nuevos
                setProyectosUser(response.data.reverse());
                setLoading(false);

            } catch (error) {
                console.error(error);
            }
        }

        obtenerProyectosUser();
    }, []);

    // Función para seleccionar un proyecto
    // Entrada: id del proyecto y nombre del proyecto
    // Salida: Mostrar las reuniones del proyecto seleccionado -> AUN EN PROCESO
    const seleccionProyecto = (idProyecto: string, nameProyecto: string, nombreCorto: string ) => {
        console.log("Viendo el proyecto: ", nameProyecto, "con el id: ", idProyecto);
        const newValue = !verProyecto;
        localStorage.setItem('verProyecto', JSON.stringify(newValue));
        localStorage.setItem('nombreProyecto', nombreCorto);
        // Guardar el id del proyecto seleccionado en local storage, para posteriormente cargar la informacion del proyecto en la pagina de reuniones
        localStorage.setItem('idProyecto', idProyecto);
        if (verProyecto == false) {
            setVerProyecto(true);
        }
        else{
            setVerProyecto(false);    
        }
    }

    // Función para crear un nuevo proyecto
    // Entrada: Ninguna
    // Salida: Mostrar el formulario para crear un nuevo proyecto
    const nuevoProyecto = () => {
        console.log("Creando nuevo período");
        const newValue = !mostrarFormulario;
        // Guardar valor de la variable en local storage
        localStorage.setItem('mostrarFormulario', JSON.stringify(newValue));
        if (mostrarFormulario == false) {
            setMostrarFormulario(true);
        }
        else{
            setMostrarFormulario(false);    
        }
    }

    return (
        <Stack space="space.100">
            {/* Muestra o el formulario o los proyectos */}
            {/*IF: variable para mostrar formulario = TRUE */}
            {mostrarFormulario ? (
                <FormularioNuevoProyecto />
            ) : (
                // ELSE: mostrar los proyectos del usuario
                <div className="proyectosContainer">
                    {loading ? (
                        <div className="mensaje">
                            <p>Cargando períodos...</p>
                        </div>
                    ) : (
                        verProyecto ? (
                            <Reuniones />
                        ) : (
                            <div className="proyectosContainer">
                                <h1>Períodos</h1>
                                {tipoDeUsuario === "profesor" && (
                                    <>
                                        {proyectosUser.length > 12 && (
                                            <Button 
                                                className="botonNuevoProyecto" 
                                                appearance="primary" 
                                                onClick={() => nuevoProyecto()}
                                            >
                                                + Añadir nuevo período
                                            </Button>
                                        )}
                                    </>
                                )}

                                {/* mostrar los proyectos */}
                                {proyectosUser.map((proyectoUser) => (
                                    <div 
                                        key={proyectoUser._id} 
                                        className="proyectoCard"
                                        onClick={() => seleccionProyecto(proyectoUser._id, proyectoUser.name, proyectoUser.shortName)}
                                    >
                                        <h3>{proyectoUser.shortName}</h3>
                                        <div className="descripcion">
                                            <p><strong>Nombre completo:</strong> {proyectoUser.name}</p>
                                            <p><strong>Descripción:</strong> {proyectoUser.description}</p>
                                            <p><strong>Responsable:</strong> {proyectoUser.userOwner}</p>
                                        </div>
                                    </div>
                                ))}

                                {/* opcion de crear nuevo proyecto al final */}
                                {tipoDeUsuario === "profesor" && (            
                                    <Button 
                                        className="botonNuevoProyecto" 
                                        appearance="primary" 
                                        onClick={() => nuevoProyecto()}
                                    >
                                        + Añadir nuevo período
                                    </Button>
                                )}
                            </div>
                        )
                    )}
                </div>
            )}
        </Stack>
    );
};

export default Proyectos;