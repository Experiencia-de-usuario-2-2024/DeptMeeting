import React, { useEffect } from "react";
import { Box, Stack, xcss } from "@atlaskit/primitives";
import axios from "axios";
import Button from "@atlaskit/button";
import FormularioNuevaComision from "./FormularioNuevaComision";
import Reuniones from "./Reuniones";
import PeriodosConsejos from "./PeriodosConsejos";
import ArrowLeftIcon from "@atlaskit/icon/glyph/arrow-left";

// Se obtiene el token del usuario logeado
const tokenUser = localStorage.getItem("tokenUser");
const tipoDeUsuario = localStorage.getItem("tipoUsuario");

const listStyles = xcss({
    paddingInlineStart: "space.0",
});
const boxStyles = xcss({
    color: "color.text",
    backgroundColor: "color.background.selected",
    borderWidth: "border.width",
    borderStyle: "solid",
    borderColor: "color.border.selected",
    borderRadius: "border.radius.100",
    transitionDuration: "200ms",
    listStyle: "none",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "15px", // Add margin left
    marginRight: "15px", // Add margin right
    "::before": {
        paddingInlineEnd: "space.050",
    },
    "::after": {
        paddingInlineStart: "space.050",
    },
    ":hover": {
        backgroundColor: "color.background.selected.bold.hovered",
        color: "color.text.inverse",
        transform: "scale(1.02)",
    },
});

