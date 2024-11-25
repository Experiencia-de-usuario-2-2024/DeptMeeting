import React, { useEffect, useState, useCallback, Fragment, ReactNode, FC} from "react";
import { css, jsx } from '@emotion/react';
import axios from 'axios';
import { Box, xcss } from '@atlaskit/primitives';
import { Inline, Stack } from '@atlaskit/primitives';
import Avatar from '@atlaskit/avatar';
import Form, { Field, FormFooter } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import CheckIcon from '@atlaskit/icon/glyph/check'
import Button, { ButtonGroup } from '@atlaskit/button';
import LoadingButton from '@atlaskit/button/loading-button';
import Textfield from '@atlaskit/textfield';
import { jwtDecode } from 'jwt-decode';
import DynamicTable from '@atlaskit/dynamic-table';
import Select from '@atlaskit/select';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left'

import WatchIcon from '@atlaskit/icon/glyph/watch'
import WatchFilledIcon from '@atlaskit/icon/glyph/watch-filled'


// Se obtiene el token del usuario logeado
const tokenUser = localStorage.getItem('tokenUser');

// estilo para el contenedor de la información del perfil
const boxStylePerfil = xcss({
    // width: '400px', //500
    width: '100%', //500
    height: '100%',
    borderColor: 'color.border.information',
    borderStyle: 'solid',
    borderRadius: 'border.radius',
    borderWidth: 'border.width',
    // padding: 'space.100', //400
    backgroundColor: 'color.background.information',
    // marginLeft: 'space.400', // Add left margin
    // marginRight: 'space.400', // Add left margin
    marginTop: 'space.400', // Add top margin
    // marginBottom: 'space.400', // Add bottom margin
});

