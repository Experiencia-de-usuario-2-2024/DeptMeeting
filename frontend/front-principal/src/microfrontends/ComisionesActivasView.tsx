import React, { lazy, Suspense } from "react";

//@ts-ignore
const ComisionesActivas = lazy(() => import("MF_PROYECTOS/ComisionesActivas"));
const ComisionesActivasView = () => {
    return (
        <div>
            <main>
                <div className="micomponentedos-div">
                    <Suspense fallback={<div>Cargando...</div>}>
                        <ComisionesActivas/>
                    </Suspense>
                </div>
            </main>
        </div>
    );

};

export default ComisionesActivasView;