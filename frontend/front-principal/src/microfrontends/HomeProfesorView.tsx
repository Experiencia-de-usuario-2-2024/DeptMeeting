import React, { lazy, Suspense } from "react";

// @ts-ignore
const HomeProfesor = lazy(() => import("MF_HOME/HomeProfesor").catch(error => {
    console.error('Error al cargar el microfrontend HomeProfesor', error);
    // Proporciona un componente alternativo o manejo de errores
    return { default: () => <div> <h1> Error al cargar el componente, favor consultar con el administrador </h1> </div> };
    })
);

const HomeProfesorView = () => {
    return (
        <div>
            <main>
                <div className="micomponentedos-div">
                    <Suspense fallback={<div>Cargando...</div>}>
                        <HomeProfesor />
                    </Suspense>
                </div>
            </main>
        </div>
    );
};

export default HomeProfesorView;