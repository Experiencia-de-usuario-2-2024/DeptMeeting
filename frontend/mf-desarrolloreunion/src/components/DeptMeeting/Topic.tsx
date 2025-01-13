import React, {useState, useEffect, useCallback} from "react";
import {Inline} from "@atlaskit/primitives";
import Button from "@atlaskit/button";
import TrashIcon from "@atlaskit/icon/glyph/trash";
import meetingMinuteServices from "../../services/meeting-minute.services";
import TopicForm from "./TopicForm";

interface TopicProps {
    topic: {
        _id: string;
        description: string;
        proposed: string;
        accepted?: string;
        inMeetingMinute: boolean;
    };
    index: number;
    removeTopic: (id: string) => void;
    updateTopicSugerencia: (id: string, inMeetingMinute: boolean) => void;
}

const Topic: React.FC<TopicProps> = ({ topic, index, removeTopic, updateTopicSugerencia}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [topicState, setTopicState] = useState(topic);
    const openModal = useCallback(() => setIsOpen(true), []);
    const closeModal = useCallback(() => setIsOpen(false), []);

    const deleteTopic = () => {
        meetingMinuteServices.deleteTopic(topic._id)
            .then((response) => {
                console.log("Se ha eliminado correctamente:", response);
                removeTopic(topic._id);
            })
            .catch((error) => {
                console.log("Error:", error);
            })
    }

    const updateTopic = (data) => {
        console.log('data in topic', data);
        setTopicState(data);
        updateTopicSugerencia(data._id, data.inMeetingMinute);
    }

    return (
        <>
            <div>
                <Inline>
                    <div>
                        <h2>
                            {index + 1}. {topicState.description}
                        </h2>
                        <p>Propuesto por: {topicState.proposed}</p>
                        {topicState.inMeetingMinute && topicState.accepted ? (
                            <p>Aceptado por: {topicState.accepted}</p>
                        ) : null}
                    </div>
                    <Button appearance="subtle" style={{ marginTop: '17px', marginLeft: '5px' }} onClick={openModal}>
                        Editar
                    </Button>
                    <Button iconBefore={<TrashIcon label="" size="medium" />} style={{ marginTop: '17px', marginRight: '5px' }} appearance="danger" onClick={deleteTopic}>
                        Borrar Tema
                    </Button>
                </Inline>
            </div>
            {isOpen && (
                <TopicForm closeModal={closeModal} topic={topicState} setTopic={updateTopic} type={"Actualizar"}/>)
            }
        </>
    );
};

export default Topic;