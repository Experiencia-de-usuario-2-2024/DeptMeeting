import React, {Fragment, useEffect, useState, useCallback} from "react";
import styles from "../styles/login.module.css";
import {css, jsx} from '@emotion/react';

import { Box, xcss } from '@atlaskit/primitives';
import Select, { ValueType } from '@atlaskit/select';
import TextField from '@atlaskit/textfield';
import LoadingButton from '@atlaskit/button/loading-button';
import Button from '@atlaskit/button';
import Textfield from '@atlaskit/textfield';
import Flag, {FlagGroup } from '@atlaskit/flag';
import SucessIcon from '@atlaskit/icon/glyph/check-circle';
import { G400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import SignInIcon from '@atlaskit/icon/glyph/sign-in'

import axios from "axios";

import Form, {
    ErrorMessage,
    Field,
    FormFooter,
    FormHeader, HelperMessage,
    RequiredAsterisk,
    ValidMessage,
} from '@atlaskit/form';

import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTitle,
    ModalTransition,
} from '@atlaskit/modal-dialog';

// @ts-ignore
const boxStyles = xcss({
    borderColor: 'color.border.discovery',
    borderStyle: 'solid',
    borderRadius: 'border.radius',
    borderWidth: 'border.width',
});

interface Option {
    label: string;
    value: string;
}

interface LoginProps {
    onLogin: (token: string) => void;
}

const userTypes = [
    { label: 'Estudiante', value: 'estudiante' },
    { label: 'Profesor', value: 'profesor' },
    // { label: 'Visita', value: 'visita' }
];

const userNameData = ['jsmith', 'mchan'];

const errorMessages = {
    shortUsername: 'Please enter a username longer than 4 characters.',
    validUsername: 'Nice one, this username is available.',
    usernameInUse: 'This username is already taken, try entering another one.',
    selectError: 'Porfavor seleccione un tipo de usuario.',
    invalidEmail: 'Correo inválido. Recuerde que solo se permiten correos @usach.cl.',
};

const { shortUsername, validUsername, usernameInUse, selectError } =
    errorMessages;

const checkUserName = (value: string) => {
    return userNameData.includes(value);
};

let isUsernameUsed: boolean = false;

