import React, { useEffect, useState } from "react";
import Button from "@atlaskit/button";
import { Stack } from "@atlaskit/primitives";
import Proyectos from "./Proyectos"; // <-- Este es el nuevo componente que manejará las comisiones de un período

const fakePeriods = ["2023", "2024", "2025"];

const PeriodosConsejos: React.FC = () => {
    const [periodos, setPeriodos] = useState<string[]>([]);
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState<string | null>(null);

    useEffect(() => {
        // Simulamos carga de periodos (o podrías traerlos de un backend)
        setTimeout(() => {
            setPeriodos(fakePeriods);
        }, 500);
    }, []);

    const seleccionarPeriodo = (periodo: string) => {
        // Guardamos el periodo en localStorage
        localStorage.setItem("periodoSeleccionado", periodo);
        // Y lo guardamos también en el estado local
        setPeriodoSeleccionado(periodo);
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
                    <Button key={periodo} appearance="primary" onClick={() => seleccionarPeriodo(periodo)}>
                        {periodo}
                    </Button>
                ))}
            </Stack>
        </div>
    );
};

export default PeriodosConsejos;

