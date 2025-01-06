import React, {useContext, useState, useEffect} from "react";
import MeetingManagementContext from "./MeetingManagementContext";
import {Box, Inline, xcss} from "@atlaskit/primitives";
import AvatarGroup from "@atlaskit/avatar-group";
import Popup from "@atlaskit/popup";
import MessagesInput from "./MessageInput";
import Messages from "./Messages";
import Button from "@atlaskit/button";
import CommentIcon from "@atlaskit/icon/glyph/comment";
import {ProgressTracker, Stages} from "@atlaskit/progress-tracker";
import WarningIcon from "@atlaskit/icon/glyph/warning";
import Tooltip, {TooltipPrimitive} from "@atlaskit/tooltip";
import styled from "@emotion/styled";
import {token} from "@atlaskit/tokens";
import MeetingLayout from "./Layout/MeetingLayout";

const MeetingManagement = () => {
    const {
        reunionState,
        miembrosState,
        proyectoState,
        actaState,
        loadingState,
        errorState
    } = useContext(MeetingManagementContext);

    const { reunion, setReunion } = reunionState;
    const { miembros, setMiembros } = miembrosState;
    const { proyecto, setProyecto } = proyectoState;
    const { acta, setActa } = actaState;
    const { loading, setLoading } = loadingState;
    const { error, setError } = errorState;

    console.log("Reunion:", reunion);
    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const contentStyles = xcss({
        padding: 'space.200',
        width: '600px',
        // height: '200px',

    });

    const InlineDialog = styled(TooltipPrimitive)({
        background: 'white',
        width: '600px',
        borderRadius: token('border.radius', '4px'),
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
        boxSizing: 'content-box',
        padding: `${token('space.100', '8px')} ${token('space.150', '12px')}`,
    });

    return (
        <div>
            <MeetingLayout/>
            <h1>Acta de la reunión {reunion?.name}</h1>
            <h2>Proyecto: {proyecto?.name}</h2>
            <h3>Fecha: {reunion?.date}</h3>
            <h3>Participantes:</h3>
            <ul>
                {miembros?.map((miembro: any) => (
                    <li key={miembro.id}>{miembro.name}</li>
                ))}
            </ul>
            <h3>Acta:</h3>
            <ul>
                {acta?.topics?.map((topic: any) => (
                    <li key={topic.id}>
                        <h4>{topic.title}</h4>
                        <ul>
                            {topic.elements?.map((element: any) => (
                                <li key={element.id}>{element.content}</li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MeetingManagement;