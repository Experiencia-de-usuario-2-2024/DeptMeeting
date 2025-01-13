import React from 'react';
import Form, {Field, FormFooter} from "@atlaskit/form";
import Button, {ButtonGroup} from "@atlaskit/button";
import ArrowLeftIcon from "@atlaskit/icon/glyph/arrow-left";
import LoadingButton from "@atlaskit/button/loading-button";
import TextArea from "@atlaskit/textarea";
import meetingServices from "../../services/meeting.services";
import projectServices from "../../services/project.services";

const NewFormularioReunion: React.FC<{period?: any, closeForm: () => void, nMeeting: number}> = ({period, closeForm, nMeeting}) => {
    const [submitting, setSubmitting] = React.useState(false);

    const DescripcionVer2 = () => (
        <Field
            aria-required={true}
            name="descriptionVer2"
            defaultValue=""
            label="Descripción de la reunión"
            isRequired
        >
            {({ fieldProps }) => <TextArea {...fieldProps} onChange={(event) => fieldProps.onChange(event.target.value)} />}
        </Field>
    );

    const obtenerDato = (nombre: string) => {
        return [...document.getElementsByName(nombre)].map((element: any) => (element as HTMLInputElement).value);
    }

    const crearReunion = async () => {
        setSubmitting(true);
        const description = obtenerDato('descriptionVer2')[0];
        console.log("Description:", description);

        const data = {
            name: `Reunión ${nMeeting}`,
            description: description,
            number: nMeeting,
            state: 'Nueva',
            period: period._id
        }

        const response = await meetingServices.create(data);
        console.log("Reunión creada:", response);
        console.log("Periodo:", period);
        const responsePeriod = await projectServices.addMeetingToPeriod(period._id, response._id);
        console.log("Reunión añadida al periodo:", responsePeriod);
        setSubmitting(false);
        closeForm();
    }

    return (
        <div style={{
            display: 'flex',
            margin: '0 auto',
            marginLeft: '15px',
            marginRight: '15px',
            marginBottom: '30px',
            flexDirection: 'column'
        }}>
            <h2 style={{textAlign: 'left'}}>{period.name}</h2>
            <h1>Creación de nueva reunión</h1>
            <Form<{ username: string }>
                onSubmit={(data) => {
                    console.log("Data:", data);
                }}
            >
                {({formProps}) => (
                    <form {...formProps}>
                        <DescripcionVer2/>

                        <FormFooter>
                            <ButtonGroup>
                                <Button iconBefore={<ArrowLeftIcon label="" size="medium"/>}
                                        onClick={() => closeForm()} style={{marginRight: '5x'}}> Ir a Periodo</Button>
                                <LoadingButton
                                    type="submit"
                                    appearance="primary"
                                    isLoading={submitting}
                                    onClick={() => crearReunion()}
                                    style={{marginLeft: '5px'}}
                                >
                                    Crear reunión
                                </LoadingButton>
                            </ButtonGroup>
                        </FormFooter>
                    </form>
                )}
            </Form>
        </div>
    );
};

export default NewFormularioReunion;