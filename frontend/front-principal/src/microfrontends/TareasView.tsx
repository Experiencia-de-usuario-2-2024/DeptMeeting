import React, { lazy, Suspense } from "react";

// @ts-ignore
const Tareas = lazy(() => import("MF_TAREAS/Tareas").catch(error => {
    console.error('Error al cargar el microfrontend Tareas', error);
    // Proporciona un componente alternativo o manejo de errores
    return { default: () => <div> <h1> Error al cargar el componente, favor consultar con el administrador </h1> </div> };
    })
);


const TareasView = () => {
    return (
        <div>
            <main>
                <div className="micomponentedos-div">
                    <Suspense fallback={<div>Cargando...</div>}>
                        <Tareas />
                    </Suspense>
                </div>
            </main>
        </div>
    );
};

export default TareasView;