const Login: React.FC<LoginProps> = ({onLogin}) => {
    //Variable de estado de registro/login
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //Variables asociados a los campos del formulario
    const [fieldValue, setFieldValue] = useState('');
    const [fieldHasError, setFieldHasError] = useState(false);
    const [errorMessageText, setErrorMessageText] = useState('');
    const [messageId, setMessageId] = useState('');

    //Variables asociados al modal para reestablecer contraseña
    const [isOpen, setIsOpen] = useState(false);
    const [correoRecover, setCorreoRecover] = useState('');
    const [correoRecoverHasError, setCorreoRecoverHasError] = useState(false);
    const [correoRecoverSuccess, setCorreoRecoverSuccess] = useState(false);

    const openModal = useCallback(() => setIsOpen(true), []);
    const closeModal = useCallback(() => setIsOpen(false), []);

    const handleLogin = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        console.log('process.env.REACT_APP_BACKEND_IP:', process.env.REACT_APP_BACKEND_IP)
        console.log('process.env.REACT_APP_BACKEND_PORT:', process.env.REACT_APP_BACKEND_PORT)

        try {
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/auth/signin`, //MODIFICAR (listo, falta probar)
                headers: {
                    'Content-Type': 'application/json'
                },
                data : JSON.stringify({
                    email: email,
                    password: password
                })
            };

            axios.request(config)
                .then((response) => {
                    console.log("Imprimiendo el token en el login");
                    console.log(JSON.stringify(response.data));
                    // Guardar el token en el local storage y se envia a todos los microfrontends (y front principal) que lo requieren
                    localStorage.setItem('tokenUser', response.data.token);
                    localStorage.setItem('primerInicio', 'true');
                    window.location.href = "/home";
                })
                .catch((error) => {
                    setErrorMessage(error.response.data.error.message);
                    setIsErrorModalOpen(true);
                    console.log(error);
                });
        } catch (error) {
            setErrorMessage("error");
            setIsErrorModalOpen(true);
        }
    }

    const handleBlurEvent = () => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@usach\.cl$/;
        const isEmailValid = emailPattern.test(fieldValue);
        if (isEmailValid) {
            setFieldHasError(false);
        } else {
            setFieldHasError(true);
            setErrorMessageText('INVALID_EMAIL');
        }
    };

    const recuperarPassword = () => {
        try{
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/auth/resetpass/${correoRecover}`, //MODIFICAR (listo, falta probar)
                headers: { }
            };

            axios.request(config)
                .then((response) => {
                    console.log(JSON.stringify(response.data));
                    setCorreoRecoverSuccess(true); //Muestra aviso de registro exitoso
                })
                .catch((error) => {
                    console.log(error);
                    setErrorMessage(error.response.data.error.message);
                    setIsErrorModalOpen(true);
                });
        } catch (error) {
            console.log(error);
            setErrorMessage("error");
            setIsErrorModalOpen(true);
        }
    }; //TODO: Implementar recuperación de contraseña


    useEffect(() => {
        switch (errorMessageText) {
            case 'IS_VALID':
                setMessageId('-valid');
                break;
            case 'TOO_SHORT':
            case 'IN_USE':
                setMessageId('-error');
                break;
            default:
                setMessageId('-error');
        }
    }, [errorMessageText]);

    if (isRegisterMode){
        //Registro de cuenta
        return (
            <Fragment>
                <div className={styles.container}>
                    <Box
                        padding="space.400"
                        backgroundColor="color.background.selected"
                        xcss={boxStyles}>
                        <h1 style={{ color: '#09326C', marginBottom: 0 }}>MemFollow</h1>
                        <h3 style={{ color: '#09326C', marginTop: 0}}>Versión beta</h3>
                        <h1 style={{ color: '#09326C' }}>Registrar un nuevo usuario</h1>
                        <Form<{ nombre: string; email: string; password: string; type: ValueType<Option> }>
                            onSubmit={async (data) => {
                                const {nombre, email, password, type} = data;
                                const userType = (type as Option).value;
                                // Generación del tagName
                                const tagName = nombre.split(' ').map(word => word[0]).join('');
                                try {
                                    let config = {
                                        method: 'post',
                                        maxBodyLength: Infinity,
                                        url: `http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/auth/signup`, //MODIFICAR (listo, falta probar)
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        data : JSON.stringify({
                                            name: nombre,
                                            email: email,
                                            password: password,
                                            type: userType,
                                            tagName: tagName
                                        })
                                    };

                                    axios.request(config)
                                        .then((response) => {
                                            console.log(JSON.stringify(response.data));
                                            setIsSuccessModalOpen(true); //Muestra aviso de registro exitoso
                                            //Cambio de vista ocurre con delay para evitar perder la notificación
                                            setTimeout(() => {
                                                setIsRegisterMode(false); //Vuelve a la pantalla de inicio de sesión
                                            }, 5000); //Delay de 5 segundos
                                        })
                                        .catch((error) => {
                                            setErrorMessage(error.response.data.error.message);
                                            setIsErrorModalOpen(true);
                                            console.log(error);
                                            console.log(nombre, email, password, userType, tagName);
                                            console.log(userType);
                                        })
                                } catch (error) {
                                    console.log(error);
                                }
                            }}
                        >
                            {({ formProps, submitting }) => (
                                <form {...formProps}>
                                    <FormHeader>
                                        <p aria-hidden="true" style={{ color: 'red', fontSize: '20px'}}>
                                            Los campos requeridos son marcados con un asterisco <RequiredAsterisk />
                                        </p>
                                        <p aria-hidden="true" style={{ color: '#388BFF', fontSize: '20px'}}>
                                            Debe aceptar los términos y condiciones para poder registrarse.
                                        </p>
                                    </FormHeader>
                                    <Field
                                        aria-required={true}
                                        name="nombre"
                                        label="Nombre"
                                        isRequired
                                        defaultValue=""
                                    >
                                        {({ fieldProps, error }) => (
                                            <Fragment>
                                                <TextField autoComplete="off" {...fieldProps} />
                                            </Fragment>
                                        )}
                                    </Field>










                                    <Field
                                        name="email"
                                        label="Correo electrónico"
                                        defaultValue=""
                                        isRequired
                                        validate={(value) => {
                                            if (value) {
                                                setFieldValue(value);
                                            }
                                        }}
                                    >
                                        {({ fieldProps: { id, ...rest } }) => {
                                            return (
                                                <Fragment>
                                                    <TextField
                                                        {...rest}
                                                        aria-describedby={`${id}${messageId}`}
                                                        isInvalid={fieldHasError}
                                                        onBlur={handleBlurEvent}
                                                        value={rest.value.toLowerCase()} // Convert the value to lowercase
                                                    />
                                                    {fieldHasError && errorMessageText === 'INVALID_EMAIL' && (
                                                        <ErrorMessage>{errorMessages.invalidEmail}</ErrorMessage>
                                                    )}
                                                </Fragment>
                                            );
                                        }}
                                    </Field>

                                    <Field<ValueType<Option>> aria-required={true} name="type" label="Tipo de usuario" isRequired>
                                        {({ fieldProps: { id, ...rest }, error }) => (
                                            <Fragment>
                                                <Select<Option>
                                                    inputId={id}
                                                    {...rest}
                                                    options={userTypes}
                                                    placeholder="Selecciona un tipo de usuario..."
                                                    menuPortalTarget={document.body}
                                                    styles={{
                                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                        singleValue: (base) => ({ ...base, fontSize: '20px' }) // Agrega el estilo para disminuir el tamaño de la letra
                                                    }}
                                                />
                                                {error && <ErrorMessage>{error}</ErrorMessage>}
                                            </Fragment>
                                        )}
                                    </Field>
                                    <Field
                                        aria-required={true}
                                        name="password"
                                        label="Contraseña"
                                        defaultValue=""
                                        isRequired
                                    >
                                        {({ fieldProps }) => (
                                            <Fragment>
                                                <TextField type="password" {...fieldProps} />
                                            </Fragment>
                                        )}
                                    </Field>

                                    <Button appearance="subtle" onClick={openModal} className={styles.buttonRestablecer} style={{ fontSize: '18px' }}>
                                        Ver y aceptar términos y condiciones <RequiredAsterisk />
                                    </Button>

                                    <ModalTransition>
                                        {isOpen && (
                                            <Modal onClose={closeModal} height={600}>
                                                    <form>
                                                        <ModalHeader>
                                                            <ModalTitle>Términos y condiciones</ModalTitle>
                                                        </ModalHeader>
                                                        <ModalBody>
                                                                <object data="/TyC_GNU.pdf" type="application/pdf" width="100%" height="450">
                                                                    <p>No posee un plugin en su navegador para la lectura de PDF.
                                                                        No hay problema, <a href="/TyC_GNU.pdf">haga click acá para ver el archivo.</a></p>
                                                                </object>
                                                        </ModalBody>
                                                        <ModalFooter>
                                                            <Button appearance="subtle" onClick={closeModal}>
                                                                Cerrar
                                                            </Button>
                                                            <Button appearance="primary"  onClick={() =>  { setTermsAccepted(true); closeModal(); }}>
                                                                Aceptar términos
                                                            </Button>
                                                        </ModalFooter>
                                                    </form>
                                            </Modal>
                                        )}
                                    </ModalTransition>

                                    <div className={styles.centerIt}>
                                        <FormFooter>
                                            <LoadingButton
                                                type="submit"
                                                // iconAfter={<SignInIcon label="" size="medium" />}
                                                appearance="primary"
                                                isLoading={submitting}
                                                isDisabled={!termsAccepted || fieldHasError}
                                                style={{ fontSize: '20px' }} // Modificar el tamaño del botón
                                            >
                                                {isRegisterMode ? 'Registrarse' : 'Iniciar sesión'}
                                            </LoadingButton>
                                        </FormFooter>
                                    </div>

                                    <ModalTransition>
                                        {isErrorModalOpen && (
                                            <Modal onClose={() => setIsErrorModalOpen(false)}>
                                                <ModalHeader>
                                                    <ModalTitle appearance="warning">Error</ModalTitle>
                                                </ModalHeader>
                                                <ModalBody>
                                                    {errorMessage}
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button appearance="subtle" onClick={() => setIsErrorModalOpen(false)}>
                                                        Cerrar
                                                    </Button>
                                                </ModalFooter>
                                            </Modal>
                                        )}
                                    </ModalTransition>

                                    <ModalTransition>
                                        {isSuccessModalOpen && (
                                            <Modal onClose={() => setIsSuccessModalOpen(false)}>
                                                <ModalHeader>
                                                    <ModalTitle>
                                                        <SucessIcon primaryColor={G400} label="Success icon"/>
                                                        Registro exitoso
                                                    </ModalTitle>
                                                </ModalHeader>
                                                <ModalBody>
                                                    Ahora será redirigido a la página de inicio de sesión.
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button appearance="subtle" onClick={() => setIsSuccessModalOpen(false)}>
                                                        Cerrar
                                                    </Button>
                                                </ModalFooter>
                                            </Modal>
                                        )}
                                    </ModalTransition>

                                    <h6 style={{ color: '#579DFF', margin: '30px 0 0 0' }} className={styles.lowercaseText}>
                                        {isRegisterMode ? '¿Ya tienes una cuenta? ' : '¿No tienes una cuenta? '}
                                        {/* <a onClick={() => setIsRegisterMode(!isRegisterMode)}>{isRegisterMode ? 'Inicia sesión' : 'Regístrate'}</a> */}
                                    </h6>
                                    <Button appearance="link" onClick={() => setIsRegisterMode(!isRegisterMode)}>
                                        {isRegisterMode ? 'Inicia sesión' : 'Regístrate'}
                                    </Button>
                                </form>
                            )}
                        </Form>
                    </Box>
                </div>
            </Fragment>);
    }else{
        //Inicio de sesión
        return (
            <Fragment>
                <div className={styles.container}>
                    <Box
                        padding="space.400"
                        backgroundColor="color.background.selected"
                        xcss={boxStyles}>
                        <h1 style={{ color: '#09326C', marginBottom: 0 }}>MemFollow</h1>
                        <h3 style={{ color: '#09326C', marginTop: 0}}>Versión beta</h3>
                        <h1 style={{ color: '#09326C' }}>Inicio de sesión</h1>
                        <Form onSubmit={handleLogin}>
                            {({ formProps, submitting }) => (
                                
                                <form {...formProps}>
                                    {/* <FormHeader title="Inicio de sesión"/> */}
                                    <FormHeader/>
                                    <Field
                                        name="email"
                                        label="Correo electrónico"
                                        defaultValue=""
                                    >
                                        {({ fieldProps}) => {
                                            return (
                                                <Fragment>
                                                    {/* <TextField {...fieldProps} value={email} onChange={e => setEmail((e.target as HTMLInputElement).value)} /> */}
                                                    <TextField {...fieldProps} value={email.toLowerCase()} onChange={e => setEmail((e.target as HTMLInputElement).value.toLowerCase())} />
                                                </Fragment>
                                            );
                                        }}
                                    </Field>
                                    <Field
                                        name="password"
                                        label="Contraseña"
                                        defaultValue=""
                                    >
                                        {({ fieldProps }) => {
                                            return (
                                                <Fragment>
                                                    <TextField type="password" {...fieldProps} value={password} onChange={e => setPassword((e.target as HTMLInputElement).value)} />
                                                </Fragment>
                                            );
                                        }}
                                    </Field>
                                    <Button appearance="subtle" onClick={openModal} className={styles.buttonRestablecer}>
                                        Reestablecer contraseña
                                    </Button>

                                    <ModalTransition>
                                        {isOpen && (
                                            <Modal onClose={closeModal}>
                                                <form>
                                                    <ModalHeader>
                                                        <ModalTitle>Reestablecer contraseña</ModalTitle>
                                                    </ModalHeader>
                                                    <ModalBody>
                                                        <Field id="correoRecover" name="correoRecover" label="Escribe tu correo para continuar">
                                                            {({ fieldProps }) => (
                                                                <Fragment>
                                                                    <Textfield
                                                                        {...fieldProps}
                                                                        defaultValue=""
                                                                        value={correoRecover}
                                                                        onChange={e => setCorreoRecover((e.target as HTMLInputElement).value)}
                                                                    />
                                                                </Fragment>
                                                            )}
                                                        </Field>
                                                    </ModalBody>
                                                    <ModalFooter>
                                                        <Button appearance="subtle" onClick={closeModal}>
                                                            Cerrar
                                                        </Button>
                                                        <Button appearance="primary" onClick={recuperarPassword}>
                                                            Enviar nueva contraseña
                                                        </Button>
                                                    </ModalFooter>
                                                </form>
                                            </Modal>
                                        )}
                                    </ModalTransition>

                                    <ModalTransition>
                                        {correoRecoverSuccess && (
                                            <Modal onClose={() => setCorreoRecoverSuccess(false)}>
                                                <ModalHeader>
                                                    <ModalTitle>
                                                        <SucessIcon primaryColor={G400} label="Success icon"/>
                                                            Correo enviado
                                                    </ModalTitle>
                                                </ModalHeader>
                                                <ModalBody>
                                                    Revise su correo electrónico donde tendrá una nueva contraseña.
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button appearance="subtle" onClick={() => setCorreoRecoverSuccess(false)}>
                                                        Cerrar
                                                    </Button>
                                                </ModalFooter>
                                            </Modal>
                                        )}
                                    </ModalTransition>

                                    <div className={styles.centerIt}>
                                        <FormFooter>
                                            <LoadingButton
                                                type="submit"
                                                iconAfter={<SignInIcon label="" size="medium" />}
                                                appearance="primary"
                                                isLoading={submitting}
                                                onClick={handleLogin}
                                                style={{ fontSize: '20px' }} // Modificar el tamaño del botón
                                            >
                                                {isRegisterMode ? 'Registrarse' : 'Iniciar sesión'}
                                            </LoadingButton>
                                        </FormFooter>
                                    </div>

                                    <ModalTransition>
                                        {isErrorModalOpen && (
                                            <Modal onClose={() => setIsErrorModalOpen(false)}>
                                                <ModalHeader>
                                                    <ModalTitle appearance="warning">Error</ModalTitle>
                                                </ModalHeader>
                                                <ModalBody>
                                                    {errorMessage}
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button appearance="subtle" onClick={() => setIsErrorModalOpen(false)}>
                                                        Cerrar
                                                    </Button>
                                                </ModalFooter>
                                            </Modal>
                                        )}
                                    </ModalTransition>

                                    {/* <h6 style={{ color: '#579DFF', margin: 0}} className={styles.lowercaseText}> */}
                                    <h6 style={{ color: '#579DFF', margin: '50px 0 0 0' }} className={styles.lowercaseText}>
                                        {isRegisterMode ? '¿Ya tienes una cuenta? ' : '¿No tienes una cuenta? '}
                                        {/* <a onClick={() => setIsRegisterMode(!isRegisterMode)}>{isRegisterMode ? 'Inicia sesión' : 'Regístrate'}</a> */}
                                    </h6>
                                    <Button appearance="link" onClick={() => setIsRegisterMode(!isRegisterMode)}>
                                        {isRegisterMode ? 'Inicia sesión' : 'Regístrate'}
                                    </Button>
                                </form>
                            )}
                        </Form>
                    </Box>
                </div>
            </Fragment>
        );
    }
}

export default Login;