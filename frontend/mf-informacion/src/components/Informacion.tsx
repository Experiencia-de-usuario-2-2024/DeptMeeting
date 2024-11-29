import React from "react";
import { Box, xcss, Inline } from '@atlaskit/primitives';
import Button from '@atlaskit/button';
import ReactPlayer from 'react-player';
import Image from '@atlaskit/image'

// imagenes de los elementos dialogicos
import i__Compromiso from "../assets/static/i__Compromiso.png";
import i__Acuerdo from "../assets/static/i__Acuerdo.png";
import i__Desacuerdo from "../assets/static/i__Desacuerdo.png";
import i__Duda from "../assets/static/i__Duda.png";

// Se obtiene el token del usuario logeado
const tokenUser = localStorage.getItem('tokenUser');


const boxStyles = xcss({
    borderColor: 'color.border.selected',
    // width: '500px',
    backgroundColor: 'color.background.selected',
    borderStyle: 'solid',
    borderRadius: 'border.radius',
    borderWidth: 'border.width',
});

const Informacion: React.FC = () => {


/* Contenido que se muestra */
return (

    <div style={{ display: 'flex', margin: '0 auto', marginLeft: '15px', marginRight: '15px', marginBottom: '15px', marginTop: '15px', flexDirection: 'column'}}>
        <Box
            padding="space.400"
            backgroundColor="color.background.discovery"
            xcss={boxStyles}
        >

            <h1 style={{ textAlign: 'center' }}>Bienvenido a MemFollow</h1>
            <br />

            <h1>¿Qué son las actas dialógicas?</h1>
            <br />

            {/* VIDEO */}
            <ReactPlayer width="100%" controls url='https://youtu.be/VkTo36gDTqY' />
            <Button style={{padding:0}} appearance="link" href="https://odysee.com/@SaludLibre:0/Actas-Dial%C3%B3gicas-Explicadas-por-Edmundo-Leiva:b" target="_blank" rel="noopener noreferrer">Video original</Button>

            {/* TEXTO */}
            <br />
            <h1>Conceptos claves:</h1>
            <hr></hr>
            
            <h2>Elementos dialógicos:</h2>
            <Inline space={'space.200'}>
                <Image src={i__Acuerdo} alt="Simple example" testId="image" style={{ width: '50px', height: '50px', marginTop: '18.720px'  }} /> 
                <h3> &#8226; Acuerdos: La relación de correspondencia que establece una pauta o modelos adoptados por todos los participantes.</h3>    
            </Inline>

            <Inline space={'space.200'}>
                <Image src={i__Desacuerdo} alt="Simple example" testId="image" style={{ width: '50px', height: '50px', marginTop: '18.720px'  }} /> 
                <h3> &#8226; Desacuerdos: Aquello en lo que no se logra un consenso a fruto de una discusión. Se puede convertir en una fuente para ahondar en los temas que generan conflicto y para revisar en el futuro las comprensiones alcanzadas.</h3>
            </Inline>

            <Inline space={'space.200'}>
                <Image src={i__Compromiso} alt="Simple example" testId="image" style={{ width: '50px', height: '50px', marginTop: '18.720px'  }} /> 
                <h3> &#8226; Compromisos: Responsabilidades asignadas a cada participante de la reunión, las cuales se designan para ser cumplidas en un plazo específico.</h3>
            </Inline>

            <Inline space={'space.200'}>
                <Image src={i__Duda} alt="Simple example" testId="image" style={{ width: '50px', height: '50px', marginTop: '18.720px'  }} /> 
                <h3> &#8226; Dudas: Asuntos para los cuales no se disponen de antecedentes suficientes que permitan formular un juicio fundamentado.</h3>
            </Inline>
            <h3>Fuente: Leiva-Lobos et al.(2008)</h3>

            <hr></hr>

            <h2>Fases de una reunión:</h2>
            <h3> &#8226; Pre-reunión: Corresponde a la primera fase de la reunión, en donde se realiza la preparación del acta dialógica. En esta etapa, en coordinación del secretario y anfitrión, se establece la información preliminar (fecha, hora, objetivo, temas, URLs adjuntos, etc) de la reunión, así como también la vinculación de usuarios como invitados. En el tránsito de esta fase a la próxima se notifica por email a los invitados que hay una reunión que requiere su atención.</h3>
            <h3> &#8226; En-reunión: Luego de concluir la fase de pre-reunión, anfitrión/secretario ingresan a la sesión con su marca de tiempo real que idealmente debería coincidir con datos de fecha y hora indicada ingresados en la pre-reunión, iniciando así la fase de en-reunión. Además del secretario y el anfitrión, los invitados se convierten en participantes al conectarse a la aplicación. Luego, obtienen la facultad de editar los distintos aspectos de una acta dialógica en tiempo real. En tal caso la reunión se centra en los temas definidos previamente, donde se añaden colaborativamente elementos dialógicos para sintetizar lo que se va dialogando en la reunión, culminando con una hora de término que debe ser registrada.</h3>
            <h3> &#8226; Post-reunión: Por último, se tiene la fase de post-reunión que es iniciada tras concluir la fase en-reunión y que tiene por objetivo recopilar toda la información y afinar los detalles inconclusos o confusos que surgieron de la fase anterior, actualizados únicamente por el secretario o anfitrión. Además, se establece quiénes de los invitados asistió como participante activo y quienes faltaron.</h3>

            <hr></hr>


        </Box>
    </div>
    
);
};

export default Informacion;