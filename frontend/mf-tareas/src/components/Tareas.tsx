import React, { useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import styled from 'styled-components';

// Custom styled components to replace Atlaskit
const StyledButton = styled.button`
  background-color: #00A499;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: #008C82;
  }
`;

const StyledTable = styled.div`
  border: 1px solid #00A499;
  background-color: #E5F6F5;
  border-radius: 4px;
  padding: 16px;
  width: 100%;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #00A499;
  border-radius: 4px;
  background-color: white;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #00A499;
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: #008C82;
  }
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const KanbanBoard = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;
`;

const KanbanColumn = styled.div`
  flex: 1;
  background-color: #E5F6F5;
  border: 1px solid #00A499;
  border-radius: 4px;
  padding: 16px;
  min-height: 300px;
`;

const Tareas: React.FC = () => {

    // Se obtiene el token del usuario logeado
    const tokenUser = localStorage.getItem('tokenUser');

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
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/element/participants/` + correoElectronico, {
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
                
                const responsePerfil = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/element/update/` + idCompromiso, {
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
        <StyledInput
            type="text"
            placeholder="Ingrese el texto que desee buscar"
            name="filtrarResultados"
        />
    );

    // contenido que se visualiza en la página
    return (
        <div>
            {verKanban ? (
                // CASO MOSTRAR KANBAN
                <>
                    <h1 style={{ textAlign: 'center' }}>Mis tareas: Kanban</h1>
                    <div style={{marginTop:"10px", marginBottom:"20px"}}>
                        <StyledButton onClick={() => setVerKanban(false)}>Ver tabla</StyledButton>
                    </div>

                    <KanbanBoard>
                        {/* Tareas nuevas */}
                        <KanbanColumn>
                            <p><strong>Nuevas</strong></p>
                            {compromisosUsuario?.map((compromiso) => (
                                (compromiso.state === "nueva" || compromiso.state === "Nueva") && (
                                    <div key={compromiso._id}>
                                        <div style={{margin: "5%"}}>
                                            {new Date(compromiso.dateLimit) < new Date() && <h3 style={{color: "red", textAlign:"center"}}><strong>Tarea atrasada</strong></h3>}
                                            <p>{compromiso.description}</p>
                                            <p><strong>{"Fecha límite: "}</strong>{new Date(compromiso.dateLimit).toLocaleDateString('es-CL')}</p>
                                            <StyledButton onClick={() => actualizarEstadoTarea(compromiso._id, "desarrollo")}>Pasar a desarrollo</StyledButton>
                                        </div>
                                    </div>
                                )
                            ))}
                        </KanbanColumn>

                        {/* Tareas en desarrollo */}
                        <KanbanColumn>
                            <p><strong>Desarrollo</strong></p>
                            {compromisosUsuario?.map((compromiso) => (
                                (compromiso.state === "desarrollo" || compromiso.state === "Desarrollo") && (
                                    <div key={compromiso._id}>
                                        <div style={{margin: "5%"}}>
                                            {new Date(compromiso.dateLimit) < new Date() && <h3 style={{color: "red", textAlign:"center"}}><strong>Tarea atrasada</strong></h3>}
                                            <p>{compromiso.description}</p>
                                            <p><strong>{"Fecha límite: "}</strong>{new Date(compromiso.dateLimit).toLocaleDateString('es-CL')}</p>
                                            <StyledButton onClick={() => actualizarEstadoTarea(compromiso._id, "nueva")}>Pasar a nueva</StyledButton>
                                            <StyledButton onClick={() => actualizarEstadoTarea(compromiso._id, "completada")}>Pasar a completada</StyledButton>
                                        </div>
                                    </div>
                                )
                            ))}
                        </KanbanColumn>

                        {/* Tareas completadas */}
                        <KanbanColumn>
                            <p><strong>Completadas</strong></p>
                            {compromisosUsuario?.map((compromiso) => (
                                (compromiso.state === "completada" || compromiso.state === "Completada") && (
                                    <div key={compromiso._id}>
                                        <div style={{margin: "5%"}}>
                                            {/* si una tarea es finalizada, no se indicara si es atrasada o no, esto para evitar mal entendidos por una carga visual excesiva */}
                                            {/* {new Date(compromiso.dateLimit) < new Date() && <h3 style={{color: "red", textAlign:"center"}}><strong>Tarea atrasada</strong></h3>} */}
                                            <p>{compromiso.description}</p>
                                            <p><strong>{"Fecha límite: "}</strong>{new Date(compromiso.dateLimit).toLocaleDateString('es-CL')}</p>
                                            <StyledButton onClick={() => actualizarEstadoTarea(compromiso._id, "desarrollo")}>Pasar a desarrollo</StyledButton>
                                            <StyledButton onClick={() => actualizarEstadoTarea(compromiso._id, "archivada")}>Archivar</StyledButton>
                                        </div>
                                    </div>
                                )
                            ))}
                        </KanbanColumn>
                    </KanbanBoard>

                {/* fin del caso kanban */}
                </>


            ) : (

                // CASO MOSTRAR TABLA DE TAREAS
                <>
                    <h1 style={{ textAlign: 'center' }}>Mis tareas: Tabla</h1>
                    <div style={{marginTop:"10px", marginBottom:"30px"}}>
                        <StyledButton onClick={() => setVerKanban(true)}>Ver Kanban</StyledButton>
                    </div>

                    {/* CAMPO PARA FILTRAR DATOS */}
                    <StyledForm onSubmit={(e) => e.preventDefault()}>
                        <FiltrarResultados />
                        <div>
                            <StyledButton type="submit" onClick={() => setcompromisosUsuario(compromisosUsuarioOriginal)}>Restablecer</StyledButton>
                            <StyledButton type="submit" onClick={() => filtrarDatosTabla()}>Buscar</StyledButton>
                        </div>
                    </StyledForm>
                    <br />
                    {/* TABLA CON LAS TAREAS */}
                    <StyledTable>
                        <table>
                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>Descripción</th>
                                    <th>Estado de la tarea</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {compromisosUsuario?.map((compromiso) => (
                                    <tr key={compromiso._id}>
                                        <td>{compromiso.number + "." + compromiso.position}</td>
                                        <td>
                                            {(new Date(compromiso.dateLimit) < new Date() && compromiso.state !== 'completada' && compromiso.state !== 'archivada') && <p style={{color: "red", margin:0}}><strong>Tarea atrasada</strong></p>}
                                            {compromiso.description}
                                            <br />
                                            <strong>{"Fecha límite: "}</strong>{new Date(compromiso.dateLimit).toLocaleDateString('es-CL')}
                                            <hr />
                                        </td>
                                        <td>
                                            <StyledSelect
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
                                            />
                                        </td>
                                        <td>
                                            <StyledButton onClick={() => actualizarEstadoTarea(compromiso._id, compromiso.state)}>Actualizar</StyledButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </StyledTable>
                {/* fin del caso tabla de tareas */}
                </>
            )}
        </div>
    );
};

export default Tareas;