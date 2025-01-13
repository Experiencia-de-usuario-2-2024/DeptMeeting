import React, { useEffect, useState } from "react";
import Button from "@atlaskit/button";
import { Stack } from "@atlaskit/primitives";
import Proyectos from "./Proyectos";
import projectServices from "../services/project.services";

const PeriodosConsejos: React.FC = () => {
    const [periodos, setPeriodos] = useState<any[]>([]);
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState<any>(null);

    useEffect(() => {
        const fetchPeriodos = async () => {
            const periodos = await projectServices.getPeriods();
            console.log("Periodos: ", periodos);
            setPeriodos(periodos);
        }

        fetchPeriodos()
    }, []);

    const seleccionarPeriodo = (periodo: any) => {
        // Guardamos el periodo en localStorage
        console.log(periodo);
        localStorage.setItem("periodoSeleccionado", periodo._id);
        // Y lo guardamos también en el estado local
        console.log("Periodo seleccionado: ", periodo);
        setPeriodoSeleccionado(periodo);
    };


    // Si el usuario ya hizo clic en un período, mostramos la vista de comisiones
    if (!!periodoSeleccionado) {
        // @ts-ignore
        return <Proyectos periodo={periodoSeleccionado} />;
    }

    // Mientras no haya un período seleccionado, mostramos la lista de botones
    return (
        <div style={{ margin: "15px" }}>
            <h1>Periodos del Consejo</h1>
            <Stack space="space.100">
                {periodos.map((periodo) => (
                    <Button key={periodo.name} appearance="primary" onClick={() => seleccionarPeriodo(periodo)}>
                        {periodo.name}
                    </Button>
                ))}
            </Stack>
        </div>
    );
};

export default PeriodosConsejos;

