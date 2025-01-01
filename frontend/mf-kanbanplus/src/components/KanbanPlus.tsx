import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import styled from "styled-components";

// Se obtiene el token del usuario logeado
const tokenUser = localStorage.getItem("tokenUser");

const KanbanBoard = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px;
`;

const KanbanColumn = styled.div`
  flex: 1;
  background-color: #E5F6F5;
  border: 1px solid #00A499;
  border-radius: 4px;
  padding: 16px;
  min-height: 300px;
`;

const TaskCard = styled.div`
  background: white;
  border: 1px solid #00A499;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 8px;
`;

const StyledButton = styled.button`
  background-color: #00A499;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  margin: 4px;
  
  &:hover {
    background-color: #008C82;
  }
`;

const StyledForm = styled.form`
  padding: 16px;
`;

const StyledField = styled.div`
  margin-bottom: 16px;
`;

const StyledLabel = styled.label`
  display: block;
  margin-bottom: 8px;
`;

const StyledInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
`;

const StyledSelect = styled.select`
  width: 100%;
  height: 40px;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
`;

const StyledOption = styled.option``;

const KanbanPlus: React.FC = () => {
  // interfaz para guardar los datos de los estudiantes
  interface Estudiantes {
    color: string;
    email: string;
    name: string;
    avatar: string;
    password: string;
    tagname: string;
    type: string;
    __v: number;
    _id: string;
    currentProject: string;
    currentProjectId: string;
    currentMeeting: string;
    currentMeetingId: string;
    proyectoPrincipal: string;
  }

  // Interfaz para los datos de las tareas/compromisos de UN usuario
  interface Compromiso {
    description: string; // *
    type: string; // *
    participants: string[]; // *
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

  // para guardar la lista de compromisos
  const listaCompromisosTodosUsuarios: Compromiso[] = [];

  // para guardar la lista de estudiantes
  let listaEstudiantes: Estudiantes[] = [];

  // para guardar los datos de los estudiantes
  const [estudiantes, setEstudiantes] = React.useState<Estudiantes[]>([]);

  // para guardar una lista de compromisos
  const [compromisos, setCompromisos] = React.useState<Compromiso[]>([]);

  const [compromisosUsuarioOriginal, setcompromisosUsuarioOriginal] =
    React.useState<Compromiso[]>([]);

  useEffect(() => {
    // Para obtener los datos de los estudiantes al inicio
    async function obtenerEstudiantes() {
      try {
        // A partir del token del usuario logeado se obtiene el correo electronico, que sera usado para obtener los estudiantes del usuario logeado
        const decodedToken: any = tokenUser ? jwtDecode(tokenUser) : null;
        const correoElectronico = decodedToken.email;
        console.log("email traido desde el token: ", correoElectronico);

        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/user/list/email/` +
            correoElectronico,
          {
            headers: {
              Authorization: `Bearer ${tokenUser}`,
            },
          }
        );
        console.log("Todos los usuarios");
        console.log(response.data);
        setEstudiantes(response.data);
        listaEstudiantes = response.data;
        console.log("Lista de estudiantes: ", listaEstudiantes);
      } catch (error) {
        console.error(error);
      }
    }

    const fetchData = async () => {
      await obtenerEstudiantes();
      // Recorrer la lista de estudiantes para obtener los compromisos de cada uno y guardarlos en la listaCompromisosTodosUsuarios
      listaEstudiantes.map((estudiante) => {
        obtenerCompromisosUsuario(estudiante.email);
      });
    };
    fetchData();
  }, []);

  // funcion para obtener los compromisos de un usuario
  async function obtenerCompromisosUsuario(email: string) {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/element/participants/` +
          email,
        {
          headers: {
            Authorization: `Bearer ${tokenUser}`,
          },
        }
      );
      console.log("Compromisos de un estudiante");
      console.log(response.data);
      const filteredData = response.data.filter(
        (item: Compromiso) => item.type.toLowerCase() === "compromiso"
      );
      setCompromisos((prevCompromisos) => [
        ...prevCompromisos,
        ...filteredData,
      ]);
      setcompromisosUsuarioOriginal((prevCompromisos) => [
        ...prevCompromisos,
        ...filteredData,
      ]);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  // funcion para filtrar los datos de la tabla
  const filtrarDatosTabla = () => {
    // capturar el valor del formulario
    const textoBuscar = (
      document.getElementsByName("filtrarResultados")[0] as HTMLInputElement
    ).value;
    if (
      textoBuscar === "" ||
      textoBuscar === " " ||
      textoBuscar === null ||
      textoBuscar === undefined
    ) {
      // window.alert("Por favor, ingrese un texto para buscar");
      window.alert("Por favor, seleccione un estudiante para buscar");
      return;
    }

    // Buscar en "compromisosUsuario" aquel con description que contenga "textoBuscar", para posteriormente actualizar el valor de "compromisosUsuario"
    const updatedCompromisosUsuario = compromisosUsuarioOriginal?.filter(
      (compromiso) =>
        compromiso.participants[0]
          .toLowerCase()
          .includes(textoBuscar.toLowerCase())
    );
    setCompromisos(updatedCompromisosUsuario);
    console.log("Tareas filtradas: ", updatedCompromisosUsuario);
  };

  // en vez de solicitar al usuario que ingrese el texto a buscar, se le proporciona un select para que seleccione el estudiante
  const FiltrarResultadosVer2 = () => {
    const [selectedStudent, setSelectedStudent] = useState<
      PropsValue<Estudiantes>
    >([]);
    return (
      <StyledField>
        <StyledLabel>Seleccione un proyecto o estudiante para filtrar los resultados</StyledLabel>
        <StyledSelect
          // options={estudiantes.map((estudiante) => ({ value: estudiante.email, label: estudiante.email, email: estudiante.email }))}
          options={estudiantes.map((estudiante) => ({
            value: estudiante.email,
            label: estudiante.proyectoPrincipal + " - " + estudiante.email,
            email: estudiante.email,
            color: estudiante.color,
            name: estudiante.name,
            avatar: estudiante.avatar,
            password: estudiante.password,
            tagname: estudiante.tagname,
            type: estudiante.type,
            __v: estudiante.__v,
            _id: estudiante._id,
            currentProject: estudiante.currentProject,
            currentProjectId: estudiante.currentProjectId,
            currentMeeting: estudiante.currentMeeting,
            currentMeetingId: estudiante.currentMeetingId,
            proyectoPrincipal: estudiante.proyectoPrincipal,
          }))}
          value={selectedStudent}
          onChange={(
            newValue: PropsValue<Estudiantes>,
            actionMeta: ActionMeta<Estudiantes>
          ) => {
            setSelectedStudent(newValue);
            // Handle the onChange event here
            console.log(newValue);
          }}
          placeholder="Seleccione..."
        />
      </StyledField>
    );
  };

  return (
    <div>
      <StyledForm>
        <FiltrarResultadosVer2 />
        <StyledButton
          type="submit"
          onClick={() => setCompromisos(compromisosUsuarioOriginal)}
        >
          Restablecer
        </StyledButton>
        <StyledButton type="submit" onClick={() => filtrarDatosTabla()}>
          Buscar
        </StyledButton>
      </StyledForm>
      <br />

      <KanbanBoard>
        {/* Tareas nuevas */}
        <KanbanColumn>
          <h3>Nuevas</h3>
          {compromisos?.map(
            (compromiso) =>
              (compromiso.state === "nueva" ||
                compromiso.state === "Nueva") && (
                <TaskCard key={compromiso._id}>
                  <div style={{ margin: "5%" }}>
                    {new Date(compromiso.dateLimit) < new Date() && (
                      <h3 style={{ color: "red", textAlign: "center" }}>
                        <strong>Tarea atrasada</strong>
                      </h3>
                    )}
                    <p>
                      <strong>Encargado/a: </strong>
                      {compromiso.participants}
                    </p>
                    <p>{compromiso.description}</p>
                    <p>
                      <strong>{"Fecha límite: "}</strong>
                      {new Date(compromiso.dateLimit).toLocaleDateString(
                        "es-CL"
                      )}
                    </p>
                  </div>
                </TaskCard>
              )
          )}
        </KanbanColumn>

        {/* Tareas en desarrollo */}
        <KanbanColumn>
          <h3>Desarrollo</h3>
          {compromisos?.map(
            (compromiso) =>
              (compromiso.state === "desarrollo" ||
                compromiso.state === "Desarrollo") && (
                <TaskCard key={compromiso._id}>
                  <div style={{ margin: "5%" }}>
                    {new Date(compromiso.dateLimit) < new Date() && (
                      <h3 style={{ color: "red", textAlign: "center" }}>
                        <strong>Tarea atrasada</strong>
                      </h3>
                    )}
                    <p>
                      <strong>Encargado/a: </strong>
                      {compromiso.participants}
                    </p>
                    <p>{compromiso.description}</p>
                    <p>
                      <strong>{"Fecha límite: "}</strong>
                      {new Date(compromiso.dateLimit).toLocaleDateString(
                        "es-CL"
                      )}
                    </p>
                  </div>
                </TaskCard>
              )
          )}
        </KanbanColumn>

        {/* Tareas completadas */}
        <KanbanColumn>
          <h3>Completadas</h3>
          {compromisos?.map(
            (compromiso) =>
              (compromiso.state === "completada" ||
                compromiso.state === "Completada") && (
                <TaskCard key={compromiso._id}>
                  <div style={{ margin: "5%" }}>
                    <p>
                      <strong>Encargado/a: </strong>
                      {compromiso.participants}
                    </p>
                    <p>{compromiso.description}</p>
                    <p>
                      <strong>{"Fecha límite: "}</strong>
                      {new Date(compromiso.dateLimit).toLocaleDateString(
                        "es-CL"
                      )}
                    </p>
                  </div>
                </TaskCard>
              )
          )}
        </KanbanColumn>
      </KanbanBoard>
    </div>
  );
};

export default KanbanPlus;
