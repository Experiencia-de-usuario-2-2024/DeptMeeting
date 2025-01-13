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
import {DatePicker} from "@atlaskit/datetime-picker";
import projectServices from "../../services/project.services";


interface ComissionFormProps {
    participants: string[];
    closeModal: () => void;
    period: string;
    topic: string;
    agregarComision: (comision: any) => void;
}

const ComissionForm: React.FC<ComissionFormProps> = ({participants, closeModal, period, topic, agregarComision}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<any>({
        name: '',
        shortName: '',
        descriptionVer2: '',
        userOwner: '',
        userMember: []
    });

    const obtenerDato = (nombre: string) => {
        return [...document.getElementsByName(nombre)].map((element: any) => (element as HTMLInputElement).value);
    }

    const ShortNameField = () => (
        <Field
            aria-required={true}
            name="shortName"
            defaultValue={formData.shortName}
            label="Nombre abreviado de la comisión"
            isRequired
        >
            {({ fieldProps }) =>
                <TextField {...fieldProps}
                />
            }
        </Field>
    );
    const Name = () => (
        <Field
            aria-required={true}
            name="name"
            defaultValue={formData.name}
            label="Nombre de la comisión"
            isRequired
        >
            {({ fieldProps}) =>
                <TextField {...fieldProps}
                />
            }
        </Field>
    );

    const DescripcionVer2 = () => (
        <Field
            aria-required={true}
            name="descriptionVer2"
            defaultValue={formData.descriptionVer2}
            label="Descripción de la comision"
            isRequired
        >
            {({ fieldProps}) =>
                <TextArea
                    {...fieldProps}
                />
            }
        </Field>
    );

    const UserOwner = () => (
        <Field
            aria-required={true}
            name="userOwner"
            label="Dueño/a del proyecto (correo electrónico)"
            isRequired
        >
            {({ fieldProps }) =>
                <TextField {...fieldProps}
                />
            }
        </Field>
    );

    const [selectedOption, setSelectedOption] = useState<any>([]);
    const UserMember = () => {
        return (
            <Field
                aria-required={true}
                name="userMember"
                label="Miembros del proyecto"
                isRequired
            >
                {({ fieldProps }) =>
                    (
                        <Select
                            {...fieldProps}
                            isMulti
                            options={participants.map((participant) => ({ value: participant, label: participant, email: participant }))}
                            value={selectedOption}
                            onChange={(newValue: PropsValue<any>, actionMeta: ActionMeta<any>) => {
                                console.log("newValue", newValue);
                                setSelectedOption(newValue);
                            }}
                            placeholder="Seleccione..."
                        />
                    )}
            </Field>
        );
    };

    const formatDate = (isoString: string): string => {
        const date = new Date(isoString);
        console.log("date", date);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear());
        return `${day}-${month}-${year}`;
    };

    const crearProyecto = async () => {
        setIsLoading(true);
        const name = obtenerDato("name")[0];
        const shortName = obtenerDato("shortName")[0];
        const descriptionVer2 = obtenerDato("descriptionVer2")[0];
        const userOwner = obtenerDato("userOwner")[0];
        const userMember = obtenerDato("userMember");
        let deadline = obtenerDato("deadline")[0];
        const [year, month, day] = deadline.split('-');
        deadline = `${day}-${month}-${year}`;

        if (name === "" || shortName === "" || descriptionVer2 === "" || userOwner === "" || userMember.length === 0 || deadline === "") {
            alert("Por favor, rellene todos los campos");
            setIsLoading(false);
            return;
        }
        const data = {
            name: name,
            shortName: shortName,
            description: descriptionVer2,
            userOwner: userOwner,
            userMembers: userMember,
            projectDateI: formatDate(new Date().toISOString()),
            projectDateT: deadline,
            topic: topic,
            period: period,
        }
        console.log("data", data);

        const response = await projectServices.create(data)
        console.log("response", response);
        setIsLoading(false);
        agregarComision(response);
        closeModal();
    }

    return (
        <ModalTransition>
            <Modal onClose={closeModal} shouldScrollInViewport>
                <Form onSubmit={() => console.log("Hello")}>
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
                                <Field name="deadline" label="Fecha límite para la comisión">
                                    {({ fieldProps }) =>
                                        <DatePicker {...fieldProps} dateFormat="DD-MM-YYYY" placeholder="Selecciona una fecha" />}
                                </Field>
                            </ModalBody>
                            <ModalFooter>
                                <LoadingButton
                                    type="button"
                                    appearance="primary"
                                    isLoading={isLoading}
                                    style={{marginLeft: '5px'}}
                                    onClick={() => crearProyecto()}
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