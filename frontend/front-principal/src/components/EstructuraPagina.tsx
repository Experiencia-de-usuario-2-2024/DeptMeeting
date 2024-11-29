import React, { useEffect, Fragment, useCallback, useState  } from "react";
import HomeProfesorView from '../microfrontends/HomeProfesorView';
import ProyectosView from '../microfrontends/ProyectosView';
import PerfilView from '../microfrontends/PerfilView';
import DesarrolloReunionView from "../microfrontends/DesarrolloReunionView";
import InformacionView from "../microfrontends/InformacionView";
import TareasView from "../microfrontends/TareasView";
import KanbanPlusView from "../microfrontends/KanbanPlusView";

import ListIcon from '@atlaskit/icon/glyph/list'
import HomeIcon from '@atlaskit/icon/glyph/home'
import Button from '@atlaskit/button';
import { Inline } from '@atlaskit/primitives';
import PersonIcon from '@atlaskit/icon/glyph/person'
import EditorPanelIcon from '@atlaskit/icon/glyph/editor/panel'
import TableIcon from '@atlaskit/icon/glyph/table'

import Modal, {
    ModalBody,
    ModalFooter,
    ModalTransition,
} from '@atlaskit/modal-dialog';

import axios from "axios";
import { jwtDecode } from 'jwt-decode';

import {
    Banner,
    Content,
    LeftSidebarWithoutResize,
    Main,
    PageLayout,
    RightSidebar,
} from '@atlaskit/page-layout';

import ScrollableContent from '../resources/scrollable-content';
import SlotWrapper from '../resources/slot-wrapper';
import Toggle from '../resources/toggle';
import toKebabCase from '../resources/to-kebab-case';
import SignOutIcon from '@atlaskit/icon/glyph/sign-out'




// Se obtiene el token del usuario logeado
const tokenUser = localStorage.getItem('tokenUser');

// para determinar el tipo de dispositivo del usuario
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

type SlotName =
    | 'Banner'
    | 'LeftSidebar'
    | 'Main'
    | 'RightSidebar'

const initialState = {
    isBannerShown: true,
    isLeftSidebarShown: false,
    isMainShown: true,
    isRightSidebarShown: false,
    isBannerFixed: true,
    isLeftSidebarFixed: true,
    isLeftSidebarScrollable: false,
    isMainScrollable: false,
    isMainExtraWide: false,
    isRightSidebarFixed: true,
    isRightSidebarScrollable: false,
};







