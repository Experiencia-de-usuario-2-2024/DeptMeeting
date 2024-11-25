import React, { useState, lazy, Suspense, useEffect } from "react";

// @ts-ignore
const Login = lazy(() => import("MF_LOGIN/Login").catch(error => {
    console.error('Error al cargar el microfrontend Login', error);
    // Proporciona un componente alternativo o manejo de errores
    return { default: () => <div> <h1> Error al cargar el componente, favor consultar con el administrador </h1> </div> };
    })
);


const LoginView = () => {
    return (
        <div>
            <main>
                <div className="micomponentedos-div">
                    <Suspense fallback={<div>Cargando...</div>}>
                        <Login/>
                    </Suspense>
                </div>
            </main>
        </div>
    );
};

export default LoginView;