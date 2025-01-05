import React, { lazy, Suspense } from "react";

//@ts-ignore
const ActasPendientes = lazy(() => import("MF_DESARROLLOREUNION/ActasPendientes"));
const ActasPendientesView = () => {
    return (
        <div>
            <main>
                <div className="micomponentedos-div">
                    <Suspense fallback={<div>Cargando...</div>}>
                        <ActasPendientes/>
                    </Suspense>
                </div>
            </main>
        </div>
    );

};

export default ActasPendientesView;