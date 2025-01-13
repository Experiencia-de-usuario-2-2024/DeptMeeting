import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import TextField from '@atlaskit/textfield';
import Select from '@atlaskit/select';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import axios from 'axios';

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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);

  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #E5F6F5;
  }

  th {
    background-color: #E5F6F5;
    color: #00A499;
    font-weight: 500;
  }

  tr:hover {
    background-color: #F8FAFA;
  }
`;

const DeleteModal = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  p {
    margin: 0;
    &.warning {
      color: #FF5630;
      font-weight: 500;
    }
  }

  .button-container {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    margin-top: 16px;
  }
`;

const DeleteModalContent = styled(DeleteModal)`
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

  .user-details {
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

const EditableCell = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  .title-section {
    h1, p {
      margin: 0;
    }
  }
`;

interface Usuario {
  _id: string;
  name: string;
  email: string;
  type: string;
}

interface GestionUsuariosProps {
  onBack?: () => void;
}

const GestionUsuarios: React.FC<GestionUsuariosProps> = ({ onBack }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingInTable, setEditingInTable] = useState<string | null>(null);
  const [tempRole, setTempRole] = useState<string>('');
  const [editingData, setEditingData] = useState<Partial<Usuario>>({});

  // Obtener usuarios al cargar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/user/get/allUser`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('tokenUser')}`
            }
          }
        );
        
        // Mapear los datos recibidos al formato que necesitamos
        const formattedUsers = response.data.map((user: any) => ({
          _id: user._id,
          name: user.name,
          email: user.email,
          type: user.type
        }));
        
        setUsuarios(formattedUsers);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };

    fetchUsers();
  }, []);

  const roles = [
    { label: 'Director', value: 'director' },
    { label: 'Secretario', value: 'secretario' },
    { label: 'Profesor', value: 'profesor' },
    { label: 'Funcionario', value: 'funcionario' },
    { label: 'Estudiante', value: 'estudiante' }
  ];

  const refreshUsers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/get/allUser`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('tokenUser')}`
          }
        }
      );
      
      const formattedUsers = response.data.map((user: any) => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        type: user.type
      }));
      
      setUsuarios(formattedUsers);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const handleUpdateUser = async (userId: string, updatedData: Partial<Usuario>) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/update/${userId}/profile`,
        {
          name: updatedData.name,
          type: updatedData.type,
          email: updatedData.email
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('tokenUser')}`
          }
        }
      );

      await refreshUsers(); // Recargar la lista después de actualizar
      setEditingInTable(null);
      window.alert('Usuario actualizado exitosamente');

    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      window.alert('Error al actualizar el usuario');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('tokenUser')}`
          }
        }
      );

      await refreshUsers(); // Recargar la lista después de eliminar
      window.alert('Usuario eliminado exitosamente');

    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      window.alert('Error al eliminar el usuario');
    }
  };

  const TableRow = ({ user }: { user: Usuario }) => {
    const isEditing = editingInTable === user._id;
    const [localEdits, setLocalEdits] = useState({
      name: user.name,
      email: user.email,
      type: user.type
    });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleSave = async () => {
      await handleUpdateUser(user._id, localEdits);
      setEditingInTable(null);
    };

    const handleDelete = async () => {
      await handleDeleteUser(user._id);
      setShowDeleteConfirm(false);
    };
    
    if (isEditing) {
      return (
        <tr>
          <td>
            <EditableCell>
              <TextField
                defaultValue={user.name}
                onChange={(e) => setLocalEdits({
                  ...localEdits,
                  name: e.target.value
                })}
              />
            </EditableCell>
          </td>
          <td>
            <EditableCell>
              <TextField
                defaultValue={user.email}
                onChange={(e) => setLocalEdits({
                  ...localEdits,
                  email: e.target.value
                })}
              />
            </EditableCell>
          </td>
          <td>
            <EditableCell>
              <Select
                value={roles.find(role => role.value === localEdits.type)}
                options={roles}
                onChange={(selectedOption: any) => {
                  setLocalEdits({
                    ...localEdits,
                    type: selectedOption.value
                  });
                }}
                menuPortalTarget={document.body}
                styles={{
                  control: (base) => ({
                    ...base,
                    width: '200px',
                    minHeight: '40px'
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 9999,
                    width: '200px'
                  }),
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999
                  })
                }}
              />
            </EditableCell>
          </td>
          <td>
            <EditableCell>
              <Button
                appearance="primary"
                onClick={handleSave}
              >
                Guardar
              </Button>
              <Button
                appearance="subtle"
                onClick={() => {
                  setEditingInTable(null);
                }}
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
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>{user.type}</td>
        <td>
          <div style={{ display: 'flex', gap: '8px' }}>
            {!showDeleteConfirm ? (
              <>
                <Button
                  appearance="primary"
                  onClick={() => {
                    setEditingInTable(user._id);
                    setEditingData({});
                  }}
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
                  onClick={handleDelete}
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
        <HeaderContent>
          <Button
            appearance="subtle"
            iconBefore={<ArrowLeftIcon label="" />}
            onClick={onBack}
          >
            Volver al menú principal
          </Button>
          <div className="title-section">
            <h1>Gestión de Usuarios</h1>
            <p>Administra los usuarios y sus roles en el sistema</p>
          </div>
        </HeaderContent>
      </Header>

      <Table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(user => (
            <TableRow key={user._id} user={user} />
          ))}
        </tbody>
      </Table>

      <ModalTransition>
        {isEditing && selectedUser && (
          <Modal
            actions={[
              { text: 'Cancelar', onClick: () => setIsEditing(false) },
              { text: 'Guardar', onClick: () => {
                if (selectedUser) {
                  handleUpdateUser(selectedUser._id, {
                    name: selectedUser.name,
                    type: selectedUser.type
                  });
                }
              }}
            ]}
            onClose={() => setIsEditing(false)}
            heading="Editar Usuario"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <TextField
                label="Nombre"
                value={selectedUser.name}
                onChange={(e) => setSelectedUser({
                  ...selectedUser,
                  name: e.target.value
                })}
              />
              <Select
                label="Rol"
                value={roles.find(role => role.value === selectedUser.type)}
                options={roles}
                onChange={(option: any) => setSelectedUser({
                  ...selectedUser,
                  type: option?.value || selectedUser.type
                })}
              />
            </div>
          </Modal>
        )}
      </ModalTransition>
    </Container>
  );
};

export default GestionUsuarios;