const Proyectos: React.FC<{ periodo?: string }> = ({ periodo }) => {
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
    // Estado para saber si se muestra (o no) la vista de proyectos o la de Periodos
    const [verPeriodos, setVerPeriodos] = React.useState(false);
    // Estado para mostrar el formulario de nuevo proyecto
    const [mostrarFormulario, setMostrarFormulario] = React.useState(false);
    // Estado para mostrar el proyecto con su información y reuniones
    const [verProyecto, setVerProyecto] = React.useState(false);

    // Estado para guardar el período elegido
    const [periodoElegido, setPeriodoElegido] = React.useState("");

    // Obtener todos los proyectos del usuario al inicio
    const [proyectosUser, setProyectosUser] = React.useState<ProyectosUser[]>([]);

    useEffect(() => {
        // prioriza el prop si viene, o de localStorage si no.
        if (periodo) {
            setPeriodoElegido(periodo);
            localStorage.setItem("periodoSeleccionado", periodo);
        } else {
            const periodoGuardado = localStorage.getItem("periodoSeleccionado");
            if (periodoGuardado) {
                setPeriodoElegido(periodoGuardado);
            }
        }
        // Obtener valor de variable almacenada en el localStorage (para saber si se tiene que mostrar o no el formulario apenas carga la pagina)
        const storedValue = localStorage.getItem("mostrarFormulario");
        if (storedValue) {
            const parsedValue = JSON.parse(storedValue);
            setMostrarFormulario(parsedValue);
        }

        // Obtener el valor de la variable almacenada en el localStorage (para saber si se tiene que mostrar el proyecto con su información y reuniones apenas carga)
        const storedValue2 = localStorage.getItem("verProyecto");
        if (storedValue2) {
            const parsedValue2 = JSON.parse(storedValue2);
            setVerProyecto(parsedValue2);
        }

        // Obtener el período guardado en localStorage (para mostrarlo como título)
        const periodoGuardado = localStorage.getItem("periodoSeleccionado");
        if (periodoGuardado) {
            setPeriodoElegido(periodoGuardado);
        }

        // Función para obtener los proyectos del usuario
        async function obtenerProyectosUser() {
            try {
                // Solo se requiere del token del usuario para realizar la petición
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/api/project/get/findByUser`,
                    {
                        headers: {
                            Authorization: `Bearer ${tokenUser}`,
                        },
                    }
                );
                console.log("Proyectos del usuario:");
                console.log(response.data);
                // se invierte la lista de proyectos, de tal forma se muestran primero los proyectos más nuevos
                setProyectosUser(response.data.reverse());
            } catch (error) {
                console.error(error);
            }
        }

        obtenerProyectosUser();
    }, []);

    // Función para seleccionar un proyecto
    // Entrada: id del proyecto y nombre del proyecto
    // Salida: Mostrar las reuniones del proyecto seleccionado
    const seleccionProyecto = (
        idProyecto: string,
        nameProyecto: string,
        nombreCorto: string
    ) => {
        console.log("Viendo el proyecto: ", nameProyecto, "con el id: ", idProyecto);
        const newValue = !verProyecto;
        localStorage.setItem("verProyecto", JSON.stringify(newValue));
        localStorage.setItem("nombreProyecto", nombreCorto);
        // Guardar el id del proyecto seleccionado en localStorage
        localStorage.setItem("idProyecto", idProyecto);
        if (!verProyecto) {
            setVerProyecto(true);
        } else {
            setVerProyecto(false);
        }
    };

    // Función para volver a la vista de periodos
    const volverAPeriodos = () => {
        // Limpia el periodo seleccionado
        localStorage.removeItem("periodoSeleccionado");
        // Setea verPeriodos en true para que al renderizar, muestre PeriodosConsejos
        setVerPeriodos(true);
    };

    // Función para crear un nuevo proyecto
    const nuevoProyecto = () => {
        console.log("Creando nuevo proyecto");
        const newValue = !mostrarFormulario;
        localStorage.setItem("mostrarFormulario", JSON.stringify(newValue));
        if (!mostrarFormulario) {
            setMostrarFormulario(true);
        } else {
            setMostrarFormulario(false);
        }
    };

    // 1. Si el usuario decidió “volver a períodos”, mostramos <PeriodosConsejos />
    if (verPeriodos) {
        return <PeriodosConsejos />;
    }

    // 2. Caso contrario, mostramos la vista de Proyectos normal
    return (
        <Stack space="space.100">
            {!verProyecto && (
                <h1 style={{ textAlign: "center" }}>Periodo {periodoElegido}</h1>
            )}

            {mostrarFormulario ? (
                <FormularioNuevaComision />
            ) : (
                <>
                    {verProyecto ? (
                        <Reuniones />
                    ) : (
                        <>
                            <h2 style={{ textAlign: "center" }}>Comisiones</h2>
                            {tipoDeUsuario === "profesor" && proyectosUser.length > 12 && (
                                <Button
                                    appearance="primary"
                                    onClick={nuevoProyecto}
                                    style={{ marginLeft: "15px", marginRight: "15px" }}
                                >
                                    + Añadir nueva comisión
                                </Button>
                            )}

                            {proyectosUser.map((proyectoUser) => (
                                <Box
                                    xcss={boxStyles}
                                    as="li"
                                    key={proyectoUser._id}
                                    onClick={() =>
                                        seleccionProyecto(
                                            proyectoUser._id,
                                            proyectoUser.name,
                                            proyectoUser.shortName
                                        )
                                    }
                                >
                                    <h4 style={{ marginTop: "13.5px", marginBottom: "13.5px" }}>
                                        {proyectoUser.shortName}
                                    </h4>
                                </Box>
                            ))}

                            {tipoDeUsuario === "profesor" && (
                                <Button
                                    appearance="primary"
                                    onClick={nuevoProyecto}
                                    style={{ marginLeft: "15px", marginRight: "15px" }}
                                >
                                    + Añadir nueva comisión
                                </Button>
                            )}

                            {/* Botón para volver a la vista de periodos */}
                            <Button
                                iconBefore={<ArrowLeftIcon label="" size="medium" />}
                                onClick={volverAPeriodos}
                                style={{ marginLeft: "15px", marginTop: "15px" }}
                            >
                                Periodos
                            </Button>
                        </>
                    )}
                </>
            )}
        </Stack>
    );
};

export default Proyectos;