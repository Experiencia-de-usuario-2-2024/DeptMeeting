import React from "react";
import ReactPlayer from 'react-player';
import styled from 'styled-components';

// imagenes de los elementos dialogicos
import i__Compromiso from "../assets/static/i__Compromiso.png";
import i__Acuerdo from "../assets/static/i__Acuerdo.png";
import i__Desacuerdo from "../assets/static/i__Desacuerdo.png";
import i__Duda from "../assets/static/i__Duda.png";

const Container = styled.div`
  display: flex;
  margin: 15px;
  flex-direction: column;
`;

const ContentBox = styled.div`
  padding: 24px;
  background-color: #E5F6F5;
  border: 1px solid #00A499;
  border-radius: 4px;
`;

const StyledLink = styled.a`
  color: #00A499;
  text-decoration: none;
  padding: 0;
  
  &:hover {
    text-decoration: underline;
    color: #008C82;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 16px 0;
`;

const StyledImage = styled.img`
  max-width: 100px;
  height: auto;
`;

const Informacion: React.FC = () => {
    return (
        <Container>
            <ContentBox>
                <h1 style={{ textAlign: 'center' }}>Bienvenido a DeptMeeting</h1>
                <br />

                <h1>¿Qué son las actas dialógicas?</h1>
                <br />

                {/* VIDEO */}
                <ReactPlayer width="100%" controls url='https://youtu.be/VkTo36gDTqY' />
                <StyledLink 
                    href="https://odysee.com/@SaludLibre:0/Actas-Dial%C3%B3gicas-Explicadas-por-Edmundo-Leiva:b" 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    Video original
                </StyledLink>

                {/* TEXTO */}
                <br />
                <h1>Conceptos claves:</h1>
                <hr></hr>
                
                <h2>Elementos dialógicos:</h2>
                <ImageContainer>
                    <StyledImage src={i__Acuerdo} alt="Simple example" />
                    <h3> &#8226; Acuerdos: La relación de correspondencia que establece una pauta o modelos adoptados por todos los participantes.</h3>    
                </ImageContainer>

                <ImageContainer>
                    <StyledImage src={i__Desacuerdo} alt="Simple example" />
                    <h3> &#8226; Desacuerdos: Aquello en lo que no se logra un consenso a fruto de una discusión. Se puede convertir en una fuente para ahondar en los temas que generan conflicto y para revisar en el futuro las comprensiones alcanzadas.</h3>
                </ImageContainer>

                <ImageContainer>
                    <StyledImage src={i__Compromiso} alt="Simple example" />
                    <h3> &#8226; Compromisos: Responsabilidades asignadas a cada participante de la reunión, las cuales se designan para ser cumplidas en un plazo específico.</h3>
                </ImageContainer>

                <ImageContainer>
                    <StyledImage src={i__Duda} alt="Simple example" />
                    <h3> &#8226; Dudas: Asuntos para los cuales no se disponen de antecedentes suficientes que permitan formular un juicio fundamentado.</h3>
                </ImageContainer>
                <h3>Fuente: Leiva-Lobos et al.(2008)</h3>

                <hr></hr>

                <h2>Fases de una reunión:</h2>
                <h3> &#8226; Pre-reunión: Corresponde a la primera fase de la reunión, en donde se realiza la preparación del acta dialógica. En esta etapa, en coordinación del secretario y anfitrión, se establece la información preliminar (fecha, hora, objetivo, temas, URLs adjuntos, etc) de la reunión, así como también la vinculación de usuarios como invitados. En el tránsito de esta fase a la próxima se notifica por email a los invitados que hay una reunión que requiere su atención.</h3>
                <h3> &#8226; En-reunión: Luego de concluir la fase de pre-reunión, anfitrión/secretario ingresan a la sesión con su marca de tiempo real que idealmente debería coincidir con datos de fecha y hora indicada ingresados en la pre-reunión, iniciando así la fase de en-reunión. Además del secretario y el anfitrión, los invitados se convierten en participantes al conectarse a la aplicación. Luego, obtienen la facultad de editar los distintos aspectos de una acta dialógica en tiempo real. En tal caso la reunión se centra en los temas definidos previamente, donde se añaden colaborativamente elementos dialógicos para sintetizar lo que se va dialogando en la reunión, culminando con una hora de término que debe ser registrada.</h3>
                <h3> &#8226; Post-reunión: Por último, se tiene la fase de post-reunión que es iniciada tras concluir la fase en-reunión y que tiene por objetivo recopilar toda la información y afinar los detalles inconclusos o confusos que surgieron de la fase anterior, actualizados únicamente por el secretario o anfitrión. Además, se establece quiénes de los invitados asistió como participante activo y quienes faltaron.</h3>

                <hr></hr>
            </ContentBox>
        </Container>
    );
};

export default Informacion;