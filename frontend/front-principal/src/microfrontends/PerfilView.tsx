import React, { useState, lazy, Suspense, useEffect } from "react";

// @ts-ignore
const Perfil = lazy(() => import("MF_PERFIL/Perfil").catch(error => {
    console.error('Error al cargar el microfrontend Perfil', error);
    // Proporciona un componente alternativo o manejo de errores
    return { default: () => <div> <h1> Error al cargar el componente, favor consultar con el administrador </h1> </div> };
    })
);


const PerfilView = () => {
    return (
        <div>
            <main>
                <div className="micomponentedos-div">
                    <Suspense fallback={<div>Cargando...</div>}>
                        <Perfil />
                    </Suspense>
                </div>
            </main>
        </div>
    );
};

export default PerfilView;