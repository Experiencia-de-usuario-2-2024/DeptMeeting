import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import TextField from '@atlaskit/textfield';
import Select from '@atlaskit/select';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  background-color: #00A499;
  color: white;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const PeriodContainer = styled.div`
  margin-bottom: 16px;
  border: 1px solid #E5F6F5;
  border-radius: 4px;
`;

const PeriodHeader = styled.div<{ isExpanded: boolean }>`
  padding: 16px;
  background-color: #E5F6F5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border-radius: ${props => props.isExpanded ? '4px 4px 0 0' : '4px'};

  &:hover {
    background-color: #D5F0EE;
  }
`;

const MeetingsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;

  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #E5F6F5;
  }

  th {
    background-color: #F4F5F7;
    color: #42526E;
  }
`;

const EditableCell = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const DeleteModalContent = styled.div`
  background-color: #FFEBE6;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;

  .warning-header {
    color: #FF5630;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }

  .meeting-details {
    background-color: white;
    padding: 16px;
    border-radius: 4px;
    margin-top: 16px;
    
    h4 {
      margin: 0 0 8px 0;
      color: #172B4D;
    }

    p {
      margin: 4px 0;
      color: #42526E;
    }
  }

  .action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 16px;
  }
`;

interface Meeting {
  id: string;
  title: string;
  date: string;
  status: string;
}

interface Period {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  meetings: Meeting[];
}

// Datos de prueba
const mockPeriods: Period[] = [
  {
    id: '1',
    name: 'Primer Semestre 2024',
    startDate: '2024-03-01',
    endDate: '2024-07-31',
    meetings: [
      { id: '1', title: 'Reunión Inicial', date: '2024-03-15', status: 'pre' },
      { id: '2', title: 'Revisión de Mitad de Semestre', date: '2024-05-15', status: 'pre' }
    ]
  },
  {
    id: '2',
    name: 'Segundo Semestre 2023',
    startDate: '2023-08-01',
    endDate: '2023-12-31',
    meetings: [
      { id: '3', title: 'Cierre de Año', date: '2023-12-20', status: 'finished' }
    ]
  }
];

interface GestionComisionesProps {
  onBack?: () => void;
}

const GestionComisiones: React.FC<GestionComisionesProps> = ({ onBack }) => {
  const [periods, setPeriods] = useState<Period[]>(mockPeriods);
  const [expandedPeriod, setExpandedPeriod] = useState<string | null>(null);
  const [editingInTable, setEditingInTable] = useState<string | null>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const statusOptions = [
    { label: 'Pre-reunión', value: 'pre' },
    { label: 'En-reunión', value: 'during' },
    { label: 'Post-reunión', value: 'post' },
    { label: 'Reunión finalizada', value: 'finished' }
  ];

  const handleUpdateMeeting = (periodId: string, updatedMeeting: Meeting) => {
    setPeriods(periods.map(period => 
      period.id === periodId 
        ? { 
            ...period, 
            meetings: period.meetings.map(meeting => 
              meeting.id === updatedMeeting.id ? updatedMeeting : meeting
            )
          }
        : period
    ));
    setEditingInTable(null);
  };

  const handleDeleteMeeting = (periodId: string, meetingId: string) => {
    setPeriods(periods.map(period => 
      period.id === periodId 
        ? { 
            ...period, 
            meetings: period.meetings.filter(meeting => meeting.id !== meetingId)
          }
        : period
    ));
    setIsDeleting(false);
    setSelectedMeeting(null);
  };

  const MeetingRow = ({ meeting, periodId }: { meeting: Meeting, periodId: string }) => {
    const isEditing = editingInTable === meeting.id;
    const [localEdits, setLocalEdits] = useState({
      title: meeting.title,
      date: meeting.date,
      status: meeting.status || 'pre'
    });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    if (isEditing) {
      return (
        <tr>
          <td>
            <EditableCell>
              <TextField
                defaultValue={meeting.title}
                onChange={(e) => setLocalEdits({
                  ...localEdits,
                  title: e.target.value
                })}
              />
            </EditableCell>
          </td>
          <td>
            <EditableCell>
              <TextField
                type="date"
                defaultValue={meeting.date}
                onChange={(e) => setLocalEdits({
                  ...localEdits,
                  date: e.target.value
                })}
              />
            </EditableCell>
          </td>
          <td>
            <EditableCell>
              <Select
                defaultValue={statusOptions.find(option => option.value === (meeting.status || 'pre'))}
                options={statusOptions}
                onChange={(option: any) => setLocalEdits({
                  ...localEdits,
                  status: option?.value || 'pre'
                })}
              />
            </EditableCell>
          </td>
          <td>
            <EditableCell>
              <Button
                appearance="primary"
                onClick={() => handleUpdateMeeting(periodId, { ...meeting, ...localEdits })}
              >
                Guardar
              </Button>
              <Button
                appearance="subtle"
                onClick={() => setEditingInTable(null)}
              >
                Cancelar
              </Button>
            </EditableCell>
          </td>
        </tr>
      );
    }

    return (
      <tr>
        <td>{meeting.title}</td>
        <td>{meeting.date}</td>
        <td>{statusOptions.find(option => option.value === (meeting.status || 'pre'))?.label}</td>
        <td>
          <div style={{ display: 'flex', gap: '8px' }}>
            {!showDeleteConfirm ? (
              <>
                <Button
                  appearance="primary"
                  onClick={() => setEditingInTable(meeting.id)}
                >
                  Editar
                </Button>
                <Button
                  appearance="danger"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Eliminar
                </Button>
              </>
            ) : (
              <>
                <Button
                  appearance="danger"
                  onClick={() => handleDeleteMeeting(periodId, meeting.id)}
                >
                  Confirmar eliminación
                </Button>
                <Button
                  appearance="subtle"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancelar
                </Button>
              </>
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <Container>
      <Header>
        <Button
          appearance="subtle"
          iconBefore={<ArrowLeftIcon label="" />}
          onClick={onBack}
        >
          Volver al menú principal
        </Button>
        <h1>Gestión de Comisiones</h1>
        <p>Administra los comisiones académicos y sus reuniones</p>
      </Header>

      {periods.map(period => (
        <PeriodContainer key={period.id}>
          <PeriodHeader 
            isExpanded={expandedPeriod === period.id}
            onClick={() => setExpandedPeriod(expandedPeriod === period.id ? null : period.id)}
          >
            <div>
              <h2>{period.name}</h2>
              <p>{period.startDate} - {period.endDate}</p>
            </div>
            {expandedPeriod === period.id ? 
              <ChevronDownIcon label="Contraer" /> : 
              <ChevronRightIcon label="Expandir" />
            }
          </PeriodHeader>
          
          {expandedPeriod === period.id && (
            <MeetingsTable>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {period.meetings.map(meeting => (
                  <MeetingRow 
                    key={meeting.id} 
                    meeting={meeting} 
                    periodId={period.id} 
                  />
                ))}
              </tbody>
            </MeetingsTable>
          )}
        </PeriodContainer>
      ))}
    </Container>
  );
};

export default GestionComisiones;
