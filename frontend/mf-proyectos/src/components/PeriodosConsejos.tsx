import React, { useEffect, useState } from "react";
import Button from "@atlaskit/button";
import { Stack } from "@atlaskit/primitives";
import Proyectos from "./Proyectos";
import axios from "axios"; // <-- Este es el nuevo componente que manejará las comisiones de un período

const fakePeriods = ["2023", "2024", "2025"];
const tokenUser = localStorage.getItem('tokenUser');

const PeriodosConsejos: React.FC = () => {
    const [periodos, setPeriodos] = useState<{
        _id: string, name:string,  commissions: string[], meetings: string[]
    }[]>([]);
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState<{  _id: string, name:string,  commissions: string[], meetings: string[] }>();

    useEffect(() => {
        // Simulamos carga de periodos (o podrías traerlos de un backend)
        try {
            const obtenerPeriodos = async () => {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/project/period`, {
                headers: {
                        Authorization: `Bearer ${tokenUser}`,
                    }});
                console.log("Periodos del consejo:", response.data);
                setPeriodos(response.data);
            };
            obtenerPeriodos()
        }catch (error) {
            console.error("Error al obtener los periodos:", error);
        }
    }, []);

    const seleccionarPeriodo = (periodo: string) => {
        // Guardamos el periodo en localStorage
        localStorage.setItem("periodoSeleccionado", periodo);
        // Y lo guardamos también en el estado local
        setPeriodoSeleccionado(JSON.parse(periodo));
    };


    // Si el usuario ya hizo clic en un período, mostramos la vista de comisiones
    if (periodoSeleccionado) {
        // @ts-ignore
        return <Proyectos periodo={periodoSeleccionado} />;
    }

    // Mientras no haya un período seleccionado, mostramos la lista de botones
    return (
        <div style={{ margin: "15px" }}>
            <h1>Periodos del Consejo</h1>
            <Stack space="space.100">
                {periodos.map((periodo) => (
                    <Button key={periodo._id} appearance="primary" onClick={() => seleccionarPeriodo(JSON.stringify(periodo))}>
                        {periodo.name}
                    </Button>
                ))}
            </Stack>
        </div>
    );
};

export default PeriodosConsejos;

