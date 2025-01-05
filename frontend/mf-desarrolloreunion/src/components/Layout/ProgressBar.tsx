import React from "react";
import {ProgressTracker, Stages} from "@atlaskit/progress-tracker";

const ProgressBar = ({ reunionState }: { reunionState: string }) => {

    const items: Stages = [
        {
            id: 'nueva',
            label: 'Nueva',
            percentageComplete: 0,
            status: 'unvisited',
            href: '#',
        },
        {
            id: 'pre-reunion',
            label: 'Pre-reunión',
            percentageComplete: 0,
            status: 'unvisited',
            href: '#',
        },
        {
            id: 'en-reunion',
            label: 'En-reunión',
            percentageComplete: 0,
            status: 'unvisited',
            href: '#',
        },
        {
            id: 'post-reunion',
            label: 'Post-reunión',
            percentageComplete: 0,
            status: 'unvisited',
            href: '#',
        },
        {
            id: 'finalizar',
            label: 'Reunión finalizada',
            percentageComplete: 0,
            status: 'unvisited',
            href: '#',
        },
    ];

    const actualizarItems = () => {
        if (reunionState) {
            let actualizado = false;
            return items.map((item) => {
                const updatedItem = {...item};
                if (updatedItem.label === reunionState) {
                    updatedItem.status = 'current';
                    actualizado = true;
                } else if (!actualizado) {
                    updatedItem.status = 'disabled';
                    updatedItem.percentageComplete = 100;
                }
                return updatedItem;
            });
        }
        return items;
    };

    const itemsActualizados = actualizarItems();

    return (
        <ProgressTracker items={itemsActualizados} />
    );
}

export default ProgressBar;
