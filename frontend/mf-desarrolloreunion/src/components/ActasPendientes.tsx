import React, {useEffect, useState} from "react";
import { Box, xcss } from "@atlaskit/primitives";
import EditIcon from "@atlaskit/icon/glyph/edit"; // Ícono de edición
import axios from "axios";

// Estilos para el contenedor principal de las actas
const containerStyles = xcss({
    display: "flex",
    justifyContent: "space-between", // El texto queda a la izquierda y las comisiones a la derecha
    alignItems: "center",
    backgroundColor: "#CCE0FF", // Color personalizado
    paddingBlock: "space.200",
    paddingInline: "space.300",
    border: "1px solid",
    borderColor: "color.border.accent.blue",
});


// Estilos para el contenedor de la lista de actas
const actasContainerStyles = xcss({
    display: "flex",
    gap: "space.200", // Espaciado entre las actas
    flexWrap: "wrap", // Permite que las actas salten a la siguiente línea si no hay espacio
});

// Estilos individuales de cada acta
const actaStyles = xcss({
    color: "color.text.accent.blue.bolder",
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

// Interfaz para las actas pendientes
interface ActaPendiente {
    id: string;
    name: string;
    status: string;
}

const ActasPendientes: React.FC = () => {
    const [actas, setActas] = useState<ActaPendiente[]>([]);
    const tokenUser = localStorage.getItem("tokenUser");

    useEffect(() => {
        const fetchActasFinalizadas = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_GATEWAY}/api/meeting-minute/finalized`,
                    {
                        headers: {
                            Authorization: `Bearer ${tokenUser}`,
                        },
                    }
                );
                const actasFinalizadas = response.data.map((acta: any) => ({
                    id: acta._id,
                    name: `Acta ${acta.number}`,
                    status: "Finalizada",
                }));
                setActas(actasFinalizadas);
            } catch (error) {
                console.error("Error al obtener las actas finalizadas:", error);
            }
        };

        fetchActasFinalizadas();
    }, [tokenUser]);

    const seleccionarActa = (actaId: string) => {
        console.log(`Acta seleccionada: ${actaId}`);
        // Aquí puedes redirigir o mostrar detalles del acta seleccionada
    };

    return (
        <Box xcss={containerStyles} as="div">
            <h3 style={{ fontWeight: "bold", color: "black", margin: 0 }}>
                Actas Finalizadas
            </h3>
            <Box xcss={actasContainerStyles} as="div">
                {actas.map((acta) => (
                    <Box
                        xcss={actaStyles}
                        key={acta.id}
                        onClick={() => seleccionarActa(acta.id)}
                    >
                        {acta.name}
                        <Box>
                            <EditIcon label="Ver acta" size="medium" />
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default ActasPendientes;

/*const ActasPendientes: React.FC = () => {
    const actas: ActaPendiente[] = [
        { id: "8", name: "Acta 8", status: "Pendiente" },
        { id: "14", name: "Acta 14", status: "Pendiente" },
        { id: "16", name: "Acta 16", status: "Pendiente" },
    ];

    const seleccionarActa = (actaId: string) => {
        console.log(`Acta seleccionada: ${actaId}`);
    };

    return (
        <Box xcss={containerStyles} as="div">
            <h3 style={{ fontWeight: "bold", color: "black", margin: 0 }}>
                Actas no aprobadas
            </h3>
            <Box xcss={actasContainerStyles} as="div">
                {actas.map((acta) => (
                    <Box
                        xcss={actaStyles}
                        key={acta.id}
                        onClick={() => seleccionarActa(acta.id)}
                    >
                        {acta.name}
                        <Box
                        >
                            <EditIcon label="Editar acta" size="medium" />
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default ActasPendientes;*/
