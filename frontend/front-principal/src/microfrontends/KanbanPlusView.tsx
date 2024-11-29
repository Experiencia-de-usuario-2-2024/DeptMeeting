import React, { lazy, Suspense } from "react";


// @ts-ignore
const KanbanPlus = lazy(() => import("MF_KANBANPLUS/KanbanPlus").catch(error => {
    console.error('Error al cargar el microfrontend KanbanPlus', error);
    // Proporciona un componente alternativo o manejo de errores
    return { default: () => <div> <h1> Error al cargar el componente, favor consultar con el administrador </h1> </div> };
    })
);


const KanbanPlusView = () => {
    return (
        <div>
            <main>
                <div className="micomponentedos-div">
                    <Suspense fallback={<div>Cargando...</div>}>
                        <KanbanPlus />
                    </Suspense>
                </div>
            </main>
        </div>
    );
};

export default KanbanPlusView;