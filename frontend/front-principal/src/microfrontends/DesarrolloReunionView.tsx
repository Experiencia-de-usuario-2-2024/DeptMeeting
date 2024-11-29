import React, { lazy, Suspense } from "react";

// @ts-ignore
const FormularioPreReunion = lazy(() => import("MF_DESARROLLOREUNION/FormularioPreReunion").catch(error => {
    console.error('Error al cargar el microfrontend DesarrolloReunion', error);
    // Proporciona un componente alternativo o manejo de errores
    return { default: () => <div> <h1> Error al cargar el componente, favor consultar con el administrador </h1> </div> };
    })
);

const DesarrolloReunionView = () => {
    return (
        <div>
            <main>
                <div className="micomponentedos-div">
                    <Suspense fallback={<div>Cargando...</div>}>
                        <FormularioPreReunion />
                    </Suspense>
                </div>
            </main>
        </div>
    );

};

export default DesarrolloReunionView;