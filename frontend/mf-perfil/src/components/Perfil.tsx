import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Perfil.css';

const Perfil: React.FC = () => {
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        photoUrl: '',
        initials: '',
        password: '',
        confirmPassword: '',
        assignedProfessor: ''
    });
    
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [verPerfil, setVerPerfil] = React.useState(Boolean);
    const [usuarioPerfil, setusuarioPerfil] = React.useState<any>();
    const [usuarioPerfilLog, setusuarioPerfilLog] = React.useState<any>();
    const [compromisosUsuario, setcompromisosUsuario] = React.useState<any[]>();
    const [modalMessage, setModalMessage] = useState('');

    const tokenUser = localStorage.getItem('tokenUser');

    useEffect(() => {
        const storedValue = localStorage.getItem('verPerfil');
        if (storedValue) {
            const parsedValue = JSON.parse(storedValue);
            setVerPerfil(parsedValue);
        }

        const idPerfil = localStorage.getItem('idPerfil');
        const obtenerDatosUsuario = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/perfil/` + idPerfil, {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                setusuarioPerfil(response.data);
                setProfileData({
                    name: response.data.name,
                    email: response.data.email,
                    photoUrl: response.data.avatar,
                    initials: response.data.tagName,
                    password: '',
                    confirmPassword: '',
                    assignedProfessor: response.data.asignado
                });
            } catch (error) {
                console.error(error);
            }
        };
        obtenerDatosUsuario();

        const obtenerDatosUsuarioLog = async () => {
            try {
                const decodedToken: any = tokenUser ? jwtDecode(tokenUser) : null;
                const correoElectronico = decodedToken.email;
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/perfil/email/` + correoElectronico, {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                setusuarioPerfilLog(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        obtenerDatosUsuarioLog();

        const obtenerCompromisosUsuario = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/element/participants/` + usuarioPerfil?.email, {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                });
                setcompromisosUsuario(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        obtenerCompromisosUsuario();
    }, []);

    useEffect(() => {
        if (usuarioPerfil?.type) {
            console.log(`User type: ${usuarioPerfil.type}`);
        }
        if (usuarioPerfilLog?.type) {
            console.log(`Logged user type: ${usuarioPerfilLog.type}`);
        }
    }, [usuarioPerfil, usuarioPerfilLog]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { ...errors };

        if (!profileData.name) {
            newErrors.name = 'El nombre es requerido';
            isValid = false;
        }

        if (!profileData.email) {
            newErrors.email = 'Correo electrónico es requerido';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
            newErrors.email = 'Formato de correo electrónico inválido';
            isValid = false;
        }

        if (profileData.password !== profileData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const closeWindow = () => {
        window.close();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/user/update/` + usuarioPerfil?._id + '/profile', {
                avatar: profileData.photoUrl,
                name: profileData.name,
                tagName: profileData.initials,
                email: profileData.email,
                password: profileData.password,
                asignado: profileData.assignedProfessor
            }, {
                headers: {
                    Authorization: `Bearer ${tokenUser}`
                }
            });
            localStorage.setItem('modalMessage', 'Perfil actualizado correctamente');
            window.location.href = '/home'; // Redirect to /home
        } catch (error) {
            console.error('Error updating profile:', error);
            localStorage.setItem('modalMessage', 'Error actualizando el perfil');
            window.location.href = '/home'; // Redirect to /home
        }
    };

    return (
        <div className="ProfileContainer">
            <h1>Mi perfil: {usuarioPerfil?.type === 'profesor' ? 'Profesor/a guía' : 'Estudiante'}</h1>
            
            <form className="ProfileForm" onSubmit={handleSubmit}>
                <img 
                    className="ProfileImage"
                    src={usuarioPerfil?.avatar || 'default-avatar.png'} 
                    alt="Profile" 
                />
                
                <div className="FormField">
                    <label className="Label">URL de la foto de perfil</label>
                    <input
                        className="Input"
                        type="text"
                        name="photoUrl"
                        value={profileData.photoUrl}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="FormField">
                    <label className="Label">Nombre del usuario*</label>
                    <input
                        className="Input"
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                    />
                    {errors.name && <div className="ErrorMessage">{errors.name}</div>}
                </div>

                <div className="FormField">
                    <label className="Label">Iniciales del usuario</label>
                    <input
                        className="Input"
                        type="text"
                        name="initials"
                        value={profileData.initials}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="FormField">
                    <label className="Label">Correo electrónico*</label>
                    <input
                        className="Input"
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                    />
                    {errors.email && <div className="ErrorMessage">{errors.email}</div>}
                </div>

                {usuarioPerfil?.type?.toLowerCase() === 'estudiante' && (
                    <div className="FormField">
                        <label className="Label">Profesor/a asignado/a (correo electrónico)</label>
                        <input
                            className="Input"
                            type="text"
                            name="assignedProfessor"
                            value={profileData.assignedProfessor}
                            onChange={handleInputChange}
                        />
                    </div>
                )}

                <div className="FormField">
                    <label className="Label">Contraseña (repita la actual o ingrese una nueva)*</label>
                    <input
                        className="Input"
                        type="password"
                        name="password"
                        value={profileData.password}
                        onChange={handleInputChange}
                    />
                    {errors.password && <div className="ErrorMessage">{errors.password}</div>}
                </div>

                <div className="FormField">
                    <label className="Label">Confirmar contraseña*</label>
                    <input
                        className="Input"
                        type="password"
                        name="confirmPassword"
                        value={profileData.confirmPassword}
                        onChange={handleInputChange}
                    />
                    {errors.confirmPassword && <div className="ErrorMessage">{errors.confirmPassword}</div>}
                </div>

                <button className="StyledButton" type="submit" disabled={!profileData.password}>
                    Actualizar perfil
                </button>
            </form>
        </div>
    );
};

export default Perfil;