import React, { lazy, Suspense } from "react";


// @ts-ignore
const PeriodosConsejos = lazy(() => import("MF_PROYECTOS/PeriodosConsejos").catch(error => {
        console.error('Error al cargar el microfrontend Proyectos', error);
        // Proporciona un componente alternativo o manejo de errores
        return { default: () => <div> <h1> Error al cargar el componente , periodos</h1> </div> };
    })
);


const PeriodosConsejosView = () => {
    return (
        <div>
            <main>
                <div className="micomponentedos-div">
                    <Suspense fallback={<div>Cargando Microfrontend...</div>}>
                        {/* Primero PeriodosConsejos */}
                        <PeriodosConsejos />
                    </Suspense>
                </div>
            </main>
        </div>
    );
};

export default PeriodosConsejosView ;
