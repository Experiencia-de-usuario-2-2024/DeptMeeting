import React, {useState, useEffect, useCallback} from "react";
import {Inline} from "@atlaskit/primitives";
import Button from "@atlaskit/button";
import TrashIcon from "@atlaskit/icon/glyph/trash";
import meetingMinuteServices from "../../services/meeting-minute.services";

interface TopicProps {
    topic: {
        _id: string;
        description: string;
        proposed: string;
        accepted?: string;
        inMeetingMinute: boolean;
    };
    index: number;
}

const Topic: React.FC<TopicProps> = ({ topic, index }) => {
    const [isOpen, setIsOpen] = useState(false);
    const openModal = useCallback(() => setIsOpen(true), []);
    const closeModal = useCallback(() => setIsOpen(false), []);

    const deleteTopic = () => {
        meetingMinuteServices.deleteTopic(topic._id)
            .then((response) => {
                console.log("Se ha eliminado correctamente:", response);
            })
            .catch((error) => {
                console.log("Error:", error);
            })
    }

    return (
        <div>
            <Inline>
                <div>
                    <h1>
                        {index + 1}. {topic.description}
                    </h1>
                    <p>Propuesto por: {topic.proposed}</p>
                    {topic.inMeetingMinute && topic.accepted ? (
                        <p>Aceptado por: {topic.accepted}</p>
                    ) : null}
                </div>
                <Button appearance="subtle" onClick={openModal}>
                    Editar
                </Button>
                <Button iconBefore={<TrashIcon label="" size="medium" />} appearance="danger" onClick={deleteTopic}>
                    Borrar Tema
                </Button>
            </Inline>
        </div>
    );
};

export default Topic;