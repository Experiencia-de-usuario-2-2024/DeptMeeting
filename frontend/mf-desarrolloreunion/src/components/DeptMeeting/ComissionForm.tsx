import React, {useState} from 'react';
import Modal, {ModalBody, ModalFooter, ModalHeader, ModalTitle, ModalTransition} from "@atlaskit/modal-dialog";
import Form, { Field, FormFooter } from '@atlaskit/form';
import {Checkbox} from "@atlaskit/checkbox";
import Button, { ButtonGroup } from '@atlaskit/button';
import LoadingButton from '@atlaskit/button/loading-button';
import TextField from '@atlaskit/textfield';
import TextArea from '@atlaskit/textarea';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left'
import Select, { ActionMeta, PropsValue } from 'react-select';


interface ComissionFormProps {
    participants: string[];
    closeModal: () => void;
}

const ComissionForm: React.FC<ComissionFormProps> = ({participants, closeModal}) => {

    const [isLoading, setIsLoading] = useState(false);

    interface Participant {
        email: string;
        value: string;
        label: string;
    }

    const ShortNameField = () => (
        <Field
            aria-required={true}
            name="shortName"
            defaultValue=""
            label="Nombre abreviado de la comisión"
            isRequired
        >
            {({ fieldProps, error, valid }) => <TextField {...fieldProps} />}
        </Field>
    );
    const Name = () => (
        <Field
            aria-required={true}
            name="name"
            defaultValue=""
            label="Nombre de la comisión"
            isRequired
        >
            {({ fieldProps, error, valid }) => <TextField {...fieldProps} />}
        </Field>
    );

    const DescripcionVer2 = () => (
        <Field
            aria-required={true}
            name="descriptionVer2"
            defaultValue=""
            label="Descripción de la comision"
            isRequired
        >
            {({ fieldProps }) => <TextArea {...fieldProps} onChange={(event) => fieldProps.onChange(event.target.value)} />}
        </Field>
    );

    const UserOwner = () => (
        <Field
            aria-required={true}
            name="userOwner"
            label="Dueño/a del proyecto (correo electrónico)"
            isRequired
        >
            {({ fieldProps, error, valid }) => <TextField {...fieldProps} />}
        </Field>
    );

    const UserMember = () => {
        const [selectedParticipant, setSelectedParticipant] = useState<PropsValue<Participant>>([]);
        return (
            <Field
                aria-required={true}
                name="userMember"
                defaultValue={selectedParticipant}
                label="Miembros del proyecto"
                isRequired
            >
                {({ fieldProps }) =>
                    (
                        <Select
                            {...fieldProps}
                            isMulti
                            options={participants.map((participant) => ({ value: participant, label: participant, email: participant }))}
                            value={selectedParticipant}
                            onChange={(newValue: PropsValue<Participant>, actionMeta: ActionMeta<Participant>) => {
                                setSelectedParticipant(newValue);
                                // Handle the onChange event here
                                console.log(newValue);
                            }}
                            placeholder="Seleccione..."
                        />
                    )}
            </Field>
        );
    };

    const crearProyecto = (data: any) => {
        setIsLoading(true);
        if (data)
        console.log("creando proyecto...");
    }

    return (
        <ModalTransition>
            <Modal onClose={closeModal} shouldScrollInViewport>
                <Form<{ username: string }>
                    onSubmit={(data) => {
                        console.log('form data', data);
                        crearProyecto(data)
                    }}
                >
                    {({formProps}) => (
                        <form {...formProps}>
                            <ModalHeader>
                                <ModalTitle>Crear Comision</ModalTitle>
                            </ModalHeader>
                            <ModalBody>
                                <Name/>
                                <ShortNameField/>
                                <DescripcionVer2/>
                                <UserOwner/>
                                <UserMember/>
                            </ModalBody>
                            <ModalFooter>
                                <LoadingButton
                                    type="submit"
                                    appearance="primary"
                                    isLoading={isLoading}
                                    style={{marginLeft: '5px'}}
                                >
                                    Crear comisión
                                </LoadingButton>
                            </ModalFooter>
                        </form>
                    )}
                </Form>
            </Modal>
        </ModalTransition>
    );
}

export default ComissionForm;