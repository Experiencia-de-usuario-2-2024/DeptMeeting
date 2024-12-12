import React, { useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import DynamicTable from '@atlaskit/dynamic-table';
import Select from '@atlaskit/select';
import Button from '@atlaskit/button';
import { Inline, Box, xcss } from '@atlaskit/primitives';
import ArrowRightIcon from '@atlaskit/icon/glyph/arrow-right'
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left'
import TextField from '@atlaskit/textfield';
import Form, { Field, FormFooter } from '@atlaskit/form';
import ArchiveIcon from '@atlaskit/icon/glyph/archive'

// Se obtiene el token del usuario logeado
const tokenUser = localStorage.getItem('tokenUser');

const boxStyles = xcss({
    borderColor: 'color.border.selected',
    width: '100%',
    backgroundColor: 'color.background.selected',
    borderStyle: 'solid',
    borderRadius: 'border.radius',
    borderWidth: 'border.width',
});

const boxStylesTarjetas = xcss({
    borderColor: 'color.border.selected',
    margin: '5%',
    width: '90%',
    backgroundColor: 'color.background.input',
    borderStyle: 'solid',
    borderRadius: 'border.radius',
    borderWidth: 'border.width',
});

const Tareas: React.FC = () => {



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
        position: string;
        isSort: string;
        _id: string;
        createdAt: string;
        updatedAt: string;
        disagreement: JSON;
    }


    // Estado para almacenar las tareas del usuario
    const [compromisosUsuario, setcompromisosUsuario] = React.useState<Compromiso[]>();
    const [compromisosUsuarioOriginal, setcompromisosUsuarioOriginal] = React.useState<Compromiso[]>();

    // para determinar que seccion mostrar: Tabla de tareas vs kanban
    const [verKanban, setVerKanban] = React.useState(false);


    useEffect(() => {
        // Cada vez que se recargue la pagina, se dejara por defecto ver la tabla de tareas
        localStorage.setItem('verKanban', JSON.stringify(false));
        const storedValue = localStorage.getItem('verKanban');
        if (storedValue) {
            const parsedValue = JSON.parse(storedValue);
            setVerKanban(parsedValue);
        }

        // funcion para obtener las tareas del usuario 
        async function obtenerCompromisosUsuario() {
            try {
                const decodedToken: any = tokenUser ? jwtDecode(tokenUser) : null;
                const correoElectronico = decodedToken.email;
                const response = await axios.get(`http://deptmeeting.diinf.usach.cl/api/api/element/participants/` + correoElectronico, {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log(response.data);
                const filteredData = response.data.filter((item: Compromiso) => item.type.toLowerCase() === 'compromiso');
                setcompromisosUsuario(filteredData);
                setcompromisosUsuarioOriginal(filteredData);

            } catch (error) {
                console.error(error);
            }
        }
        obtenerCompromisosUsuario()
    }, []);

    
    // Entrada: idCompromiso: string (id de la tarea seleccionada), nuevoEstado: string (nuevo estado seleccionado por el usuario)
    // Salida: ninguna
    // Funcion para actualizar el estado de una tarea
    const actualizarEstadoTarea = (idCompromiso: string, nuevoEstado: string) => {
        async function peticionActualizarEstadoTarea() {
            try {            
                
                const responsePerfil = await axios.put(`http://deptmeeting.diinf.usach.cl/api/api/element/update/` + idCompromiso, {
                    state: nuevoEstado,
                }, {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                console.log("Estado de la tarea actualizado correctamente");
            
            } catch (error) {
                console.error(error);
            }
        }
        peticionActualizarEstadoTarea();

        // Buscar en "compromisosUsuario" aquel con _id igual a "idCompromiso" y actualizar el valor state
        const updatedCompromisosUsuario = compromisosUsuario?.map(compromiso => {
            if (compromiso._id === idCompromiso) {
                return {
                    ...compromiso,
                    state: nuevoEstado
                };
            }
            return compromiso;
        });
        setcompromisosUsuario(updatedCompromisosUsuario);
    }


    const filtrarDatosTabla = () => {
        // capturar el valor del formulario
        const textoBuscar = (document.getElementsByName("filtrarResultados")[0] as HTMLInputElement).value;

        // comprobar que el usuario haya ingresado un texto para buscar
        if (textoBuscar === "" || textoBuscar === " " || textoBuscar === null || textoBuscar === undefined) {
            window.alert("Por favor, ingrese un texto para buscar");
            return;
        }

        // Buscar en "compromisosUsuario" aquel con description que contenga "textoBuscar", para posteriormente actualizar el valor de "compromisosUsuario"
        const updatedCompromisosUsuario = compromisosUsuarioOriginal?.filter(compromiso => compromiso.description.toLowerCase().includes(textoBuscar.toLowerCase()));
        setcompromisosUsuario(updatedCompromisosUsuario);
        console.log("Tareas filtradas: ", updatedCompromisosUsuario);
    }

    // campo de formulario para que el usuario ingrese lo que desea buscar para realizar el filtrado
    const FiltrarResultados = () => (
        <Field
            aria-required={true}
            name="filtrarResultados"
            defaultValue=""
            label="Ingrese el texto que desee buscar"
        >
            {({ fieldProps, error, valid }) => <TextField {...fieldProps} />}
        </Field>
    );


    //**********************************************************************
    //*******************  */ Funcion para la tabla de tareas/compromisos **
    //**********************************************************************
    function createKey(input: string) {
        return input ? input.replace(/^(the|a|an)/, '').replace(/\s/g, '') : input;
    }


// contenido que se visualiza en la página
return (
    <div>
        

        {verKanban ? (
            // CASO MOSTRAR KANBAN
            <>
                <h1 style={{ textAlign: 'center' }}>Mis tareas: Kanban</h1>
                <div style={{marginTop:"10px", marginBottom:"20px"}}>
                    <Button appearance="primary" onClick={() => setVerKanban(false)}>Ver tabla</Button>
                </div>

                <Inline space="space.100" alignBlock="stretch">
                {/* Tareas nuevas */}
                    <Box xcss={boxStyles}>
                        <p><strong>Nuevas</strong></p>
                        {compromisosUsuario?.map((compromiso) => (
                            (compromiso.state === "nueva" || compromiso.state === "Nueva") && (
                                <Box xcss={boxStylesTarjetas} key={compromiso._id}>
                                    <div style={{margin: "5%"}}>
                                        {new Date(compromiso.dateLimit) < new Date() && <h3 style={{color: "red", textAlign:"center"}}><strong>Tarea atrasada</strong></h3>}
                                        <p>{compromiso.description}</p>
                                        {/* <p><strong>{"Fecha límite: "}</strong>{new Date(compromiso.dateLimit).toLocaleDateString()}</p> */}
                                        <p><strong>{"Fecha límite: "}</strong>{new Date(compromiso.dateLimit).toLocaleDateString('es-CL')}</p>
                                        <Button onClick={() => actualizarEstadoTarea(compromiso._id, "desarrollo")} iconBefore={<ArrowRightIcon label="" size="medium" />} appearance="primary"></Button>
                                    </div>
                                </Box>
                            )
                        ))}
                        
                    </Box>

                    {/* Tareas en desarrollo */}
                    <Box backgroundColor="color.background.discovery" xcss={boxStyles}>
                        <p><strong>Desarrollo</strong></p>
                        {compromisosUsuario?.map((compromiso) => (
                            (compromiso.state === "desarrollo" || compromiso.state === "Desarrollo") && (
                                <Box xcss={boxStylesTarjetas} key={compromiso._id}>
                                    <div style={{margin: "5%"}}>
                                        {new Date(compromiso.dateLimit) < new Date() && <h3 style={{color: "red", textAlign:"center"}}><strong>Tarea atrasada</strong></h3>}
                                        <p>{compromiso.description}</p>
                                        {/* <p><strong>{"Fecha límite: "}</strong>{new Date(compromiso.dateLimit).toLocaleDateString()}</p> */}
                                        <p><strong>{"Fecha límite: "}</strong>{new Date(compromiso.dateLimit).toLocaleDateString('es-CL')}</p>
                                        <Inline space="space.100" alignInline="center">
                                            <Button onClick={() => actualizarEstadoTarea(compromiso._id, "nueva")} iconBefore={<ArrowLeftIcon label="" size="medium" />} appearance="primary"></Button>
                                            <Button onClick={() => actualizarEstadoTarea(compromiso._id, "completada")} iconBefore={<ArrowRightIcon label="" size="medium" />} appearance="primary"></Button>
                                        </Inline>
                                        
                                    </div>
                                </Box>
                            )
                        ))}
                    </Box>

                    {/* Tareas completadas */}
                    <Box backgroundColor="color.background.discovery" xcss={boxStyles}>
                        <p><strong>Completadas</strong></p>
                        {compromisosUsuario?.map((compromiso) => (
                            (compromiso.state === "completada" || compromiso.state === "Completada") && (
                                <Box xcss={boxStylesTarjetas} key={compromiso._id}>
                                    <div style={{margin: "5%"}}>
                                        {/* si una tarea es finalizada, no se indicara si es atrasada o no, esto para evitar mal entendidos por una carga visual excesiva */}
                                        {/* {new Date(compromiso.dateLimit) < new Date() && <h3 style={{color: "red", textAlign:"center"}}><strong>Tarea atrasada</strong></h3>} */}
                                        <p>{compromiso.description}</p>
                                        {/* <p><strong>{"Fecha límite: "}</strong>{new Date(compromiso.dateLimit).toLocaleDateString()}</p> */}
                                        <p><strong>{"Fecha límite: "}</strong>{new Date(compromiso.dateLimit).toLocaleDateString('es-CL')}</p>
                                        <Inline space="space.100" alignInline="center">
                                            <Button onClick={() => actualizarEstadoTarea(compromiso._id, "desarrollo")} iconBefore={<ArrowLeftIcon label="" size="medium" />} appearance="primary"></Button>
                                            <Button onClick={() => actualizarEstadoTarea(compromiso._id, "archivada")} iconBefore={<ArchiveIcon label="" size="medium" />}>Archivar</Button>
                                        </Inline>
                                    </div>
                                </Box>
                            )
                        ))}

                    </Box>
                </Inline>

            {/* fin del caso kanban */}
            </>


        ) : (

            
            // CASO MOSTRAR TABLA DE TAREAS
            <>
                <h1 style={{ textAlign: 'center' }}>Mis tareas: Tabla</h1>
                <div style={{marginTop:"10px", marginBottom:"30px"}}>
                    <Button appearance="primary" onClick={() => setVerKanban(true)}>Ver Kanban</Button>
                </div>

                {/* CAMPO PARA FILTRAR DATOS */}
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
                            <FiltrarResultados />
                            <FormFooter>
                                <Inline space="space.100" alignBlock="center">
                                    <Button
                                        type="submit"
                                        onClick={() => setcompromisosUsuario(compromisosUsuarioOriginal)}
                                    >
                                        Restablecer
                                    </Button>
                                    <Button
                                        type="submit"
                                        appearance="primary"
                                        onClick={() => filtrarDatosTabla()}
                                    >
                                        Buscar
                                    </Button>
                                </Inline>
                            </FormFooter>
                        </form>
                    )}
                </Form>
                <br />
                {/* TABLA CON LAS TAREAS */}
                <DynamicTable
                    emptyView={<h2>El usuario no posee tareas</h2>}
                    rowsPerPage={4}
                    defaultPage={1}
                    defaultSortKey="number" // Ordenar por número de reunión de forma predeterminada
                    defaultSortOrder="ASC" // Orden ascendente de forma predeterminada
                    head={{
                        cells: [
                            {
                                key: 'number',
                                content: 'id',
                                isSortable: true,
                                width: 1,
                                
                            },
                            {
                                key: 'description',
                                content: 'Descripción',
                                width: 20,
                                
                            },

                            {
                                key: 'state',
                                content: 'Estado de la tarea',
                                isSortable: true,
                                width: 7,
                                
                            },
                            {
                                key: 'botonActualizar',
                                content: '',
                                width: 5,
                            },
                        ],
                    }}
                    rows={compromisosUsuario?.map((compromiso) => ({
                        key: compromiso.number.toString() + "." + compromiso.position,
                        isHighlighted: false,
                        cells: [
                            {
                                // key: 'number',
                                key: createKey(compromiso.number.toString() + "." + compromiso.position),
                                content: compromiso.number + "." + compromiso.position,
                            },
                            {
                                key: 'description',
                                content: (
                                    <>
                                        {(new Date(compromiso.dateLimit) < new Date() && compromiso.state !== 'completada' && compromiso.state !== 'archivada') && <p style={{color: "red", margin:0}}><strong>Tarea atrasada</strong></p>}
                                        {compromiso.description}
                                        <br />
                                        <strong>{"Fecha límite: "}</strong>{new Date(compromiso.dateLimit).toLocaleDateString('es-CL')}
                                        <hr />
                                    </>
                                ),
                            },
                            {
                                key: createKey(compromiso.state),
                                content: <Select
                                            inputId="single-select-example"
                                            className="single-select"
                                            classNamePrefix="react-select"
                                            defaultValue={{ label: compromiso.state, value: compromiso.state }}
                                            options={[
                                            { label: 'nueva', value: 'nueva' },
                                            { label: 'desarrollo', value: 'desarrollo' },
                                            { label: 'completada', value: 'completada' },
                                            { label: 'archivada', value: 'archivada' },
                                            ]}
                                            onChange={(selected) => {
                                                if (selected) {
                                                    compromiso.state = selected.value;
                                                }
                                            }}
                                            placeholder="Estado de la tarea"
                                        />
                            },
                            {
                                key: 'botonActualizar',
                                content: <Button onClick={() => actualizarEstadoTarea(compromiso._id, compromiso.state)} appearance="primary">Actualizar</Button>,
                            },
                        ],
                    }))}
                />
            {/* fin del caso tabla de tareas */}
            </>
        )}
                
    </div>
);
};

export default Tareas;