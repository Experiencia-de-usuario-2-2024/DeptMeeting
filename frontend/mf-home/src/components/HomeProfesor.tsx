import React, { useEffect } from "react";
import { Box, Inline, xcss } from "@atlaskit/primitives";
import Avatar from '@atlaskit/avatar';
import axios from "axios";
import { jwtDecode } from 'jwt-decode';

// Se obtiene el token del usuario logeado
const tokenUser = localStorage.getItem('tokenUser');

const listStyles = xcss({
    paddingInlineStart: 'space.0',
});
const boxStyles = xcss({
    color: 'color.text',
    width: '200px',
    height: '224px',
    backgroundColor: 'color.background.selected',
    borderWidth: 'border.width',
    borderStyle: 'solid',
    borderColor: 'color.border.selected',
    padding: 'space.100',
    borderRadius: 'border.radius.100',
    transitionDuration: '200ms',
    listStyle: 'none',
    textAlign: 'center',
    '::before': {
        paddingInlineEnd: 'space.050',
    },
    '::after': {
        paddingInlineStart: 'space.050',
    },
    ':hover': {
        backgroundColor: 'color.background.selected.bold.hovered',
        color: 'color.text.inverse',
        transform: 'scale(1.02)',
    },
});


const HomeProfesor: React.FC = () => {

    // interfaz para datos de los estudiantes
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
        proyectoPrincipal: string
        lastLink: string;
    }

    // interfaz para datos de las minutas
    interface MeetingMinute {
        title: string;
        place: string;
        startTime: string;
        endTime: string;
        startHour: string; 
        endHour: string;
        topics: string[];
        participants: string[];
        assistants: string[];
        externals: string[];
        secretaries: string[];
        leaders: string[];
        links: string[];
        number: number;
        meeting: string;
        _id: string;
    }

    // Para determinar si se vera el perfil: ESTO YA NO SE UTILIZA, DEBIDO A UN CAMBIO EN EL COMPORTAMIENTO DEL APLICATIVO WEB
    const [verPerfil, setVerPerfil] = React.useState(false);
    
    // Para determinar si se muestra en la parte central el acta dialogica o no (en cualquiera que sea su etapa, pre, in, post o finalizada)
    const [verActaDialogica, setVerActaDialogica] = React.useState(false);

    //OBTENER TODOS LOS ESTUDIANTES AL PRINCIPIO
    const [estudiantes, setEstudiantes] = React.useState<Estudiantes[]>([]);
    useEffect(() => {
        // Obtener el valor de la variable almacenada en local storage para saber si se tiene que mostrar la ventana de perfil o no
        const storedValue = localStorage.getItem('verPerfil');
        if (storedValue) {
            const parsedValue = JSON.parse(storedValue);
            setVerPerfil(parsedValue);
        }

        const storedValue2 = localStorage.getItem('verActaDialogica');
        if (storedValue2) {
            const parsedValue2 = JSON.parse(storedValue2);
            setVerActaDialogica(parsedValue2);
        }

        async function obtenerEstudiantes() {
          try {
            // Verifica que tokenUser no sea nulo antes de decodificarlo
            if (!tokenUser) {
              console.error("No se encontró el token del usuario.");
              return; // Termina la ejecución si no hay token
            }

            // Decodifica el token
            const decodedToken: any = jwtDecode(tokenUser);

            // Verifica que el token tenga el email
            const correoElectronico = decodedToken?.email;
            if (!correoElectronico) {
              console.error(
                "No se pudo obtener el correo electrónico del token."
              );
              return;
            }

            console.log("email traido desde el token: ", correoElectronico);

            // Realiza la solicitud HTTP con el correo obtenido
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
          } catch (error) {
            console.error("Error al obtener los estudiantes: ", error);
          }
        }


        obtenerEstudiantes();
    }, []);


    // FUNCIONALIDAD YA NO UTILIZADA DEBIDO A UN CAMBIO DE COMPORTAMIENTO AL MOMENTO DE PRESIONAR EL RECUADRO DE UN ESTUDIANTE
    //GUARDAR EL ID DEL ESTUDIANTE CLICKEADO, ademas de guardar en una variable una indicacion de que se debe ir a la ventana de perfil
    const guardarIdPerfil = (id: string) => {
        console.log("id DEL ESTUDIANTE CLICKEADO: ", id);
        //Se guarda en local storage el id del usuario clickeado (perfil que se vera)
        localStorage.setItem('idPerfil', id); //verPerfil
        const newValue = !verPerfil;

        localStorage.setItem('verPerfil', JSON.stringify(newValue));
        localStorage.setItem('verActaDialogica', JSON.stringify(false));

        if (verPerfil == false) {
            setVerPerfil(true);
        }
        else{
            setVerPerfil(false);    
        }
        window.location.reload();
    }

    // Entrada: id del acta dialogica asociada al estudiante que se vera
    // Salida: ninguna, se cambiaran valores en local storage
    // Funcion que se ejecutara al presionar un recuadro de un estudiante, lo cual desencadenara que se muestre el acta dialogica asociada a ese estudiante (la ultima acta en la que el estudiante interactuo)
    const verActaDialogicaEstudiante = (idActa: string, estadoReu: string, idProyecto: string, idReunion: string) => {

        // caso el estudiante no tiene idActa asociado, se le muestra un mensaje al usuario y se retorna
        if (idActa === "" || idActa === " " ||idActa === null || idActa === undefined || idActa === "undefined" || idActa === "null") {
            window.alert("El estudiante aun no participa en una reunión");
            return;
        }


        // se guarda en local storage el id del acta dialogica que se mostrara
        localStorage.setItem('idMeetingMinute', idActa);

        // se guarda en local storage el id del ultimo proyecto en el que el estudiante participo
        localStorage.setItem('idProyecto', idProyecto);

        // se guarda en local storage el estado en que se encuentra el acta dialogica (pre, en, post o finalizada)
        localStorage.setItem('estadoReunion', estadoReu);

        // se guarda en local storage el id de la reunion asociada al acta dialogica
        localStorage.setItem('idReunion', idReunion);

        // se cambia la variable de verActaDialogica a true, para que se muestre el acta dialogica, posteriormente se actualiza su valor en local storage
        const newValue = !verActaDialogica;
        localStorage.setItem('verActaDialogica', JSON.stringify(newValue));
        if (verActaDialogica == false) {
            setVerActaDialogica(true);
        }
        else{
            setVerActaDialogica(false);    
        }
        window.location.reload();
    }

    return (

        <Inline space="space.200" shouldWrap>
            {estudiantes.map((estudiante) => (
                // Esto se cambiara: Ya no se mostrara el perfil del estudiante clickado, sino que se mostrara la ultima reunion que se tuvo con el (el ultimo acta dialogica)
                // <Box onClick={() => guardarIdPerfil(estudiante._id)} xcss={boxStyles} as="li" key={estudiante._id}>
                <Box onClick={() => verActaDialogicaEstudiante(estudiante.currentMeetingId, estudiante.currentMeeting, estudiante.currentProjectId, estudiante.lastLink)} xcss={boxStyles} as="li" key={estudiante._id}>
                    
                    <div style={{marginTop: '5px', marginBottom: '10px'}}>
                        <strong>{estudiante.proyectoPrincipal}</strong>
                    </div>
                    
                    
                    <Avatar 
                    appearance="circle"
                    src={estudiante.avatar}
                    size="xxlarge"
                    name={estudiante.name}
                    />
                    
                    <div style={{marginTop: '10px', marginBottom: '5px'}}>
                        {estudiante.name}
                    </div>
                    
                </Box>
            ))}
        </Inline>  
    );

};

export default HomeProfesor;