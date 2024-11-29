import React, { lazy, Suspense } from "react";

// @ts-ignore
const Informacion = lazy(() => import("MF_INFORMACION/Informacion").catch(error => {
    console.error('Error al cargar el microfrontend Informacion', error);
    // Proporciona un componente alternativo o manejo de errores
    return { default: () => <div> <h1> Error al cargar el componente, favor consultar con el administrador </h1> </div> };
    })
);


const InformacionView = () => {
    return (
        <div>
            <main>
                <div className="micomponentedos-div">
                    <Suspense fallback={<div>Cargando...</div>}>
                        <Informacion />
                    </Suspense>
                </div>
            </main>
        </div>
    );
};

export default InformacionView;