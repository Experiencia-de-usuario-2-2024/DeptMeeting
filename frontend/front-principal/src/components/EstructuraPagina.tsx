import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Microfrontend Views
import HomeProfesorView from '../microfrontends/HomeProfesorView';
import PerfilView from '../microfrontends/PerfilView';
import DesarrolloReunionView from "../microfrontends/DesarrolloReunionView";
import InformacionView from "../microfrontends/InformacionView";
import TareasView from "../microfrontends/TareasView";
import KanbanPlusView from "../microfrontends/KanbanPlusView";
import PeriodosConsejosView from "../microfrontends/PeriodosConsejosView";
import ActasPendientesView from "../microfrontends/ActasPendientesView";
import ComisionesActivasView from "../microfrontends/ComisionesActivasView";

// Icons
import { MenuIcon, HomeIcon, PersonIcon, InfoIcon, TableIcon, LogoutIcon } from './Icons';

// Styles
import styles from '../styles/layout.module.css';

// Get user token
const tokenUser = localStorage.getItem('tokenUser');

// Check if user is on mobile device
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

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

const EstructuraPagina = () => {
    const navigate = useNavigate();
    
    // User and layout states
    const [usuarioPerfilLog, setUsuarioPerfilLog] = useState<Usuario>();
    const [nombreProyecto, setNombreProyecto] = useState('');
    const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(false);
    const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(false);
    const [verActaDialogica, setVerActaDialogica] = useState(false);

    // Modal states
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isKanbanModalOpen, setIsKanbanModalOpen] = useState(false);
    const [prove, setprove] = useState(false);


    // Estado para controlar si la barra superior (con ActasPendientesView) está visible o no
    const [isTopBarShown, setIsTopBarShown] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!tokenUser) {
                    navigate('/');
                    return;
                }

                const decodedToken: any = jwtDecode(tokenUser);
                const email = decodedToken?.email;

                if (!email) {
                    navigate('/');
                    return;
                }

                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/api/user/perfil/email/${email}`,
                    {
                        headers: { Authorization: `Bearer ${tokenUser}` }
                    }
                );

                setUsuarioPerfilLog(response.data);
                localStorage.setItem('idPerfil', response.data._id);
                localStorage.setItem('tipoUsuario', response.data.type);

            } catch (error) {
                console.error("Error fetching user data:", error);
                navigate('/');
            }
        };

        // Get stored values
        const storedActaDialogica = localStorage.getItem('verActaDialogica');
        if (storedActaDialogica) {
            setVerActaDialogica(JSON.parse(storedActaDialogica));
        }

        const storedProyecto = localStorage.getItem('nombreProyecto');
        if (storedProyecto) {
            setNombreProyecto(storedProyecto);
        }
        setprove(true);
        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        const confirmacion = window.confirm("¿Está seguro/a de que quiere cerrar sesión?");
        if (confirmacion) {
            localStorage.clear();
            navigate('/');
        }
    };

    const handleHomeClick = () => {
        if (verActaDialogica) {
            setVerActaDialogica(false);
            localStorage.setItem('verActaDialogica', JSON.stringify(false));
        }
    };

    return (
        <div className={styles.pageLayout}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.headerLeft}>
                        <button 
                            className={styles.button}
                            onClick={() => setIsLeftSidebarVisible(!isLeftSidebarVisible)}
                        >
                            <MenuIcon color={isLeftSidebarVisible ? "#FF9200" : "white"} />
                        </button>
                        {usuarioPerfilLog?.type === 'profesor' && (
                            <button 
                                className={`${styles.button} ${styles.withText} ${isMobile ? styles.hideText : ''}`}
                                onClick={() => setIsInfoModalOpen(true)}
                            >
                                <InfoIcon color="white" />
                                <span className={styles.buttonText}>PANEL DE ADMINISTRACIÓN</span>
                            </button>
                        )}
                    </div>

                    <div className={styles.headerCenter}>
                        <button 
                            className={styles.logoButton}
                            onClick={handleHomeClick}
                        >
                            <HomeIcon color="white" />
                            <span className={styles.buttonText}>DeptMeeting</span>
                        </button>
                    </div>

                    <div className={styles.headerRight}>
                        {usuarioPerfilLog?.type === 'profesor' && (
                            <button 
                                className={`${styles.button} ${styles.withText} ${isMobile ? styles.hideText : ''}`}
                                onClick={() => setIsKanbanModalOpen(true)}
                            >
                                <TableIcon color="white" />
                                <span className={styles.buttonText}>KANBAN++</span>
                            </button>
                        )}
                        <button 
                            className={`${styles.button} ${styles.withText} ${isMobile ? styles.hideText : ''}`}
                            onClick={() => setIsProfileModalOpen(true)}
                        >
                            <PersonIcon color="white" />
                            <span className={styles.buttonText}>MI PERFIL</span>
                        </button>
                        <button 
                            className={`${styles.button} ${styles.withText} ${isMobile ? styles.hideText : ''}`}
                            onClick={handleLogout}
                        >
                            <LogoutIcon color="white" />
                            <span className={styles.buttonText}>CERRAR SESIÓN</span>
                        </button>
                        <button 
                            className={styles.button}
                            onClick={() => setIsRightSidebarVisible(!isRightSidebarVisible)}
                        >
                            <MenuIcon color={isRightSidebarVisible ? "#FF9200" : "white"} />
                        </button>
                    </div>
                </div>
            </header>

            {/* TopBar solo visible cuando no está en DesarrolloReunion y es profesor */}
            {usuarioPerfilLog?.type === 'profesor' && !verActaDialogica && (
                <div className={`${styles.topBarContainer} 
                    ${isLeftSidebarVisible ? styles.withLeftSidebar : ''} 
                    ${isRightSidebarVisible ? styles.withRightSidebar : ''}`}
                >
                    <ActasPendientesView />
                </div>
            )}

            <div className={styles.mainContainer}>
                <aside className={`${styles.leftSidebar} ${isLeftSidebarVisible ? styles.visible : ''}`}>
                    {prove && <PeriodosConsejosView/>}
                </aside>

                <main className={`${styles.mainContent} 
                    ${isLeftSidebarVisible ? styles.withLeftSidebar : ''} 
                    ${isRightSidebarVisible ? styles.withRightSidebar : ''}`}
                >
                    {verActaDialogica ? (
                        <DesarrolloReunionView />
                    ) : usuarioPerfilLog?.type === 'profesor' ? (
                        <HomeProfesorView />
                    ) : (
                        <TareasView />
                    )}
                </main>

                <aside className={`${styles.rightSidebar} ${isRightSidebarVisible ? styles.visible : ''}`}>
                    <TareasView />
                </aside>
            </div>

            {/* Modales existentes */}
            {isInfoModalOpen && (
                <>
                    <div className={styles.modalOverlay} onClick={() => setIsInfoModalOpen(false)} />
                    <div className={styles.modal}>
                        <InformacionView />
                        <button 
                            className={styles.button}
                            onClick={() => setIsInfoModalOpen(false)}
                            style={{ color: '#000' }}
                        >
                            CERRAR
                        </button>
                    </div>
                </>
            )}

            {isProfileModalOpen && (
                <>
                    <div className={styles.modalOverlay} onClick={() => setIsProfileModalOpen(false)} />
                    <div className={`${styles.modal} ${styles.medium}`}>
                        <PerfilView />
                        <button 
                            className={styles.button}
                            onClick={() => setIsProfileModalOpen(false)}
                            style={{ color: '#000' }}
                        >
                            CERRAR
                        </button>
                    </div>
                </>
            )}

            {isKanbanModalOpen && (
                <>
                    <div className={styles.modalOverlay} onClick={() => setIsKanbanModalOpen(false)} />
                    <div className={`${styles.modal} ${styles.large}`}>
                        <KanbanPlusView />
                        <button 
                            className={styles.button}
                            onClick={() => setIsKanbanModalOpen(false)}
                            style={{ color: '#000' }}
                        >
                            CERRAR
                        </button>
                    </div>
                </>
            )}

            {/* Footer solo visible cuando no está en DesarrolloReunion */}
            {!verActaDialogica && (
                <footer className={`${styles.footer} 
                    ${isLeftSidebarVisible ? styles.withLeftSidebar : ''} 
                    ${isRightSidebarVisible ? styles.withRightSidebar : ''}`}
                >
                    <div className={styles.footerContent}>
                        <ComisionesActivasView />
                    </div>
                </footer>
            )}
        </div>
    );
};

export default EstructuraPagina;