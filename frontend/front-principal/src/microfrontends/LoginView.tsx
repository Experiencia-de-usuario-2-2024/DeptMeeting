import React, { lazy, Suspense } from "react";

const Auth = lazy(() => import("MF_LOGIN/Login").catch(error => {
  console.error('Error al cargar el microfrontend Auth', error);
  return { default: () => <div><h1>Error al cargar el componente, favor consultar con el administrador</h1></div> };
}));

const LoginView = () => {
  return (
    <div>
      <main>
        <div className="micomponentedos-div">
          <Suspense fallback={<div>Cargando...</div>}>
            <Auth />
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default LoginView;