import React, {useState, useEffect, useCallback} from "react";
import Modal, {ModalBody, ModalFooter, ModalHeader, ModalTitle, ModalTransition} from "@atlaskit/modal-dialog";
import Form, {Field} from "@atlaskit/form";
import Button from "@atlaskit/button";
import TextField from "@atlaskit/textfield";
import meetingMinuteServices from "../../services/meeting-minute.services";


interface TopicFormProps {
    closeModal: () => void;
    idMeetingMinute: string
    topic?: {
        _id: string;
        description: string;
        proposed: string;
        accepted?: string;
        inMeetingMinute: boolean;
    }
}

const TopicForm: React.FC<TopicFormProps> = ({ closeModal, idMeetingMinute, topic}) => {
    const [formState, setFormState] = useState({
        _id: '',
        description: '',
        proposed: '',
        accepted: '',
        inMeetingMinute: false
    });

    const saveForm = (data) => {
        if (topic) {
            meetingMinuteServices.updateTopic(formState._id, data)
                .then((response) => {
                    setFormState(response);
                    closeModal();
                })
                .catch((error) => {
                    console.error("Error al actualizar el tema", error);
                });
        }else {
            meetingMinuteServices.createTopic(idMeetingMinute, data)
                .then((response) => {
                    setFormState(response);
                    closeModal();
                })
                .catch((error) => {
                    console.error("Error al crear el tema", error);
                });
        }
    }

    useEffect(() => {
        if (topic) setFormState(topic);
    }, [topic]);

    return (
        <ModalTransition>
            <Modal onClose={closeModal} shouldScrollInViewport>
                <Form<{ temas: string }>
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
                                    name="temas"
                                    defaultValue={topic?.description || ""}
                                    label="Tema que se abordará en la reunión"
                                    isRequired
                                >
                                    {({ fieldProps, error, valid }) => <TextField {...fieldProps} />}
                                </Field>
                            </ModalBody>

                            <ModalFooter>
                                <Button appearance="subtle" onClick={closeModal}>
                                    Cancelar
                                </Button>
                                <Button appearance="primary" type="submit" isLoading={submitting}>
                                    Añadir
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