const Perfil: React.FC = () => {
    // Estado utilizado para mostrar el perfil del usuario
    const [verPerfil, setVerPerfil] = React.useState(Boolean);

    // Interfaz para los datos del perfil de un usuario
    interface Usuario {
        color: string;
        email: string; 
        name: string;
        avatar: string;
        password: string;
        tagName: string;
        type: string;
        __v: number;
        _id: string;
        asignado: string;
        active: Boolean;
        accessDateLimit: string;
        createOn: Date;
    }

    // Interfaz para los datos de las tareas/compromisos de un usuario
    interface Compromiso {
        description: string; // *
        type: string; // *
        participants: string; // *
        topic: number;
        meeting: string; // *
        project: string; // *
        meetingMinute: string;
        state: string; // *
        number: number;
        dateLimit: string;
        timeLimit: string;
        postition: string;
        isSort: string;
        _id: string;
        createdAt: string;
        updatedAt: string;
        disagreement: JSON;
    }

    // Estado para almacenar el perfil del usuario
    const [usuarioPerfil, setusuarioPerfil] = React.useState<Usuario>(); 
    // Estado para tener la informacion del usuario logeado
    const [usuarioPerfilLog, setusuarioPerfilLog] = React.useState<Usuario>(); 
    // Estado para almacenar las tareas del usuario
    const [compromisosUsuario, setcompromisosUsuario] = React.useState<Compromiso[]>();
    

    // ya no se utiliza
    var emailUsuarioPerfil: string;
    var emailUsuarioLog: string;


    useEffect(() => {
        // Obtener de local storage el valor de verPerfil (para saber si tiene que mostrar el perfil o no)
        const storedValue = localStorage.getItem('verPerfil');
        if (storedValue) {
            const parsedValue = JSON.parse(storedValue);
            setVerPerfil(parsedValue);
        }

        // Obtener de local storage el id del usuario cuyo perfil se va a cargar
        const idPerfil = localStorage.getItem('idPerfil');
        // Obtener los datos del usuario al principio para asi cargar el perfil (requiere del id del usuario)
        async function obtenerDatosUsuario() {
            try {
                // Solo se requiere del token del usuario para realizar la petición
                const response = await axios.get(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/user/perfil/` + idPerfil, {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("INFORMACION DEL USUARIO");
                console.log(response.data);
                setusuarioPerfil(response.data);
                emailUsuarioPerfil = response.data.email;

            } catch (error) {
                console.error(error);
                console.error("NO HAY NINGUN ID EN LOCAL STORAGE PARA CARGAR EL PERFIL DEL USUARIO");
            }
        }
        // obtenerDatosUsuario();

        // EL FUNCIONAMIENTO DE LA PLATAFORMA SE CAMBIO, SOLAMENTE EL USUARIO LOGEADO PUEDE MODIFICAR SU PERFIL, NADIE MAS
        // Obtener los datos del usuario logeado, para asi saber si puede o no modificar el perfil (un profesor puede ver el perfil de un estudiante pero no puede modificar sus datos)
        async function obtenerDatosUsuarioLog() {
            try {
                const decodedToken: any = tokenUser ? jwtDecode(tokenUser) : null;
                const correoElectronico = decodedToken.email;
                // Solo se requiere del token del usuario para realizar la petición
                const response = await axios.get(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/user/perfil/email/` + correoElectronico, {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("INFORMACION DEL USUARIO LOGEADO");
                console.log(response.data);
                setusuarioPerfilLog(response.data);
                emailUsuarioLog = response.data.email;

            } catch (error) {
                console.error(error);
            }
        }
        // obtenerDatosUsuarioLog();

        // funcion para obtener las tareas del usuario 
        async function obtenerCompromisosUsuario() {
            try {
                const response = await axios.get(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/element/participants/` + emailUsuarioPerfil, {
                // const response = await axios.get('http://191.239.118.117:${process.env.REACT_APP_BACKEND_PORT}/api/element/participants/walter.white@usach.cl', {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("*** COMPROMISOS DEL USUARIO CUYO PERFIL ES VISIBLE***");
                console.log(emailUsuarioPerfil);
                console.log(response.data);
                setcompromisosUsuario(response.data);

            } catch (error) {
                console.error(error);
            }
        }
        // obtenerCompromisosUsuario();

        // garantizar el orden de las funciones asincronas
        async function obtenerDatos() {
            await obtenerDatosUsuario();
            await obtenerDatosUsuarioLog();
            await obtenerCompromisosUsuario();
        }
        obtenerDatos();


    }, []);
    

    // Entrada: ninguna
    // Salida: ninguna
    // Funcion: actualiza la informacion del usuario, para esto se recoge directamente la informacion ingresada en el formulario. La funcion se ejecuta con el presionar de un boton
    const actualizarInformacion = () => {
        const fotoAvatarValue = (document.getElementsByName("fotoAvatar")[0] as HTMLInputElement).value;
        const nameValue = (document.getElementsByName("name")[0] as HTMLInputElement).value;
        const tagnameValue = (document.getElementsByName("tagname")[0] as HTMLInputElement).value;
        const emailValue = (document.getElementsByName("email")[0] as HTMLInputElement).value;
        const passwordValue = (document.getElementsByName("password")[0] as HTMLInputElement).value;

        var asignarEstudianteProfesorValue: string = "";
        // este campo solamente se mostrara si el usuario logeado es estudiante
        const tipoDeUsuario = localStorage.getItem('tipoUsuario');
        if (tipoDeUsuario === 'estudiante' || tipoDeUsuario === 'Estudiante') {
            asignarEstudianteProfesorValue = (document.getElementsByName("asignarEstudianteProfesor")[0] as HTMLInputElement).value;
        }
        if (tipoDeUsuario === 'profesor' || tipoDeUsuario === 'Profesor') {
            asignarEstudianteProfesorValue = "";
        }
        
        // verificar que los campos obligatorios no esten vacios
        if (passwordValue === "" || passwordValue === null || passwordValue === undefined || passwordValue === " ") {
            window.alert("La contraseña no puede estar vacía, porfavor ingrese una contraseña válida");
            return;
        }

        if (nameValue === "" || nameValue === null || nameValue === undefined || nameValue === " ") {
            window.alert("El nombre no puede estar vacío, porfavor ingrese un nombre de usuario válido");
            return;
        }

        if (emailValue === "" || emailValue === null || emailValue === undefined || emailValue === " " || !emailValue.includes("@") || !emailValue.includes(".")) {
            window.alert("El correo electrónico no es válido, porfavor ingrese un correo electrónico válido");
            return;
        }

        // Realizar la peticion que actualiza la informacion del usuario
        async function peticionActualizar() {
            try {            
                
                const responsePerfil = await axios.put(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/user/update/` + usuarioPerfil?._id + '/profile', {
                    avatar: fotoAvatarValue,
                    name: nameValue,
                    tagName: tagnameValue,
                    email: emailValue,
                    password: passwordValue,
                    asignado: asignarEstudianteProfesorValue
                }, {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Perfil actualizado correctamente");
                // console.log(responsePerfil.data);
            
            } catch (error) {
                console.error(error);
            }
        }
        peticionActualizar();
        window.alert("Perfil actualizado correctamente");
        window.location.reload();
    }

    // YA NO SE UTILIZA DEBIDO A QUE LAS TARAS SE DEJARON EN UN MICROFRONTEND APARTE
    const actualizarEstadoTarea = (idCompromiso: string, nuevoEstado: string) => {
        console.log("ID DE LA TAREA A ACTUALIZAR: " + idCompromiso);
        console.log("NUEVO ESTADO DE LA TAREA: " + nuevoEstado);
        async function peticionActualizarEstadoTarea() {
            try {            
                
                const responsePerfil = await axios.put(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/element/update/` + idCompromiso, {
                    state: nuevoEstado,
                }, {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Estado de la tarea actualizado correctamente");
                // console.log(responsePerfil.data);
            
            } catch (error) {
                console.error(error);
            }
        }
        peticionActualizarEstadoTarea();
        window.alert("Tarea actualizada correctamente");
        window.location.reload();
    }

    // YA NO SE UTILIZA DEBIDO A QUE EL PERFIL AHORA SE ACCEDE DESDE UN DIALOGO MODAL
    const volverHome = () => {
        const newValue = !verPerfil;

        localStorage.setItem('verPerfil', JSON.stringify(newValue));
        localStorage.setItem('verActaDialogica', JSON.stringify(newValue));
        
        if (verPerfil == false) {
            setVerPerfil(true);
        }
        else{
            setVerPerfil(false);    
        }
        window.location.reload();
    }


    //**********************************************************************
    //*******************  */ CAMPOS DEL FORMULARIO ************************
    //**********************************************************************

    const FotoAvatar = () => (
        <Field
            aria-required={true}
            name="fotoAvatar"
            defaultValue={usuarioPerfil?.avatar}
            label="URL de la foto de perfil"
        >
            {({ fieldProps, error, valid }) => <TextField {...fieldProps} />}
        </Field>
    );

    const Name = () => (
        <Field
            aria-required={true}
            name="name"
            defaultValue={usuarioPerfil?.name}
            label="Nombre del usuario"
            isRequired
        >
            {({ fieldProps, error, valid }) => <TextField {...fieldProps} />}
        </Field>
    );

    const Tagname = () => (
        <Field
            aria-required={true}
            name="tagname"
            defaultValue={usuarioPerfil?.tagName}
            label="Iniciales del usuario"            
        >
            {({ fieldProps, error, valid }) => <TextField {...fieldProps} />}
        </Field>
    );

    const Email = () => (
        <Field
            aria-required={true}
            name="email"
            defaultValue={usuarioPerfil?.email}
            label="Correo electrónico"
            isRequired
        >
            {({ fieldProps, error, valid }) => <TextField {...fieldProps} />}
        </Field>
    );

    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const Password = () => (
        

       

    <Field
        aria-required={true}
        name="password"
        defaultValue=""
        label="Contraseña (repita la actual o ingrese una nueva)"
        isRequired
    >
        {({ fieldProps, error, valid }) => (
            <div style={{ position: 'relative' }}>
                <TextField
                    {...fieldProps}
                    type={showPassword ? 'text' : 'password'}
                />
                <Button
                    onClick={togglePasswordVisibility}
                    appearance="subtle"
                    spacing="none"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        right: '8px',
                        transform: 'translateY(-50%)',
                    }}
                >
                        {showPassword ? <WatchIcon /> : <WatchFilledIcon />}
                </Button>
            </div>
        )}
    </Field>
    );

    // este campo solamente se mostrara si el usuario logeado es estudiante
    const AsignarEstudianteProfesor = () => (
        <Field
            aria-required={true}
            name="asignarEstudianteProfesor"
            defaultValue={usuarioPerfil?.asignado}
            label="Profesor/a asignado/a (correo electrónico)"
            // isRequired
        >
            {({ fieldProps, error, valid }) => <TextField {...fieldProps} />}
        </Field>
    );

    //**********************************************************************
    //**********************************************************************
    //**********************************************************************



    //**********************************************************************
    //*******************  */ Funcion para la tabla de tareas/compromisos ** -------> YA NO SE UTILIZA
    //**********************************************************************
    function createKey(input: string) {
        return input ? input.replace(/^(the|a|an)/, '').replace(/\s/g, '') : input;
    }
        

    //**********************************************************************
    //**********************************************************************
    //**********************************************************************

return (    
    <div>

        {/* Informacion del perfil del usuario */}
        <Box xcss={boxStylePerfil}>
            {/* Forma alternativa de indicar el tipo de usuario. Se descarta para aprovechar el titulo */}
            {/* <h3 style={{textAlign:'left', marginBottom:'0px', marginLeft:'20px'}}>Usuario: {usuarioPerfil?.type}</h3> */}
            <Stack alignInline="center">
                {/* <h1>Mi perfil: {usuarioPerfil?.type}</h1> */}
                {/* se separa en dos casos para que muestre Profesor/a --> "no sexista" */}
                {usuarioPerfil?.type === 'profesor' && (
                    // <h1>Mi perfil: {usuarioPerfil?.type}/a</h1>
                    <h1>Mi perfil: Profesor/a guía</h1>
                )}
                {usuarioPerfil?.type === 'estudiante' && (
                    // <h1>Mi perfil: {usuarioPerfil?.type}</h1>
                    <h1>Mi perfil: Estudiante</h1>
                )}

                <Avatar 
                    appearance="circle"
                    src={usuarioPerfil?.avatar}
                    size="xxlarge"
                    name={usuarioPerfil?.name}
                />
                {/* <Button style={{padding:0}} appearance="link" href="https://youtu.be/MpuM6YYn3w8">Como cambiar la foto del perfil</Button> */}
                <Button style={{padding:0}} appearance="link" href="https://youtu.be/MpuM6YYn3w8" target="_blank" rel="noopener noreferrer">Como cambiar la foto del perfil</Button>

                <Form<{ username: string }>
                    onSubmit={(data) => {
                        // console.log('form data', data);
                        return new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>
                            data.username === 'error' ? { username: 'IN_USE' } : undefined,
                        );
                    }}
                >
                    {({ formProps, submitting }) => (
                        <form {...formProps} style={{ width: '50%',}}>
                            <div style={{ textAlign: 'center' }}>
                                <FotoAvatar />
                                <Name />
                                <Tagname />
                                <Email />
                            </div>

                            {/* Este campo solamente se mostrara si el usuario logeado es estudiante */}
                            {usuarioPerfilLog?.type === 'estudiante' && (
                                <div style={{ textAlign: 'center' }}>
                                    <AsignarEstudianteProfesor />
                                </div>
                            )}
                            <div style={{ textAlign: 'center' }}>
                                <Password />
                            </div>

                            {/* SE REEEMPLAZO POR UN DIV PARA QUE LOS BOTONES QUEDEN CENTRADOS, esto debido a que el FormFooter automaticamente da un margen izquierdo de 24px, y para este formulario en particular queda raro */}
                            {/* <FormFooter> */} 
                            <div style={{ textAlign: 'center' }}>
                                <br />
                                <Button
                                    iconBefore={<CheckIcon label="" size="medium" />}
                                    type="submit"
                                    appearance="primary"
                                    onClick={() => actualizarInformacion()}
                                    isDisabled={usuarioPerfilLog?.email !== usuarioPerfil?.email}
                                    // style={{marginBottom: '10px'}}
                                >
                                    Actualizar perfil
                                </Button>
                                <br />
                                <br />
                            </div>
                        </form>
                    )}
                </Form>

            </Stack>
        </Box>            
    </div>
);
};

export default Perfil;