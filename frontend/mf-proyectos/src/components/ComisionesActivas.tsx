import React, {useEffect, useState} from "react";
import { Box, xcss } from "@atlaskit/primitives";
import InfoIcon from "@atlaskit/icon/glyph/info";
import axios from "axios";

// Estilos para el contenedor principal de las comisiones
const containerStyles = xcss({
    display: "flex",
    justifyContent: "space-between", // El texto queda a la izquierda y las comisiones a la derecha
    alignItems: "center",
    backgroundColor: "#E6F6F4", // Color personalizado
    paddingBlock: "space.200",
    paddingInline: "space.300",
    border: "1px solid",
    borderColor: "#00A499",
});

// Estilos para el contenedor de las comisiones
const comisionesContainerStyles = xcss({
    display: "flex",
    gap: "space.200", // Espaciado entre las comisiones
    flexWrap: "wrap", // Permite que las comisiones salten a la siguiente línea si no hay espacio
});

// Estilos individuales de cada comisión
const comisionStyles = xcss({
    color: "#00A499",
    backgroundColor: "elevation.surface",
    borderRadius: "border.radius.200",
    boxShadow: "elevation.shadow.overlay",
    paddingBlock: "space.150",
    paddingInline: "space.200",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    transition: "transform 0.2s ease-in-out",
    ":hover": {
        transform: "scale(1.05)",
        boxShadow: "elevation.shadow.raised",
    },
});

// Interfaz para las comisiones activas
interface ComisionActiva {
    id: string;
    name: string;
    description: string;
    createdAt: string;
}
const ComisionesActivas: React.FC = () => {
    const [comisiones, setComisiones] = useState<ComisionActiva[]>([]);
    const tokenUser = localStorage.getItem("tokenUser");

    useEffect(() => {
        const fetchComisionesActivas = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/api/comisiones/activas`,
                    {
                        headers: {
                            Authorization: `Bearer ${tokenUser}`,
                        },
                    }
                );
                setComisiones(response.data);
            } catch (error) {
                console.error("Error al obtener las comisiones activas:", error);
            }
        };

        fetchComisionesActivas();
    }, [tokenUser]);

    const seleccionarComision = (comisionId: string) => {
        console.log(`Comisión seleccionada: ${comisionId}`);
        // Aquí puedes redirigir o mostrar detalles de la comisión seleccionada
    };

    return (
        <Box xcss={containerStyles} as="div">
            <h3 style={{ fontWeight: "bold", color: "black", margin: 0 }}>
                Comisiones Activas
            </h3>
            <Box xcss={comisionesContainerStyles} as="div">
                {comisiones.length > 0 ? (
                    comisiones.map((comision) => (
                        <Box
                            xcss={comisionStyles}
                            key={comision.id}
                            onClick={() => seleccionarComision(comision.id)}
                        >
                            {comision.name}
                            <Box>
                                <InfoIcon label="Información" size="medium" />
                            </Box>
                        </Box>
                    ))
                ) : (
                    <Box xcss={comisionStyles}>
                        No hay comisiones activas
                    </Box>
                )}
            </Box>
        </Box>
    );
};


export default ComisionesActivas;
/*const ComisionesActivas: React.FC = () => {
    const comisiones: ComisionActiva[] = [
        { id: "1", name: "Comisión 1", status: "Activa" },
        { id: "2", name: "Comisión 2", status: "Activa" },
        { id: "3", name: "Comisión 3", status: "Activa" },
        { id: "4", name: "Comisión 4", status: "Activa" },
    ];

    const seleccionarComision = (comisionId: string) => {
        console.log(`Comisión seleccionada: ${comisionId}`);
    };

    return (
        <Box xcss={containerStyles} as="div">

            <h3 style={{ fontWeight: "bold", color: "black", margin: 0 }}>
                Comisiones Activas
            </h3>

            <Box xcss={comisionesContainerStyles} as="div">
                {comisiones.map((comision) => (
                    <Box
                        xcss={comisionStyles}
                        key={comision.id}
                        onClick={() => seleccionarComision(comision.id)}
                    >
                        {comision.name}
                        <Box>

                        <WarningIcon label="Advertencia" size="small"  />
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default ComisionesActivas;*/
