import React, { lazy, Suspense } from "react";

// @ts-ignore
const Proyectos = lazy(() => import("MF_PROYECTOS/Proyectos").catch(error => {
    console.error('Error al cargar el microfrontend Proyectos', error);
    // Proporciona un componente alternativo o manejo de errores
    return { default: () => <div> <h1> Error al cargar el componente, favor consultar con el administrador </h1> </div> };
    })
);


const ProyectosView = () => {


    return (
        <div>
            <main>
                <div className="micomponentedos-div">
                    <Suspense fallback={<div>Cargando...</div>}>
                        <Proyectos />
                    </Suspense>
                </div>
            </main>
        </div>
    );

};

export default ProyectosView;