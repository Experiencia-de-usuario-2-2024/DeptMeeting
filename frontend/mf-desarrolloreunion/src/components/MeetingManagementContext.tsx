import React, {createContext, useEffect, useState} from "react";
import userServices from "../services/user.services";
import meetingServices from "../services/meeting.services";
import projectServices from "../services/project.services";
import meetingMinuteServices from "../services/meeting-minute.services";
import elementServices from "../services/element.services";

const MeetingManagementContext = createContext<any>(null);

export const MeetingManagementProvider = ({children}: {children: React.ReactNode}) => {
    const [perfil, setPerfil] = useState<any>(null);
    const [reunion, setReunion] = useState<any>(null);
    const [miembros, setMiembros] = useState<any>(null);
    const [proyecto, setProyecto] = useState<any>(null);
    const [acta, setActa] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {

        const idPerfil = localStorage.getItem("idPerfil");
        const idReunion = localStorage.getItem("idReunion");
        const correoUserOwner = localStorage.getItem('userOwner');
        const idProyecto = localStorage.getItem('idProyecto');

        if(!idPerfil || !idReunion || !correoUserOwner || !idProyecto) {
            setError("No se encontraron los datos necesarios para cargar el acta");
            setLoading(false);
            return;
        }
        const fetch = async () => {
            try {
                const [respPerfil, resMeeting, resMembers, resProject, resMeetingMinute] = await Promise.all([
                    userServices.get(idPerfil),
                    meetingServices.get(idReunion),
                    userServices.getUsersByOwnerEmail(correoUserOwner),
                    projectServices.get(idProyecto),
                    meetingMinuteServices.getByMeetingId(idReunion),
                ]);
                console.log("MM Perfil:", respPerfil);
                console.log("MM Reunion:", resMeeting);
                console.log("MM Miembros:", resMembers);
                console.log("MM Proyecto:", resProject);
                console.log("MM Acta:", resMeetingMinute);
                setPerfil(respPerfil);
                setReunion(resMeeting);
                setMiembros(resMembers);
                setProyecto(resProject);
                if(resMeetingMinute[0]){
                    const topicsInMeetingMinute = await meetingMinuteServices.getTopicsInMeetingMinuteByIds(resMeetingMinute[0].topics);
                    const updatedTopics = await Promise.all(topicsInMeetingMinute.map(async (topic: any) => {
                        topic.elements = await elementServices.getElementsInTopicsByIds(topic.elements);
                        return topic;
                    }));
                    setActa({...resMeetingMinute[0], topics: updatedTopics});
                }
                setError(null)
            } catch (error) {
                setError("Error al cargar el acta: " + error);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const value = {
        perfilState: { perfil, setPerfil },
        reunionState: { reunion, setReunion },
        miembrosState: { miembros, setMiembros },
        proyectoState: { proyecto, setProyecto },
        actaState: { acta, setActa },
        loadingState: { loading, setLoading },
        errorState: { error, setError }
    };

    return (
        <MeetingManagementContext.Provider value={ value }>
        {children}
        </MeetingManagementContext.Provider>
    );
}

export default MeetingManagementContext;