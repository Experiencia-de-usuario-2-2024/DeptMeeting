import React, { useState } from "react";
import styled from 'styled-components';
import Button from '@atlaskit/button';
import PeopleGroupIcon from '@atlaskit/icon/glyph/people-group';
import BoardIcon from '@atlaskit/icon/glyph/board';
import CalendarIcon from '@atlaskit/icon/glyph/calendar';
import SettingsIcon from '@atlaskit/icon/glyph/settings';

// imagenes de los elementos dialogicos
import i__Compromiso from "../assets/static/i__Compromiso.png";
import i__Acuerdo from "../assets/static/i__Acuerdo.png";
import i__Desacuerdo from "../assets/static/i__Desacuerdo.png";
import i__Duda from "../assets/static/i__Duda.png";
import GestionUsuarios from "./GestionUsuarios";
import GestionPeriodos from "./GestionPeriodos";
import GestionComisiones from "./GestionComisiones";

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

const AdminHeader = styled.div`
  padding: 24px;
  background-color: #00A499;
  border-radius: 4px;
  margin-bottom: 24px;
  color: white;
`;

const AdminGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  padding: 16px;
`;

const AdminCard = styled.div`
  background-color: #E5F6F5;
  border: 1px solid #00A499;
  border-radius: 4px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background-color: white;
  border: 1px solid #00A499;
  border-radius: 4px;
  padding: 16px;
  text-align: center;
`;

const Informacion: React.FC = () => {
    const [currentView, setCurrentView] = useState('dashboard');
    // Mock data para estadísticas
    const stats = {
        users: 125,
        periods: 8,
        commissions: 15
    };

    return (
        <Container>
            {currentView === 'dashboard' ? (
                <>
                    <AdminHeader>
                        <h1>Panel de Administración DeptMeeting</h1>
                        <p>Gestiona usuarios, períodos y comisiones del sistema</p>
                    </AdminHeader>

                    <StatsContainer>
                        <StatCard>
                            <h2>{stats.users}</h2>
                            <p>Usuarios Registrados</p>
                        </StatCard>
                        <StatCard>
                            <h2>{stats.periods}</h2>
                            <p>Períodos Activos</p>
                        </StatCard>
                        <StatCard>
                            <h2>{stats.commissions}</h2>
                            <p>Comisiones Activas</p>
                        </StatCard>
                    </StatsContainer>

                    <AdminGrid>
                        <AdminCard>
                            <h2>Gestión de Usuarios</h2>
                            <p>Administra usuarios, permisos y roles</p>
                            <Button 
                                appearance="primary"
                                iconBefore={<PeopleGroupIcon label="" />}
                                onClick={() => setCurrentView('users')}
                            >
                                Gestionar Usuarios
                            </Button>
                        </AdminCard>

                        <AdminCard>
                            <h2>Gestión de Períodos</h2>
                            <p>Administra períodos académicos</p>
                            <Button
                                appearance="primary"
                                iconBefore={<CalendarIcon label="" />}
                                onClick={() => setCurrentView('periods')}
                            >
                                Gestionar Períodos
                            </Button>
                        </AdminCard>

                        <AdminCard>
                            <h2>Gestión de Comisiones</h2>
                            <p>Administra comisiones y sus miembros</p>
                            <Button
                                appearance="primary"
                                iconBefore={<BoardIcon label="" />}
                                onClick={() => setCurrentView('commissions')}
                            >
                                Gestionar Comisiones
                            </Button>
                        </AdminCard>
                    </AdminGrid>
                </>
            ) : currentView === 'users' ? (
                <GestionUsuarios onBack={() => setCurrentView('dashboard')} />
            ) : currentView === 'periods' ? (
                <GestionPeriodos onBack={() => setCurrentView('dashboard')} />
            ) : currentView === 'commissions' ? (
                <GestionComisiones onBack={() => setCurrentView('dashboard')} />
            ) : null}
        </Container>
    );
};

export default Informacion;