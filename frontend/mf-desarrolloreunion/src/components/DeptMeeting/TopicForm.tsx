import React, {useState, useEffect, ChangeEvent, useCallback} from "react";
import Modal, {ModalBody, ModalFooter, ModalHeader, ModalTitle, ModalTransition} from "@atlaskit/modal-dialog";
import Form, {Field} from "@atlaskit/form";
import Button from "@atlaskit/button";
import { Checkbox } from "@atlaskit/checkbox";
import TextField from "@atlaskit/textfield";
import meetingMinuteServices from "../../services/meeting-minute.services";


interface TopicFormProps {
    closeModal: () => void;
    idMeetingMinute?: string;
    topic?: {
        _id: string;
        description: string;
        proposed: string;
        accepted?: string;
        inMeetingMinute: boolean;
    }
    type: string;
    setTopic: (data: any) => void;
    isTopic?: boolean
}

const TopicForm: React.FC<TopicFormProps> = ({ closeModal, idMeetingMinute, topic, type, setTopic, isTopic}) => {
    const [formState, setFormState] = useState({
        _id: '',
        description: '',
        proposed: '',
        accepted: '',
        inMeetingMinute: false
    });
    const [isChecked, setIsChecked] = useState(isTopic || topic?.inMeetingMinute);

    console.log("Es tema (in topicForm)",isTopic);

    const saveForm = (data) => {
        if (topic) {
            console.log('data', data);
            meetingMinuteServices.updateTopic(formState._id, {description: data.description, inMeetingMinute: isChecked})
                .then((response) => {
                    setFormState(response);
                    setTopic(response);
                    closeModal();
                })
                .catch((error) => {
                    console.error("Error al actualizar el tema", error);
                });
        }else {
            meetingMinuteServices.createTopic(idMeetingMinute, {description: data.description, inMeetingMinute: isChecked})
                .then((response) => {
                    setFormState(response);
                    setTopic(response);
                    closeModal();
                })
                .catch((error) => {
                    console.error("Error al crear el tema", error);
                });
        }

    }

    const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setIsChecked((current) => !current);
    }, []);

    useEffect(() => {
        if (topic) setFormState(topic);
    }, [topic]);

    return (
        <ModalTransition>
            <Modal onClose={closeModal} shouldScrollInViewport>
                <Form<{ description: string; inMeetingMinute: boolean}>
                    onSubmit={(data) => {
                        console.log('form data topic', data);
                        saveForm(data);
                    }}
                >
                    {/* <form> */}
                    {({formProps, submitting}) => (

                        <form {...formProps} >

                            <ModalHeader>
                                <ModalTitle>Añadir Tema</ModalTitle>
                            </ModalHeader>
                            <ModalBody>
                                <Field
                                    aria-required={true}
                                    name="description"
                                    defaultValue={formState?.description || ""}
                                    label="Tema que se abordará en la reunión"
                                    isRequired
                                >
                                    {({ fieldProps, error, valid }) => <TextField {...fieldProps} />}
                                </Field>

                                <Field name="inMeetingMinute">
                                    {({ fieldProps }) => (
                                        <Checkbox
                                            {...fieldProps}
                                            isChecked={isChecked}
                                            onChange={onChange}
                                            label="¿Será un tema para el acta?"
                                        />
                                    )}
                                </Field>
                            </ModalBody>

                            <ModalFooter>
                                <Button appearance="subtle" onClick={closeModal}>
                                    Cancelar
                                </Button>
                                <Button appearance="primary" type="submit" isLoading={submitting}>
                                    {type}
                                </Button>
                            </ModalFooter>
                        </form>
                    )}
                </Form>
            </Modal>
        </ModalTransition>
    );
}

export default TopicForm;