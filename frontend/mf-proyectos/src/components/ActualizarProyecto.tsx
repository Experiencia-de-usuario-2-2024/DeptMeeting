import React, { useEffect, useState } from "react";
import { Box, Inline, Stack, xcss } from "@atlaskit/primitives";
import axios from "axios";
import Button, { ButtonGroup } from '@atlaskit/button';
import LoadingButton from '@atlaskit/button/loading-button';
import TextField from '@atlaskit/textfield';
import TextArea from '@atlaskit/textarea';
import Form, { Field, FormFooter } from '@atlaskit/form';
import Select, { ActionMeta, MultiValue, PropsValue } from 'react-select';

import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left'
import EditFilledIcon from '@atlaskit/icon/glyph/edit-filled'
import CrossIcon from '@atlaskit/icon/glyph/cross'
import CheckIcon from '@atlaskit/icon/glyph/check'


import { jwtDecode } from 'jwt-decode';
import Reuniones from "./Reuniones";
import LinkIcon from '@atlaskit/icon/glyph/link'

// Se obtiene el token del usuario logeado
const tokenUser = localStorage.getItem('tokenUser');

var listaMiembrosOriginal: string[] = [];
var nuevosMiembros: string[] = [];

const ActualizarProyecto: React.FC = () => {

    // Interfaz para los estudiantes que seran añadidos al proyecto
    interface Estudiantes {
        email: string;
        value: string; 
        label: string;
    }

    // Interfaz para los proyectos del usuario
    interface ProyectoUser {
        shortName: string; //false *
        name: string; //true *
        description: string; //true *
        projectDateI: string; //false
        projectDateT: string; //false
        guests: string; 
        userOwner: string; // *
        userMembers: string[]; // *
        _id: string;
    }

    // Para determinar si se muestra pestaña que permite editar la informacion de un proyecto o no
    const [editarProyecto, setEditarProyecto] = React.useState(false);
    //OBTENER TODOS LOS ESTUDIANTES AL PRINCIPIO
    const [estudiantes, setEstudiantes] = React.useState<Estudiantes[]>([]);
    //  Para los datos del proyecto
    const [proyectoUser, setProyectsUser] = React.useState<ProyectoUser>(); 

    useEffect(() => {
        // Obtener valor de variable almacenada en el localStorage (para saber si se tiene que mostrar o no el formulario apenas carga la pagina)
        const storedValue = localStorage.getItem('editarProyecto');
        if (storedValue) {
            const parsedValue = JSON.parse(storedValue);
            setEditarProyecto(parsedValue);
        }

        const idProyecto = localStorage.getItem('idProyecto');
        // // Obtener todos los proyectos del usuario al inicio
        async function obtenerProyectoPorId() {
            try {
                // Solo se requiere del token del usuario para realizar la petición
                const response = await axios.get(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/project/getProjectbyID/` + idProyecto, {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                setProyectsUser(response.data);
                listaMiembrosOriginal = [];
                listaMiembrosOriginal = response.data.userMembersOriginal;
            } catch (error) {
                console.error(error);
            }
        }
        obtenerProyectoPorId();

        // Obtener todos los estudiantes al inicio
        async function obtenerEstudiantes() {
            try {
                // A partir del token del usuario logeado se obtiene el correo electronico, que sera usado para obtener los estudiantes del usuario logeado
                const decodedToken: any = tokenUser ? jwtDecode(tokenUser) : null;
                const correoElectronico = decodedToken.email;
                console.log("email traido desde el token: ", correoElectronico);
                const response = await axios.get(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/user/list/email/` + correoElectronico, {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Todos los usuarios");
                console.log(response.data);
                setEstudiantes(response.data);

            } catch (error) {
                console.error(error);
            }
        }
        obtenerEstudiantes();
    }, []);



    // Funcion para regresar a la ventana que contiene la informacion del proyecto y sus reuniones
    // Entrada: ninguna
    // Salida: ninguna, modificar el valor almacenado en local storage
    const cancelarOperacion = () => {
        const newValue = !editarProyecto;
        // Guardar valor de la variable en local storage
        localStorage.setItem('editarProyecto', JSON.stringify(newValue));
        if (editarProyecto == false) {
            setEditarProyecto(true);
        }
        else{
            setEditarProyecto(false);    
        }
        
    }

    // Funcion para finalizar la operacion de actualizacion del proyecto
    // Entrada: ninguna
    // Salida: ninguna, se muestra una alerta indicando que el proyecto fue actualizado con exito
    const finalizarOperacion = () => {
        window.alert("Proyecto actualizado con éxito");
        const newValue = !editarProyecto;
        // Guardar valor de la variable en local storage
        localStorage.setItem('editarProyecto', JSON.stringify(newValue));
        if (editarProyecto == false) {
            setEditarProyecto(true);
        }
        else{
            setEditarProyecto(false);    
        }
    }

    // Funcion para actualizar la informacion del proyecto
    // Entrada: ninguna
    // Salida: ninguna, se realizan las peticiones para actualizar la informacion del proyecto
    const actualizarInformacion = () => {
        // 1. Guardar los valores de cada campo del formulario en variables
        const shortNameValue = (document.getElementsByName("shortName")[0] as HTMLInputElement).value;
        const nameValue = (document.getElementsByName("name")[0]as HTMLInputElement).value;
        const descriptionValueVer2 = (document.getElementsByName("descriptionVer2")[0]as HTMLInputElement).value;
        const userOwnerValue = (document.getElementsByName("userOwner")[0]as HTMLInputElement).value;
        const userMemberElements = document.getElementsByName("userMember");

        if (shortNameValue === "" || nameValue === "" || descriptionValueVer2 === "" || userOwnerValue === "") {
            window.alert("Al parecer hay campos obligatorios (*) incompletos en el formulario, debes llenarlos para finalizar la creación del proyecto.");
            return;
        }

        const idProyecto = localStorage.getItem('idProyecto');
        // 2. Realizar la peticion para actualizar el proyecto
        async function peticionActualizar() {
            try {            
                
                const responseProyecto = await axios.put(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/project/` + idProyecto, {
                    shortName: shortNameValue,
                    name: nameValue,
                    description: descriptionValueVer2,
                    userOwner: userOwnerValue
                }, {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Proyecto actualizado");
                // console.log(responseProyecto.data);
            
            } catch (error) {
                console.error(error);
            }
        }

        // 3. Realizar la peticion para añadir los integrantes al proyecto
        async function incluirParticipantes(correoEstudiante: string) {
            try {    
                const responseEstudiante = await axios.post(
                    `http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/project/` + idProyecto + '/add/member/' + correoEstudiante,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${tokenUser}`
                        }
                    }
                );
                
                console.log("Participante incluido en el proyecto");
                console.log(responseEstudiante.data);
            } catch (error) {
                console.error(error);
            }
        }

        // 3.1 Realizar peticion para actualizar atributos del participante: id de proyecto y nombre abreviado del proyecto -> se creara un nuevo metodo que permitira actualizar a los usuarios por el correo electronico
        async function ActualizarParticipantes(correoEstudiante: string, idProyecto: string, nombreAbreviadoProyecto: string) {
            try {            
                const response = await axios.put(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/user/update/` + correoEstudiante + '/usuarioperfil', {
                    currentProjectId: idProyecto,
                    currentProject: nombreAbreviadoProyecto,
                    proyectoPrincipal: nombreAbreviadoProyecto
                },{
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Usuario actualizado correctamente");
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        }

        // 3.2: Añadir los nuevos miembros del proyecto al atributo "userMembersOriginal"
        async function ActualizarProyecto(idProyecto: string, nuevosIntegrantes:string[]) {
            try {            
                const response = await axios.put(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/project/`+idProyecto, {
                    userMembersOriginal: listaMiembrosOriginal.concat(nuevosIntegrantes)
                },{
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Proyecto actualizado correctamente: Se realizo copia de miembros originales del proyecto");
                console.log(response.data);
                nuevosMiembros = [];
            } catch (error) {
                console.error(error);
            }
        }
        
        // 4. Garantizar el orden de las funciones para el correcto funcionamiento
        async function actualizarProjectAndIncludeParticipants() {
            nuevosMiembros = [];
            await peticionActualizar();
            const idProyectoRecuperado = localStorage.getItem('idProyecto');
            // debo utilizar "listaMiembrosOriginal" y no "userMembersElement" debido a que este ultimo solo contiene los elementos que se han añadido en el campo "userMember" y no a todos los miembros del proyecto
            // listaMiembrosOriginal.forEach((miembro) => {
            //     incluirParticipantes(miembro);
            //     ActualizarParticipantes(miembro, idProyectoRecuperado || "", shortNameValue);
            // });

            
            userMemberElements.forEach((element: HTMLElement) => {
                // por cada miembro que se añadio en el campo "userMember" se debe realizar la peticion para incluirlo en el proyecto
                nuevosMiembros.push((element as HTMLInputElement).value);
                incluirParticipantes((element as HTMLInputElement).value);
                ActualizarParticipantes((element as HTMLInputElement).value, idProyectoRecuperado || "", shortNameValue);
            });

            // pero se tienen que actualizar todos los participantes del proyecto, no solo a los nuevos agregados
            listaMiembrosOriginal.forEach((miembro) => {
                ActualizarParticipantes(miembro, idProyectoRecuperado || "", shortNameValue);
            });
        }

        // 5. Llamar a funcion que actualice el valor almacenado en local storage, de tal forma regresar a la pestaña que presenta la informacion del proyecto y las reuniones que posee
        async function fin(){
            await actualizarProjectAndIncludeParticipants();
            await ActualizarProyecto(localStorage.getItem('idProyecto') || "", nuevosMiembros);
            finalizarOperacion();
            window.location.reload();
        }
        fin();
    }


    //**********************************************************************
    //*******************  */ CAMPOS DEL FORMULARIO ************************
    //**********************************************************************
    const ShortNameField = () => (
        <Field
            aria-required={true}
            name="shortName"
            defaultValue={proyectoUser?.shortName}
            label="Nombre abreviado del proyecto"
            isRequired
        >
            {({ fieldProps, error, valid }) => <TextField {...fieldProps} />}
        </Field>
    );
    const Name = () => (
        <Field
            aria-required={true}
            name="name"
            defaultValue={proyectoUser?.name}
            label="Nombre del proyecto"
            isRequired
        >
            {({ fieldProps, error, valid }) => <TextField {...fieldProps} />}
        </Field>
    );

    const DescripcionVer2 = () => (
        <Field
            aria-required={true}
            name="descriptionVer2"
            defaultValue={proyectoUser?.description}
            label="Descripción del proyecto"
            isRequired
        >
            {({ fieldProps }) => <TextArea {...fieldProps} onChange={(event) => fieldProps.onChange(event.target.value)} />}
        </Field>
    );
    // No considerar debido a que da un error, ademas se construyo una version mejorada con un campo input adaptable al texto del usuario
    const Description = () => (
        <Field
            aria-required={true}
            name="description"
            defaultValue=""
            label="Descripción del proyecto"
            isRequired
        >
            {({ fieldProps, error, valid }) => <TextField {...fieldProps} />}
        </Field>
    );
    const UserOwner = () => (
        <Field
            aria-required={true}
            name="userOwner"
            defaultValue={proyectoUser?.userOwner}
            label="Dueño del proyecto (correo electrónico registrado)"
            isRequired
        >
            {({ fieldProps, error, valid }) => <TextField {...fieldProps} />}
        </Field>
    );

    const UserMember = () => {
        const [selectedStudent, setSelectedStudent] = useState<PropsValue<Estudiantes>>([]);
        const filteredEstudiantes = estudiantes.filter((estudiante) => Array.isArray(proyectoUser?.userMembers) && !proyectoUser?.userMembers.includes(estudiante.email));
        return (
            <Field
                aria-required={true}
                name="userMember"
                defaultValue=""
                label="Seleccione nuevos miembros"
                // isRequired
            >
                {({ fieldProps, error, valid }) => (
                    <Select
                        {...fieldProps}
                        isMulti
                        options={filteredEstudiantes.map((estudiante) => ({ value: estudiante.email, label: estudiante.email, email: estudiante.email }))}
                        value={selectedStudent}
                        onChange={(newValue: PropsValue<Estudiantes>, actionMeta: ActionMeta<Estudiantes>) => {
                            setSelectedStudent(newValue);
                            // Handle the onChange event here
                            console.log(newValue);
                        }}
                        placeholder="Seleccione..."
                    />
                )}
            </Field>
        );
    };

    // SOLO UNA IDEA, NO SE UTILIZA
    // siguendo la idea de "UserMember" se crea un campo para mostrar los miembros actuales del proyecto, permitiendo eliminarlos si se considera pertinente
    // const UserMemberActual = () => {
    //     const [selectedStudent, setSelectedStudent] = useState<PropsValue<Estudiantes>>([]);

    //     useEffect(() => {
    //         const filteredEstudiantes = estudiantes.filter((estudiante) => Array.isArray(proyectoUser?.userMembers) && proyectoUser?.userMembers.includes(estudiante.email));
    //         setSelectedStudent(filteredEstudiantes.map((estudiante) => ({ value: estudiante.email, label: estudiante.email, email: estudiante.email })));
    //     }, [estudiantes, proyectoUser]);

    //     return (
    //         <Field
    //             aria-required={true}
    //             name="userMember"
    //             defaultValue=""
    //             label="Miembros actuales del proyecto"
    //             // isRequired
    //         >
    //             {({ fieldProps, error, valid }) => (
    //                 <Select
    //                     {...fieldProps}
    //                     isMulti
    //                     options={estudiantes.map((estudiante) => ({ value: estudiante.email, label: estudiante.email, email: estudiante.email }))}
    //                     value={selectedStudent}
    //                     onChange={(newValue: PropsValue<Estudiantes>, actionMeta: ActionMeta<Estudiantes>) => {
    //                         setSelectedStudent(newValue);
    //                         // Handle the onChange event here
    //                         console.log(newValue);
    //                     }}
    //                     placeholder="Seleccione..."
    //                 />
    //             )}
    //         </Field>
    //     );
    // };

    //**********************************************************************
    //*******************  */ CAMPOS DEL FORMULARIO ************************
    //**********************************************************************




    return (
        <div>
            {/* Placeholder expression */}

            {!editarProyecto ? (
                <Reuniones />
            ) : (
                <>
                    <div
                        style={{
                            display: 'flex',
                            // width: '400px',
                            // maxWidth: '100%',
                            margin: '0 auto',
                            marginLeft: '15px',
                            marginRight: '15px',
                            marginBottom: '30px',
                            flexDirection: 'column',
                        }}
                    >
                    <h1>Editar proyecto</h1>
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
                                    <ShortNameField />
                                    <Name />
                                    {/* // No considerar debido a que da un error, ademas de que se creo una version mejorada */}
                                    {/* <Description /> */}
                                    <DescripcionVer2 />
                                    <UserOwner />                                
                                    {/* seccion dedicada a mostrar los miembros actuales del proyecto*/}
                                    <p style={{marginTop:'8px', marginBottom:'8px'}}>Miembros actuales del proyecto</p>
                                    <div style={{backgroundColor:'white', paddingLeft: '15px', paddingRight:'15px', paddingTop:'1px', paddingBottom:'1px', marginBottom:'8px'}}>
                                        
                                        {proyectoUser?.userMembers.map((miembro) => (
                                            <p style={{textAlign:'left'}}>
                                                {miembro}
                                            </p>
                                        ))}
                                    </div>
                                    {/* seccion dedicada a ingresar nuevos miembros del proyecto */}
                                    <UserMember />
                                    
                                    <br />

                                    <FormFooter>
                                        <ButtonGroup>
                                            {/* <Button onClick={() => cancelarOperacion()}>Cancelar operación</Button> */}
                                            <Button iconBefore={<CrossIcon label="" size="medium" />} onClick={() => cancelarOperacion()} style={{ marginRight: '5x' }}> Cancelar </Button>
                                            <LoadingButton
                                                iconBefore={<CheckIcon label="" size="medium" />}
                                                type="submit"
                                                appearance="primary"
                                                isLoading={submitting}
                                                onClick={() => actualizarInformacion()}
                                                style={{ marginLeft: '5px' }}
                                            >
                                                Actualizar proyecto
                                            </LoadingButton>
                                        </ButtonGroup>
                                    </FormFooter>
                                    {/* para desplazarse por la ventana, considerando que la lista de estudiantes puede ser larga */}
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                </form>
                            )}
                        </Form>
                    </div>
                </>
            )}
        
        
        </div>
    );
};

export default ActualizarProyecto;