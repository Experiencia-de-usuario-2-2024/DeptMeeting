import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Inline, Box, xcss } from "@atlaskit/primitives";
import Form, { ErrorMessage, Field, FormFooter } from "@atlaskit/form";
import TextField from "@atlaskit/textfield";
import Button from "@atlaskit/button";
import Select, { ActionMeta, PropsValue } from "react-select";

// Se obtiene el token del usuario logeado
const tokenUser = localStorage.getItem("tokenUser");

const boxStyles = xcss({
  borderColor: "color.border.selected",
  // width: '500px',
  width: "100%",
  backgroundColor: "color.background.selected",
  borderStyle: "solid",
  borderRadius: "border.radius",
  borderWidth: "border.width",
});

const boxStylesTarjetas = xcss({
  borderColor: "color.border.selected",
  // width: '500px',
  margin: "5%",
  width: "90%",
  backgroundColor: "color.background.input",
  borderStyle: "solid",
  borderRadius: "border.radius",
  borderWidth: "border.width",
});

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
          `http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/user/list/email/` +
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
        `http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/element/participants/` +
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

  // YA NO UTILIZADO, SE IMPLEMENTO UNA MEJORA
  // campo de formulario para que el usuario ingrese lo que desea buscar para realizar el filtrado
  const FiltrarResultados = () => (
    <Field
      aria-required={true}
      name="filtrarResultados"
      defaultValue=""
      label="Ingrese el correo electrónico del estudiante a buscar"
    >
      {({ fieldProps, error, valid }) => <TextField {...fieldProps} />}
    </Field>
  );

  // en vez de solicitar al usuario que ingrese el texto a buscar, se le proporciona un select para que seleccione el estudiante
  const FiltrarResultadosVer2 = () => {
    const [selectedStudent, setSelectedStudent] = useState<
      PropsValue<Estudiantes>
    >([]);
    return (
      <Field
        aria-required={true}
        name="filtrarResultados"
        defaultValue=""
        label="Seleccione un proyecto o estudiante para filtrar los resultados"
        // isRequired
      >
        {({ fieldProps, error, valid }) => (
          <Select
            {...fieldProps}
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
        )}
      </Field>
    );
  };

  return (
    <>
      <div>
        {/* formulario que permita al usuario filtar los resultados de busqueda */}
        <Form<{ username: string }>
          onSubmit={(data) => {
            return new Promise((resolve) => setTimeout(resolve, 2000)).then(
              () =>
                data.username === "error" ? { username: "IN_USE" } : undefined
            );
          }}
        >
          {({ formProps, submitting }) => (
            <form {...formProps}>
              {/* <FiltrarResultados /> */}
              <FiltrarResultadosVer2 />
              <FormFooter>
                <Inline space="space.100" alignBlock="center">
                  <Button
                    type="submit"
                    // appearance="primary"
                    onClick={() => setCompromisos(compromisosUsuarioOriginal)}
                    // style={{ marginLeft: '5px' }}
                  >
                    Restablecer
                  </Button>
                  <Button
                    type="submit"
                    appearance="primary"
                    onClick={() => filtrarDatosTabla()}
                    // style={{ marginLeft: '5px' }}
                  >
                    Buscar
                  </Button>
                </Inline>
              </FormFooter>
            </form>
          )}
        </Form>
        <br />

        <Inline space="space.400" alignBlock="stretch">
          {/* Tareas nuevas */}
          <Box xcss={boxStyles}>
            <div style={{ textAlign: "center" }}>
              <h1>
                <strong>Nuevas</strong>
              </h1>
            </div>
            {compromisos?.map(
              (compromiso) =>
                (compromiso.state === "nueva" ||
                  compromiso.state === "Nueva") && (
                  <Box xcss={boxStylesTarjetas} key={compromiso._id}>
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
                  </Box>
                )
            )}
          </Box>

          {/* Tareas en desarrollo */}
          <Box backgroundColor="color.background.discovery" xcss={boxStyles}>
            <div style={{ textAlign: "center" }}>
              <h1>
                <strong>Desarrollo</strong>
              </h1>
            </div>
            {compromisos?.map(
              (compromiso) =>
                (compromiso.state === "desarrollo" ||
                  compromiso.state === "Desarrollo") && (
                  <Box xcss={boxStylesTarjetas} key={compromiso._id}>
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
                  </Box>
                )
            )}
          </Box>

          {/* Tareas completadas */}
          <Box backgroundColor="color.background.discovery" xcss={boxStyles}>
            <div style={{ textAlign: "center" }}>
              <h1>
                <strong>Completadas</strong>
              </h1>
            </div>
            {compromisos?.map(
              (compromiso) =>
                (compromiso.state === "completada" ||
                  compromiso.state === "Completada") && (
                  <Box xcss={boxStylesTarjetas} key={compromiso._id}>
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
                  </Box>
                )
            )}
          </Box>
        </Inline>
      </div>
    </>
  );
};

export default KanbanPlus;
