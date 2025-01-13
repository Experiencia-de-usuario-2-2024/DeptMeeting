import React, {useContext, useEffect} from "react";
import MeetingManagementContext from "../MeetingManagementContext";
import Form from "@atlaskit/form";

const FormularioPreReunion = () => {
    const {reunionState} = useContext(MeetingManagementContext);
    const {reunion, setReunion} = reunionState;

    return (
        <Form>

        </Form>
    );
}