const EstructuraPagina = () =>{
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

    // Estado para tener la informacion del usuario logeado
    const [usuarioPerfilLog, setusuarioPerfilLog] = React.useState<Usuario>();

    // estado para guardar el nombre del proyecto
    const [nombreProyecto, setNombreProyecto] = React.useState('');

    //Estado para saber si se tiene que mostrar la ventana de perfil o no
    const [verPerfil, setVerPerfil] = React.useState(false);
    // Estado para saber si se tiene que mostrar la ventana de acta dialogica o no
    const [verActaDialogica, setVerActaDialogica] = React.useState(false);

    useEffect(() => {
        // YA NO SE UTILIZA
        // Obtener el valor de la variable almacenada en local storage para saber si se tiene que mostrar la ventana de perfil o no
        const storedValue = localStorage.getItem('verPerfil');
        if (storedValue) {
            const parsedValue = JSON.parse(storedValue);
            setVerPerfil(parsedValue);
            localStorage.setItem('verPerfil', JSON.stringify(parsedValue));
        }

        // obtener el valor de la variable almacenada en local storage para saber si se tiene que mostrar la ventana de acta dialogica o no
        const storedValue2 = localStorage.getItem('verActaDialogica');
        if (storedValue2) {
            const parsedValue2 = JSON.parse(storedValue2);
            setVerActaDialogica(parsedValue2);
            localStorage.setItem('verActaDialogica', JSON.stringify(parsedValue2));
        }

        // Obtener el nombre del proyecto almacenado en local storage
        const nombreProyectoAux = localStorage.getItem('nombreProyecto');
        if (nombreProyectoAux) {
            setNombreProyecto(nombreProyectoAux);
        }

        const storedValue3 = localStorage.getItem('primerInicio');
        if (storedValue3) {
            const parsedValue3 = JSON.parse(storedValue3);
            if (parsedValue3 === true){
                localStorage.setItem('primerInicio', JSON.stringify(false));                
                window.location.reload();
            }
        }

        // Obtener los datos del usuario logeado
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
                setusuarioPerfilLog(response.data);
                localStorage.setItem('idPerfil', response.data._id);
                localStorage.setItem('tipoUsuario', response.data.type);
                

            } catch (error) {
                console.error(error);
            }
        }
        obtenerDatosUsuarioLog();
        
    }, []);




    // FUNCIONES para los navbars (sacados de los componentes de atlassian)
    const [gridState, setGridState] = useState(initialState);

    const ToggleFixed = useCallback(
    ({ slotName }: { slotName: SlotName }) => {
        const gridKey = `is${slotName}Fixed` as keyof typeof gridState;
        return (
        <Toggle
            id={`${slotName}--fixed`}
            isChecked={gridState[gridKey]}
            onChange={() =>
            setGridState({ ...gridState, [gridKey]: !gridState[gridKey] })
            }
        >
            Toggle fixed
        </Toggle>
        );
    },
    [gridState],
    );

    const ToggleScrollable = useCallback(
    ({ slotName }: { slotName: SlotName }) => {
        const gridKey = `is${slotName}Scrollable` as keyof typeof gridState;
        return (
        <Fragment>
            <Toggle
            id={`${slotName}--scrollable`}
            isChecked={gridState[gridKey]}
            onChange={() =>
                setGridState({ ...gridState, [gridKey]: !gridState[gridKey] })
            }
            >
            Toggle scrollable content
            </Toggle>
            {gridState[gridKey] && <ScrollableContent />}
        </Fragment>
        );
    },
    [gridState],
    );

    const ToggleShown = useCallback(
    ({ slotName }: { slotName: SlotName }) => {
        const gridKey = `is${slotName}Shown` as keyof typeof gridState;
        return (
        <Toggle
            id={`toggle-${toKebabCase(slotName)}`}
            onChange={() =>
            setGridState({ ...gridState, [gridKey]: !gridState[gridKey] })
            }
            isChecked={!gridState[gridKey]}
        >{`${gridState[gridKey] ? 'Hide' : 'Show'} ${slotName}`}</Toggle>
        );
    },
    [gridState],
    );

    const ToggleExtraWide = useCallback(
    () => (
        <Fragment>
        <Toggle
            id={`toggle--extra-wide`}
            onChange={() =>
            setGridState({
                ...gridState,
                isMainExtraWide: !gridState.isMainExtraWide,
            })
            }
            isChecked={gridState.isMainExtraWide}
        >
            Toggle extra-wide content
        </Toggle>
        {gridState.isMainExtraWide && (
            <img
            src="https://picsum.photos/seed/picsum/1600"
            alt="wide placeholder"
            title="wide placeholder image"
            />
        )}
        </Fragment>
    ),
    [gridState],
    );


    // YA NO SE UTILIZA
    // Funcion para ir al perfil de usuario logeado una vez se presione el boton de "Mi perfil"
    // Entrada: id del usuario al que se quiere visualizar su perfil
    // Salida: Ninguna. Se guarda en local storage el id del perfil al que se quiere ir, ademas de que se modificar otra variable en local storage, la cual indica que se quiere ver el perfil
    const miPerfil = (idUser: string) => {
        const idPerfil = localStorage.getItem('idPerfil');
        if (verPerfil && idPerfil === idUser) {
            return null;
        }

        // se guarda en local storage el id del perfil al que se quiere ir, es para este caso es el id del usuario logeado
        localStorage.setItem('idPerfil', idUser);
        const newValue = !verPerfil;

        localStorage.setItem('verPerfil', JSON.stringify(newValue));
        localStorage.setItem('verActaDialogica', JSON.stringify(false));

        // Jyr comentario: XDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD
        // mi coódigo despues de estar 2 días sin dormir ser tipo:
        if (verPerfil == false) {
            setVerPerfil(true);
        }
        else{
            setVerPerfil(false);    
        }
        window.location.reload();
    }

    // Funcion para cerrar sesion, para lo cual elimina to.do elemento de local storage
    // Entrada: Ninguna
    // Salida: Ninguna. Se elimina to.do elemento de local storage
    const cerrarSesion = () => {        
        const confirmacion = window.confirm("¿Está seguro/a de que quiere cerrar sesión?");
        if (confirmacion) {
            localStorage.clear();
            window.location.reload();
        }
    }

    // **************************************************************************************************************************************************************************************** //
    // ****************************************************** Variables utilizadas para los dialogos modales ********************************************************************************** //
    // **************************************************************************************************************************************************************************************** //
    // para el dialogo modal de informacion
    const [isOpenInformacion, setIsOpenInformacion] = useState(false);
    const openModalInformacion = useCallback(() => setIsOpenInformacion(true), []);
    const closeModalInformacion = useCallback(() => {
        setIsOpenInformacion(false);
    }, []);
    
    // para el dialogo modal de perfil
    const [isOpenPerfil, setIsOpenPerfil] = useState(false);
    const openModalPerfil = useCallback(() => setIsOpenPerfil(true), []);
    const closeModalPerfil = useCallback(() => {
        setIsOpenPerfil(false);
    }, []);

    // para el dialogo modal de kanbanplus
    const [isOpenKanbanPlus, setIsOpenKanbanPlus] = useState(false);
    const openModalKanbanPlus = useCallback(() => setIsOpenKanbanPlus(true), []);
    const closeModalKanbanPlus = useCallback(() => {
        setIsOpenKanbanPlus(false);
    }, []);



    // **************************************************************************************************************************************************************************************** //
    // **************************************************************************************************************************************************************************************** //
    // **************************************************************************************************************************************************************************************** //




    // **************************** CONTENIDO A MOSTRAR ********************************
    // **************************** CONTENIDO A MOSTRAR ********************************
    // **************************** CONTENIDO A MOSTRAR ********************************
    // **************************** CONTENIDO A MOSTRAR ********************************

    return (

    <>
        <PageLayout>


            {/******************************** banner - header *********************************/}
            {/******************************** banner - header *********************************/}
            {/******************************** banner - header *********************************/}
            {/******************************** banner - header *********************************/}
            {gridState.isBannerShown && (
            <Banner
                testId="banner"
                id="banner"
                skipLinkTitle="Banner"
                height={96}
                isFixed={gridState.isBannerFixed}
            >
                {/* CONTENIDO AQUI */}
                <SlotWrapper
                // borderColor={token('color.border.accent.yellow', 'gold')}
                backgroundColor="#388BFF"
                >
                <Inline>
                    {/* Caso se accede desde un computador */}
                    {!isMobile && (
                        <>
                            {/* CONTENIDO DE LA IZQUIERDA */}
                            <div style={{textAlign: "left", width: '100%', height: '80px'}}>
                                <Inline space="space.300">
                                    <Button onClick={() => setGridState({ ...gridState, isLeftSidebarShown: !gridState.isLeftSidebarShown })} appearance="primary" iconBefore={<ListIcon label="" size="large" />} style={{ marginLeft: '15px', marginTop: '15px', width: '50px', height: '50px'}}></Button>
                                    <Button appearance="primary" onClick={() => {openModalInformacion();}} iconBefore={<EditorPanelIcon label="" size="large" />} style={{marginTop: '15px', width: '150px', height: '50px'}}><p style={{ marginBottom: '0px', marginTop: '6px'}} >Información</p></Button>
                                    {/* texto que indica al usuario donde se ubica */}
                                    {/* <h3 style={{marginTop: '28px', color: 'white'}}>{nombreProyecto} / reunión n</h3> */}
                                </Inline>
                            </div>
                            {/* CONTENIDO DEL MEDIO */}
                            <div style={{textAlign: "center", height: '80px'}}>
                                {/* <h1 style={{ color: 'white' }}>MemFollow</h1> */}
                                <Button iconBefore={<HomeIcon label="" size="large" />} onClick={() => {
                                    if (verActaDialogica){
                                        setVerActaDialogica(false);
                                        localStorage.setItem('verActaDialogica', JSON.stringify(false));
                                    }
                                    }} appearance="primary" style={{height: '80px'}}><h1 style={{ color: 'white' }}>MemFollow</h1></Button>
                            </div>
                            {/* CONTENIDO DE LA DERECHA */}
                            <div style={{textAlign: "right", width: '100%', height: '80px'}}>

                                {usuarioPerfilLog?.type === 'profesor' && (
                                    <Button appearance="primary" onClick={() => {openModalKanbanPlus();}} iconBefore={<TableIcon label="" size="large" />} style={{ marginRight: '30px', marginTop: '15px', height: '50px'}}> <p style={{ marginBottom: '0px', marginTop: '6px'}} >Kanban++</p>  </Button>
                                )}
                                {/* <Button appearance="primary" iconBefore={<TableIcon label="" size="large" />} style={{ marginRight: '30px', marginTop: '15px', height: '50px'}}> <p style={{ marginBottom: '0px', marginTop: '6px'}} >Kanban++</p>  </Button> */}
                                <Button appearance="primary" iconBefore={<PersonIcon label="" size="large" />} style={{ marginRight: '30px', marginTop: '15px', width: '120px', height: '50px'}} onClick={() => {openModalPerfil();}}> <p style={{ marginBottom: '0px', marginTop: '6px'}} >Mi perfil</p>  </Button>
                                {/* boton para cerrar sesion */}
                                <Button appearance="primary" iconBefore={<SignOutIcon label="" size="large" />} style={{ marginRight: '30px', marginTop: '15px', width: '150px', height: '50px'}} onClick={() => {cerrarSesion()}}><p style={{ marginBottom: '0px', marginTop: '6px'}} >Cerrar sesión</p></Button>
                                <Button onClick={() => setGridState({ ...gridState, isRightSidebarShown: !gridState.isRightSidebarShown })} appearance="primary" iconBefore={<ListIcon label="" size="large" />} style={{ marginRight: '15px', marginTop: '15px', width: '50px', height: '50px'}}></Button>
                            </div>                    
                        </>
                    )}

                    {/* En caso de que se acceda desde un dispositivo movil -> como un smartphone: EN ESTE CASO SE ELIMINA EL TEXTO DE EN MEDIO PARA OPTIMIZAR EL ESPACIO*/}
                    {isMobile && (
                        <>
                            <Inline space="space.300" grow="fill" spread={'space-between'}>
                                {/* CONTENIDO DE LA IZQUIERDA */}
                                <Button onClick={() => setGridState({ ...gridState, isLeftSidebarShown: !gridState.isLeftSidebarShown })} appearance="primary" iconBefore={<ListIcon label="" size="large" />} style={{ marginTop: '15px', width: '50px', height: '50px'}}></Button>

                                {/* Se comenta el boton que da acceso a la informacion en la version movile puesto que se prioriza el boton home */}
                                {/* <Button appearance="primary" onClick={() => {openModalInformacion();}} iconBefore={<EditorPanelIcon label="" size="large" />} style={{marginTop: '15px', width: '50px', height: '50px'}}></Button> */}

                                {/* Boton home */}
                                <Button iconBefore={<HomeIcon label="" size="large" />} onClick={() => {
                                    if (verActaDialogica){
                                        setVerActaDialogica(false);
                                        localStorage.setItem('verActaDialogica', JSON.stringify(false));
                                    }
                                    }} appearance="primary" style={{marginTop: '15px', width: '50px', height: '50px'}}></Button>

                                {/* CONTENIDO DE LA DERECHA */}
                                {usuarioPerfilLog?.type === 'profesor' && (
                                    <Button appearance="primary" onClick={() => {openModalKanbanPlus();}} iconBefore={<TableIcon label="" size="large" />} style={{marginTop: '15px', width: '50px', height: '50px'}}></Button>
                                )}
                                <Button appearance="primary" iconBefore={<PersonIcon label="" size="large" />} style={{marginTop: '15px', width: '50px', height: '50px'}} onClick={() => {openModalPerfil();}}></Button>
                                <Button appearance="primary" iconBefore={<SignOutIcon label="" size="large" />} style={{marginTop: '15px', width: '50px', height: '50px'}} onClick={() => {cerrarSesion()}}></Button>
                                <Button onClick={() => setGridState({ ...gridState, isRightSidebarShown: !gridState.isRightSidebarShown })} appearance="primary" iconBefore={<ListIcon label="" size="large" />} style={{marginTop: '15px', width: '50px', height: '50px'}}></Button>
                            </Inline>
                        </>
                    )}
                </Inline>
                </SlotWrapper>
                {/* CONTENIDO AQUI */}
            </Banner>
            )}


            {/********************************* sidebar izquierdo *********************************/}
            {/********************************* sidebar izquierdo *********************************/}
            {/********************************* sidebar izquierdo *********************************/}
            {/********************************* sidebar izquierdo *********************************/}
            <Content testId="content">
            {gridState.isLeftSidebarShown && (
                // <LeftSidebar -> esto permite cambiar el tamaño -> no se puede usar para el lado derecho
                <LeftSidebarWithoutResize
                testId="leftSidebar"
                id="left-sidebar"
                skipLinkTitle="Project Navigation"
                isFixed={gridState.isLeftSidebarFixed}
                width={370} //370
                >
                {/* CONTENIDO AQUI */}
                <SlotWrapper
                    // borderColor={token('color.border.accent.green', 'darkgreen')}
                    backgroundColor="#CCE0FF"
                    // hasExtraPadding
                >
                    {/* CONTENIDO DEL SIDEBAR IZQUIERDO */}
                    {/* <SlotLabel>LeftSidebar</SlotLabel>
                    <ToggleFixed slotName="LeftSidebar" />
                    <ToggleScrollable slotName="LeftSidebar" /> */}
                    <ProyectosView />
                </SlotWrapper>
                {/* CONTENIDO AQUI */}
                </LeftSidebarWithoutResize>
            )}

            {/********************************* main *********************************/}
            {/********************************* main *********************************/}
            {/********************************* main *********************************/}
            {/********************************* main *********************************/}
            {gridState.isMainShown && (
                <Main testId="main" id="main" skipLinkTitle="Main Content">
                <SlotWrapper
                    // borderColor={token('color.border', 'black')}
                >

                    {/* nueva forma de hacerlo: ahora en esta parte central solo se vera el home (diferente para profesor como para estudiante) y el acta dialogica */}
                    {/* si es profesor: mostrar el home de profesor */}
                    {usuarioPerfilLog?.type === "profesor" && verActaDialogica === false ?(
                        <div style={{ margin: '32px' }}>
                            <HomeProfesorView />
                        </div>
                    ):(
                        <>
                            {/* si es estudiante, mostrar el home de estudiante */}
                            {usuarioPerfilLog?.type === "estudiante" && verActaDialogica === false ?(
                                <div style={{textAlign: "left"}}>
                                    <InformacionView />
                                </div>
                            ):(
                                <>
                                {/* si importar el tipo de usuario, si este quiere ver el acta, se le muestra el acta */}
                                {(usuarioPerfilLog?.type === "profesor" || usuarioPerfilLog?.type === "estudiante") && verActaDialogica === true ?(
                                    <div style={{textAlign: "left"}}>
                                        <DesarrolloReunionView />
                                    </div>
                                ):(
                                    <>
                                    
                                    </>
                                )}
                                
                                </>
                            )}
                        </>
                    )}
                    {/* <SlotLabel>Main</SlotLabel>
                    <ToggleExtraWide />
                    <ToggleScrollable slotName="Main" /> */}
                </SlotWrapper>
                </Main>
            )}

            {/********************************** sidebar derecho **********************************/}
            {/********************************** sidebar derecho **********************************/}
            {/********************************** sidebar derecho **********************************/}
            {/********************************** sidebar derecho **********************************/}
            {gridState.isRightSidebarShown && (
                <RightSidebar
                testId="rightSidebar"
                id="right-sidebar"
                skipLinkTitle="Right Sidebar"
                isFixed={gridState.isRightSidebarFixed}
                width={830} //650
                >
                <SlotWrapper
                    // borderColor={token('color.border.accent.green', 'darkgreen')}
                    backgroundColor="#CCE0FF"
                >
                    {/* AQUI SE AÑADE EL CONTENIDO */}
                    <TareasView />
                    {/* <SlotLabel>RightSidebar</SlotLabel>
                    <ToggleFixed slotName="RightSidebar" />
                    <ToggleScrollable slotName="RightSidebar" /> */}
                </SlotWrapper>
                </RightSidebar>
            )}
            </Content>
            


        
        </PageLayout>
        

        {/* ********************************************************************************************************************************************************** */}
        {/* ******************************************************************** Modal dialog para informacion ******************************************************* */}
        {/* ********************************************************************************************************************************************************** */}
        <ModalTransition>
        {isOpenInformacion && (
        <Modal onClose={closeModalInformacion} width={'x-large'} shouldScrollInViewport>
            <ModalBody>
                {/* <h1>Información</h1> */}
                <InformacionView />
            </ModalBody>

            <ModalFooter>
                <Button appearance="subtle" onClick={closeModalInformacion}>
                Cerrar
                </Button>
            </ModalFooter>
        </Modal>
        )}
        </ModalTransition>

        {/* ********************************************************************************************************************************************************** */}
        {/* ******************************************************************** Modal dialog para perfil ************************************************************ */}
        {/* ********************************************************************************************************************************************************** */}
        <ModalTransition>
        {isOpenPerfil && (
        <Modal onClose={closeModalPerfil} width={'medium'} shouldScrollInViewport>
            <ModalBody>
                {/* <h1>Información</h1> */}
                <PerfilView />
            </ModalBody>

            <ModalFooter>
                <Button appearance="subtle" onClick={closeModalPerfil}>
                Cerrar
                </Button>
            </ModalFooter>
        </Modal>
        )}
        </ModalTransition>

        {/* ********************************************************************************************************************************************************** */}
        {/* ******************************************************************** Modal dialog para kanbanplust ******************************************************* */}
        {/* ********************************************************************************************************************************************************** */}
        <ModalTransition>
        {isOpenKanbanPlus && (
        <Modal onClose={closeModalKanbanPlus} width={'1600px'} shouldScrollInViewport>
            <ModalBody>
                {/* <h1>Información</h1> */}
                <br />
                <KanbanPlusView />
            </ModalBody>

            <ModalFooter>
                <Button appearance="subtle" onClick={closeModalKanbanPlus}>
                Cerrar
                </Button>
            </ModalFooter>
        </Modal>
        )}
        </ModalTransition>

    </>
    
    );


}

export default EstructuraPagina;