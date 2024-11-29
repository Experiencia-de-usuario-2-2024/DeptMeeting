import React, { useEffect, useState } from "react";
import axios from "axios";
import Button, { ButtonGroup } from '@atlaskit/button';
import LoadingButton from '@atlaskit/button/loading-button';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left'

import { jwtDecode } from 'jwt-decode';
import Proyectos from "./Proyectos";

import TextField from '@atlaskit/textfield';
import TextArea from '@atlaskit/textarea';
import Form, { Field, FormFooter } from '@atlaskit/form';

// Se obtiene el token del usuario logeado
const tokenUser = localStorage.getItem('tokenUser');

import Select, { ActionMeta, PropsValue } from 'react-select';

//*******************************************************************

let miembrosOriginales: string[] = [];
let emailUsuarioPerfil: string = "";

const FormularioNuevoProyecto: React.FC = () => {

    // Interfaz utilizada para mostrar datos del usuario en el select
    interface Estudiantes {
        email: string;
        value: string; 
        label: string;
    }

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

    // Estado para mostrar el formulario de nuevo proyecto
    const [mostrarFormulario, setMostrarFormulario] = React.useState(false);
    //OBTENER TODOS LOS ESTUDIANTES AL PRINCIPIO
    const [estudiantes, setEstudiantes] = React.useState<Estudiantes[]>([]);
    // Estado para almacenar el perfil del usuario
    const [usuarioPerfil, setusuarioPerfil] = React.useState<Usuario>(); 

    useEffect(() => {

        // Obtener de local storage el id del usuario cuyo perfil se va a cargar
        const idPerfil = localStorage.getItem('idPerfil');
        // Obtener los datos del usuario al principio
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
        obtenerDatosUsuario();

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

        // Obtener valor de variable almacenada en el localStorage
        const storedValue = localStorage.getItem('mostrarFormulario');
        if (storedValue) {
            const parsedValue = JSON.parse(storedValue);
            setMostrarFormulario(parsedValue);
        }
    }, []);

    


    // Función para cancelar la operación de creación de un nuevo proyecto
    // Entrada: ninguna
    // Salida: regresar a la página principal de proyectos
    const cancelarOperacion = () => {
        // window.alert("Se ha cancelado la creación de un nuevo proyecto");
        console.log("Cancelar creacion de un nuevo proyecto");
        const newValue = !mostrarFormulario;
        // Guardar valor de la variable en local storage
        localStorage.setItem('mostrarFormulario', JSON.stringify(newValue));
        if (mostrarFormulario == false) {
            setMostrarFormulario(true);
        }
        else{
            setMostrarFormulario(false);    
        }
        
    }

    // Función para finalizar la operación de creación de un nuevo proyecto
    // Entrada: ninguna
    // Salida: regresar a la página principal de proyectos
    const finalizarOperacion = () => {
        window.alert("Proyecto creado con éxito");
        console.log("Finalizar creacion de un nuevo proyecto");
        const newValue = !mostrarFormulario;
        // Guardar valor de la variable en local storage
        localStorage.setItem('mostrarFormulario', JSON.stringify(newValue));
        if (mostrarFormulario == false) {
            setMostrarFormulario(true);
        }
        else{
            setMostrarFormulario(false);    
        }
        
    }

    // Función para crear un nuevo proyecto -> de momento solo imprime por consola los elementos ingresados en el formulario
    // Entrada: Ninguna
    // Salida: Mensaje de exito o error
    const crearProyecto = () => {
        const shortNameValue = (document.getElementsByName("shortName")[0] as HTMLInputElement).value;
        const nameValue = (document.getElementsByName("name")[0]as HTMLInputElement).value;
        const descriptionValueVer2 = (document.getElementsByName("descriptionVer2")[0]as HTMLInputElement).value;
        // const descriptionValue = (document.getElementsByName("description")[0]as HTMLInputElement);
        const userOwnerValue = (document.getElementsByName("userOwner")[0]as HTMLInputElement).value;
        const userMemberElements = document.getElementsByName("userMember");

        // caso no se haya seleccionado ningun estudiante
        if ((userMemberElements[0] as HTMLInputElement).value == ""){
            window.alert("Al parecer hay campos obligatorios (*) incompletos en el formulario, debes llenarlos para finalizar la creación del proyecto.");
            return;
        }

        // resto de comprobaciones
        if (shortNameValue === "" || nameValue === "" || descriptionValueVer2 === "" || userOwnerValue === "") {
            window.alert("Al parecer hay campos obligatorios (*) incompletos en el formulario, debes llenarlos para finalizar la creación del proyecto.");
            return;
        }
        miembrosOriginales = [];
        // se añade el dueño del proyecto a la lista de miembros originales (mas adelante se añade a los demas)
        miembrosOriginales.push(userOwnerValue);
        
        // Imprimir por consola los valores ingresados en el formulario
        console.log("shortNameValue: ", shortNameValue);
        console.log("nameValue: ", nameValue);
        console.log("descriptionValueVer2: ", descriptionValueVer2);
        // console.log("descriptionValue: ", descriptionValue); //REVISAR ESTO, ENTREGA NULL, NO DEFINIDO
        console.log("userOwnerValue: ", userOwnerValue);
        userMemberElements.forEach((element: HTMLElement) => {
            console.log("userMemberValue: ", (element as HTMLInputElement).value);
        });

        //  1. Realizar peticion para crear proyecto
        async function peticionCrearProyecto() {
            try {            
                const responseProyecto = await axios.post(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/project/create`, {
                    shortName: shortNameValue,
                    name: nameValue,
                    description: descriptionValueVer2,
                    userOwner: userOwnerValue
                }, {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Proyecto creado");
                console.log(responseProyecto.data);
                // Almacenar idProyecto en el localStorage
                const idProyecto = responseProyecto.data._id;
                localStorage.setItem('idProyecto', idProyecto);

                // idProyecto = responseProyecto.data._id;
            } catch (error) {
                console.error(error);
            }
        }
        
        //  2. Realizar peticion para añadir participantes al proyecto -> OJO, se debe revisar si no hay elementos, porque puede ser que la persona no quiera añadir a nadie
        async function incluirParticipantes(idProyecto: string ,correoEstudiante: string) {
            console.log("id del proyecto: ", idProyecto);
            console.log("correo del estudiante: ", correoEstudiante);
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

        // 2.1 Realizar peticion para actualizar atributos del participante: id de proyecto y nombre abreviado del proyecto -> se creara un nuevo metodo que permita actualizar usuario por correo electronico
        async function ActualizarParticipantes(correoEstudiante: string, idProyecto: string, nombreAbreviadoProyecto: string) {
            try {            
                const response = await axios.put(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/user/update/`+correoEstudiante+'/usuarioperfil', {
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

        // 2.2: se actualiza el proyecto de tal forma guardar en el atributo userMembersOriginal lo mismo que existe en userMembers
        async function ActualizarProyecto(idProyecto: string, listaOriginal:string[]) {
            try {            
                const response = await axios.put(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/project/`+idProyecto, {
                    userMembersOriginal: listaOriginal
                },{
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Proyecto actualizado correctamente: Se realizo copia de miembros originales del proyecto");
                console.log(response.data);
                miembrosOriginales = [];
            } catch (error) {
                console.error(error);
            }
        }

        // 3. Asegurar que las funciones se ejecuten en el orden que corresponde (primero si o si crea el proyecto y despues añade a los participantes)
        async function createProjectAndIncludeParticipants() {
            await peticionCrearProyecto();
            const idProyectoRecuperado = localStorage.getItem('idProyecto');
            userMemberElements.forEach((element: HTMLElement) => {
                // incluir participantes en el proyecto
                miembrosOriginales.push((element as HTMLInputElement).value);
                incluirParticipantes(idProyectoRecuperado || "", (element as HTMLInputElement).value);
                ActualizarParticipantes((element as HTMLInputElement).value, idProyectoRecuperado || "", shortNameValue);
                // actualizar atributos del participante: id de proyecto y nombre abreviado del proyecto
            });
        }
        
        // 4. Finalizar la operacion
        async function fin(){
            await createProjectAndIncludeParticipants();
            await ActualizarProyecto(localStorage.getItem('idProyecto') || "", miembrosOriginales);
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
            defaultValue=""
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
            defaultValue=""
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
            defaultValue=""
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
            defaultValue={emailUsuarioPerfil}
            label="Dueño/a del proyecto (correo electrónico)"
            isRequired
        >
            {({ fieldProps, error, valid }) => <TextField {...fieldProps} />}
        </Field>
    );

    const UserMember = () => {
        const [selectedStudent, setSelectedStudent] = useState<PropsValue<Estudiantes>>([]);
        return (
            <Field
                aria-required={true}
                name="userMember"
                defaultValue=""
                label="Miembros del proyecto"
                isRequired
            >
                {({ fieldProps, error, valid }) => 
                (
                    <Select
                        {...fieldProps}
                        isMulti
                        options={estudiantes.map((estudiante) => ({ value: estudiante.email, label: estudiante.email, email: estudiante.email }))}
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
    //**********************************************************************
    //*******************  */ CAMPOS DEL FORMULARIO ************************
    //**********************************************************************

    return (
        <div>
            
            {!mostrarFormulario ? (
                <Proyectos />
            ) : (
                <>
                    <div
                        style={{
                            display: 'flex',
                            margin: '0 auto',
                            marginLeft: '15px',
                            marginRight: '15px',
                            marginBottom: '30px',
                            flexDirection: 'column',
                        }}
                    >
                    <h1>Creación de nuevo proyecto</h1>
                        <Form<{ username: string }>
                            onSubmit={(data) => {
                                return new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>
                                    data.username === 'error' ? { username: 'IN_USE' } : undefined,
                                );
                            }}
                        >
                            {({ formProps, submitting }) => (
                                <form {...formProps}>
                                    <ShortNameField />
                                    <Name />
                                    {/* // No considerar debido a que da un error */}
                                    {/* <Description /> */}
                                    <DescripcionVer2 />
                                    <UserOwner />
                                    <UserMember />

                                    <FormFooter>
                                        <ButtonGroup>
                                            {/* <Button onClick={() => cancelarOperacion()}>Cancelar operación</Button> */}
                                            <Button iconBefore={<ArrowLeftIcon label="" size="medium" />} onClick={() => cancelarOperacion()} style={{ marginRight: '5x' }}> Regresar </Button>
                                            {/* EN ESTE BOTON SE TIENE PRIMERO QUE CREAR EL PROYECTO Y DESPUES AÑADIR LOS PARTICIPANTES AL PROYECTOS, EN ESE ORDEN SE TIENEN QUE HACER LAS PETICIONES */}
                                            <LoadingButton
                                                type="submit"
                                                appearance="primary"
                                                isLoading={submitting}
                                                onClick={() => crearProyecto()}
                                                style={{ marginLeft: '5px' }}
                                            >
                                                Crear proyecto
                                            </LoadingButton>
                                        </ButtonGroup>
                                    </FormFooter>
                                    {/* se agrega para que exista una mayor comodidad para el campo select */}
                                    <div style={{height:'500px'}}></div>
                                </form>
                            )}
                        </Form>
                    </div>
                </>
            )}
        </div>
    );


};

export default FormularioNuevoProyecto;