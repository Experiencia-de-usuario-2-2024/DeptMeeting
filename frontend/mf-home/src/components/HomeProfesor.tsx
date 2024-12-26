import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import styles from '../styles/homeProfesor.module.css';

// Se obtiene el token del usuario logeado
const tokenUser = localStorage.getItem('tokenUser');

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

    // Para determinar si se muestra en la parte central el acta dialogica
    const [verActaDialogica, setVerActaDialogica] = useState(false);
    const [estudiantes, setEstudiantes] = useState<Estudiantes[]>([]);

    useEffect(() => {
        const storedValue2 = localStorage.getItem('verActaDialogica');
        if (storedValue2) {
            const parsedValue2 = JSON.parse(storedValue2);
            setVerActaDialogica(parsedValue2);
        }

        async function obtenerEstudiantes() {
            try {
                if (!tokenUser) {
                    console.error("No se encontró el token del usuario.");
                    return;
                }

                const decodedToken: any = jwtDecode(tokenUser);
                const correoElectronico = decodedToken?.email;
                
                if (!correoElectronico) {
                    console.error("No se pudo obtener el correo electrónico del token.");
                    return;
                }

                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/api/user/list/email/${correoElectronico}`,
                    {
                        headers: {
                            Authorization: `Bearer ${tokenUser}`,
                        },
                    }
                );
                setEstudiantes(response.data);
            } catch (error) {
                console.error("Error al obtener los estudiantes: ", error);
            }
        }

        obtenerEstudiantes();
    }, []);

    const verActaDialogicaEstudiante = (idActa: string, estadoReu: string, idProyecto: string, idReunion: string) => {
        if (!idActa || idActa === "undefined" || idActa === "null") {
            window.alert("El estudiante aún no participa en una reunión");
            return;
        }

        localStorage.setItem('idMeetingMinute', idActa);
        localStorage.setItem('idProyecto', idProyecto);
        localStorage.setItem('estadoReunion', estadoReu);
        localStorage.setItem('idReunion', idReunion);

        const newValue = !verActaDialogica;
        localStorage.setItem('verActaDialogica', JSON.stringify(newValue));
        setVerActaDialogica(newValue);
        window.location.reload();
    };

    return (
        <div className={styles.container}>
            <div className={styles.gridContainer}>
                {estudiantes.map((estudiante) => (
                    <div 
                        className={styles.studentCard}
                        onClick={() => verActaDialogicaEstudiante(
                            estudiante.currentMeetingId,
                            estudiante.currentMeeting,
                            estudiante.currentProjectId,
                            estudiante.lastLink
                        )}
                        key={estudiante._id}
                    >
                        <div className={styles.projectName}>
                            {estudiante.proyectoPrincipal}
                        </div>
                        
                        <div className={styles.avatarContainer}>
                            <img 
                                src={estudiante.avatar || '/default-avatar.png'} 
                                alt={estudiante.name}
                                className={styles.avatar}
                            />
                        </div>
                        
                        <div className={styles.studentName}>
                            {estudiante.name}
                        </div>
                        <div className={styles.studentType}>
                            {estudiante.type}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomeProfesor;