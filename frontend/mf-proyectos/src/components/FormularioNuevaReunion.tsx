import React, { useEffect, useState } from "react";
import { Box, Inline, Stack, xcss } from "@atlaskit/primitives";
import axios from "axios";
import Button, { ButtonGroup } from '@atlaskit/button';
import LoadingButton from '@atlaskit/button/loading-button';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left'
import EditFilledIcon from '@atlaskit/icon/glyph/edit-filled'
import { jwtDecode } from 'jwt-decode';
import Reuniones from "./Reuniones";
import TextField from '@atlaskit/textfield';
import TextArea from '@atlaskit/textarea';
import Form, { Field, FormFooter } from '@atlaskit/form';

// Se obtiene el token del usuario logeado
const tokenUser = localStorage.getItem('tokenUser');

const FormularioNuevaReunion: React.FC = () => {    
    // Para determinar si se muestra pestaña que contiene el formulario para crear una nueva reunion o no
    const [mostrarFormularioReunion, setMostrarFormularioReunion] = React.useState(false);

    useEffect(() => {
        // Obtener valor de variable almacenada en el localStorage (para saber si se tiene que mostrar o no el formulario apenas carga la pagina)
        const storedValue = localStorage.getItem('mostrarFormularioReunion');
        if (storedValue) {
            const parsedValue = JSON.parse(storedValue);
            setMostrarFormularioReunion(parsedValue);
        }

    }, []);
    
    // Función para cancelar la operación de creación de una nueva reunion
    // Entrada: ninguna
    // Salida: regresar a la página que muestra la informacion del proyecto y sus reuniones asociadas
    const cancelarOperacion = () => {
        const newValue = !mostrarFormularioReunion;
        // Guardar valor de la variable en local storage
        localStorage.setItem('mostrarFormularioReunion', JSON.stringify(newValue));
        if (mostrarFormularioReunion == false) {
            setMostrarFormularioReunion(true);
        }
        else{
            setMostrarFormularioReunion(false);    
        }
        
    }

    // Función para finalizar la operación de creación de una nueva reunion
    // Entrada: ninguna
    // Salida: regresar a la página que muestra la informacion del proyecto y sus reuniones asociadas
    const finalizarOperacion = () => {
        window.alert("Reunión creada con éxito");
        const newValue = !mostrarFormularioReunion;
        // Guardar valor de la variable en local storage
        localStorage.setItem('mostrarFormularioReunion', JSON.stringify(newValue));
        if (mostrarFormularioReunion == false) {
            setMostrarFormularioReunion(true);
        }
        else{
            setMostrarFormularioReunion(false);    
        }
        
    }

    const crearReunion = () => {
        // 1. Capturar valores del formulario
        // const nameValue = (document.getElementsByName("name")[0]as HTMLInputElement).value;
        const descriptionValueVer2 = (document.getElementsByName("descriptionVer2")[0]as HTMLInputElement).value;

        // const numberValue = (document.getElementsByName("number")[0]as HTMLInputElement).value;

        // Se cambia debido a que las reuniones comienzan en 0 (solicitado por el profesor)
        // const aux = parseInt(localStorage.getItem('cantidadReuniones') || '0') + 1;
        const aux = parseInt(localStorage.getItem('cantidadReuniones') || '0');

        const numberValue = aux.toString();

        // Se setea el nombre de la reunion al formato requerido
        const nameValue = "Reunión " + numberValue;

        // 2. Setear valores del formulario que NO coloca el usuario (state, project, createdAt y updatedAt) -> para project hay que ver el valor de local storage
        const stateValue = "Nueva";
        const projectValue = localStorage.getItem('idProyecto');
        const createdAtValue = new Date().toISOString();
        const updatedAt = new Date().toISOString();

        if (nameValue === "" || descriptionValueVer2 === "" || numberValue ==="") {
            window.alert("Al parecer hay campos obligatorios (*) incompletos en el formulario, debes llenarlos para finalizar la creación de la reunión.");
            return;
        }

        // 3. Realizar peticion para crear la reunión
        async function peticionCrearProyecto() {
            try {            
                const responseReunion = await axios.post(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/meeting`, {
                    name: nameValue,
                    description: descriptionValueVer2,
                    number: numberValue,
                    state: stateValue,
                    project: projectValue,
                    createdAt: createdAtValue,
                    updatedAt: updatedAt
                }, {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Reunión creada");
                console.log(responseReunion.data);
            } catch (error) {
                console.error(error);
            }
        }
        // 4. Finalizar la operacion
        async function fin(){
            await peticionCrearProyecto();
            finalizarOperacion();
        }
        fin();
    }

    //**********************************************************************
    //*******************  */ CAMPOS DEL FORMULARIO ************************
    //**********************************************************************

    // GRAN PARTE DE LOS CAMPOS NO SON CONSIDERADOS DEBIDO A QUE SE CREAN DE FORMA AUTOMATICA O SIMPLEMENTE EL USUARIO NO TIENE PORQUE INGRESARLOS

    const NameField = () => (
        <Field
            aria-required={true}
            name="name"
            defaultValue=""
            label="Nombre de la reunión"
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
            label="Descripción de la reunión"
            isRequired
        >
            {({ fieldProps }) => <TextArea {...fieldProps} onChange={(event) => fieldProps.onChange(event.target.value)} />}
        </Field>
    );

    const NumberField = () => (
        <Field
            aria-required={true}
            name="number"
            defaultValue=""
            label="Número de reunión"
            isRequired
        >
            {({ fieldProps, error, valid }) => (
                <TextField
                    {...fieldProps}
                    type="number" // Set the input type to "number"
                />
            )}
        </Field>
    );

    const StateField = () => (
        <Field
            aria-required={true}
            name="state"
            defaultValue=""
            label="Estado de la reunión"
            isRequired
        >
            {({ fieldProps, error, valid }) => <TextField {...fieldProps} />}
        </Field>
    );

    const ProjectField = () => (
        <Field
            aria-required={true}
            name="project"
            defaultValue=""
            label="ID de proyecto asociado a la reunión"
            isRequired
        >
            {({ fieldProps, error, valid }) => <TextField {...fieldProps} />}
        </Field>
    );
    
    const CreatedAtField = () => (
        <Field
            aria-required={true}
            name="createdAt"
            defaultValue=""
            label="Creacion de la reunión"
            isRequired
        >
            {({ fieldProps, error, valid }) => <TextField {...fieldProps} />}
        </Field>
    );

    const UpdatedAtField = () => (
        <Field
            aria-required={true}
            name="updatedAt"
            defaultValue=""
            label="Actualización de la reunión"
            isRequired
        >
            {({ fieldProps, error, valid }) => <TextField {...fieldProps} />}
        </Field>
    );

    //**********************************************************************
    //*******************  */ CAMPOS DEL FORMULARIO ************************
    //**********************************************************************


    return (
        <div>
            {!mostrarFormularioReunion ? (
                <Reuniones />
            ) : (
                <>

                    <div style={{ display: 'flex', margin: '0 auto', marginLeft: '15px', marginRight: '15px', marginBottom: '30px', flexDirection: 'column'}}>
                        <h2 style={{textAlign:'left'}}>{localStorage.getItem('nombreProyecto')}</h2>
                        <h1>Creación de nueva reunión</h1>
                        <Form<{ username: string }>
                            onSubmit={(data) => {
                                // console.log('form data', data);
                                return new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>
                                    data.username === 'error' ? { username: 'IN_USE' } : undefined,
                                );
                            }}
                        >
                        {({ formProps, submitting }) => (
                                <form {...formProps}>
                                    <DescripcionVer2 />

                                    <FormFooter>
                                        <ButtonGroup>
                                            <Button iconBefore={<ArrowLeftIcon label="" size="medium" />} onClick={() => cancelarOperacion()} style={{ marginRight: '5x' }}> Ir al proyecto </Button>
                                            <LoadingButton
                                                type="submit"
                                                appearance="primary"
                                                isLoading={submitting}
                                                onClick={() => crearReunion()}
                                                style={{ marginLeft: '5px' }}
                                            >
                                                Crear reunión
                                            </LoadingButton>
                                        </ButtonGroup>
                                    </FormFooter>
                                </form>
                            )}
                        </Form>
                    </div>
                </>
            )}
        </div>
    );
};

export default FormularioNuevaReunion;