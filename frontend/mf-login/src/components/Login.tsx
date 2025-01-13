import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import GoogleLogin from 'react-google-login';
import { gapi } from "gapi-script";
import { validateEmail, validatePassword, validateRut } from '../utils/validation';
import axios from 'axios';
import {
  Container,
  FormCard,
  Title,
  FormGroup,
  Label,
  Input,
  Button,
  PasswordWrapper,
  PasswordToggle,
  PasswordStrengthBar,
  ErrorText,
  LinkText,
  Modal,
  ModalContent,
  CloseButton,
  Subtitle,
} from '../styles/login.styles';

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    rut: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsViewed, setTermsViewed] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  interface LoginProps {
    onLogin: (token: string) => void;
  }
  
  const backendUrl = `${process.env.REACT_APP_BACKEND_URL}/api/auth`;
  
  useEffect(() => {
    const start = () => {
      gapi.auth2.init({
        clientId: googleId,
        scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.profile',
      })
    }
    gapi.load("client:auth2", start);
  }, [])
  
  const googleId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Limpiar errores al escribir
    setErrors(prev => ({ ...prev, [name]: '' }));

    // Validar contraseña en tiempo real
    if (name === 'password') {
      const validation = validatePassword(value);
      setPasswordStrength(validation.strength);
      
      // Validar si las contraseñas coinciden
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Las contraseñas no coinciden' }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }

    // Validar confirmación de contraseña en tiempo real
    if (name === 'confirmPassword' && isRegisterMode) {
      if (value && value !== formData.password) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Las contraseñas no coinciden' }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (isRegisterMode) {
      if (!formData.fullName) newErrors.fullName = 'El nombre completo es requerido';
      if (!validateRut(formData.rut)) newErrors.rut = 'RUT inválido';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Correo inválido. Debe ser un correo @usach.cl';
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.message;
    }

    if (isRegisterMode && !termsViewed) {
      newErrors.terms = 'Debe leer los términos y condiciones primero';
    }

    if (isRegisterMode && !termsAccepted) {
      newErrors.terms = 'Debe aceptar los términos y condiciones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: isRegisterMode ? `${backendUrl}/signup` : `${backendUrl}/signin`,
          headers: {
            'Content-Type': 'application/json'
          },
          data: JSON.stringify({
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
            type: isRegisterMode ? "estudiante" : undefined,
            tagName: formData.fullName.split(' ').map(word => word[0]).join(''),
          }),
        };

        const response = await axios.request(config);
        if (response.data.token) {
          localStorage.setItem('tokenUser', response.data.token);
          localStorage.setItem('primerInicio', 'true');
          window.location.href = "/home";
        } else if (isRegisterMode) {
          setModalMessage("Usuario creado con éxito");
          setTimeout(() => {
            setIsRegisterMode(false); //Vuelve a la pantalla de inicio de sesión
          }, 5000); //Delay de 5 segundos
        }
      } catch (error) {
        if (isRegisterMode && error.response?.data?.error?.message === "User already exists") {
          setModalMessage("El usuario ya existe, intenta con otro correo");
        } else {
          setModalMessage(error.response?.data?.error?.message || "Error de conexión");
        }
      }
    }
  };

  const handlePasswordRecovery = async () => {
    if (!formData.email) {
      setErrors({ submit: "Por favor ingrese un correo electrónico" });
      return;
    }

    try {
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${backendUrl}/reset-password`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          email: formData.email
        }),
      };

      const response = await axios.request(config);
      setSuccessMessage("Se ha enviado un correo con instrucciones para restablecer su contraseña");
      // Optionally close any modal or show success message
    } catch (error) {
      setErrors({ submit: error.response?.data?.error?.message || "Error al recuperar contraseña" });
    }
  };

  const viewTerms = () => {
    // Abrir PDF de términos y condiciones
    window.open('/terms.pdf', '_blank');
    setTermsViewed(true);
  };

  const handleGoogleSuccess = (response: any) => {
    if (response.profileObj) {
      const { email, name } = response.profileObj;
      // Store user info in localStorage or handle as needed
      localStorage.setItem('tokenUser', response.tokenId);
      localStorage.setItem('primerInicio', 'true');
      window.location.href = "/home";
    }
  };

  const handleGoogleFailure = (error: any) => {
    console.error('Google Sign In Error:', error);
    setModalMessage('Error al iniciar sesión con Google');
  };

  const loginWithGoogle = async (session) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/signin`, {
        email: session.profileObj.email,
        googlePassword: session.profileObj.googleId,
      });
  
      if (response.data.token) {
        localStorage.setItem('tokenUser', response.data.token);
        localStorage.setItem('primerInicio', 'true');
        localStorage.setItem('accessToken', session.tokenObj.access_token);
        window.location.href = "/home";
      }
    } catch (error) {
      console.error('Google login error:', error);
      setModalMessage(error.response?.data?.message || 'Error logging in with Google');
    }
  };
  
  const registerWithGoogle = async (response) => {
    const tagName = response.profileObj.name.split(' ').map(word => word[0]).join('');
    try {
      const data = {
        name: response.profileObj.name,
        email: response.profileObj.email,
        googlePassword: response.profileObj.googleId,
        type: "profesor",
        tagName: tagName,
      };
  
      const apiResponse = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/signup`, data);
      setModalMessage("Usuario creado con éxito");
      setTimeout(() => setIsRegisterMode(false), 5000);
    } catch (error) {
      setModalMessage(error.response?.data?.message || 'Error registering with Google');
    }
  };

  return (
    <Container>
      <Title>DeptMeeting</Title>
      <Subtitle>{isRegisterMode ? 'REGISTRO' : 'INICIO DE SESIÓN'}</Subtitle>
      <form onSubmit={handleSubmit}>
        {isRegisterMode && (
          <>
            <FormGroup>
              <Label>Nombre completo</Label>
              <Input
                type="text"
                name="fullName"
                placeholder="Juan Pérez González"
                value={formData.fullName}
                onChange={handleInputChange}
              />
              {errors.fullName && <ErrorText>{errors.fullName}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label>RUT</Label>
              <Input
                type="text"
                name="rut"
                placeholder="20058348-5"
                value={formData.rut}
                onChange={handleInputChange}
              />
              {errors.rut && <ErrorText>{errors.rut}</ErrorText>}
            </FormGroup>
          </>
        )}

        <FormGroup>
          <Label>Correo institucional</Label>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Input
              type="email"
              name="email"
              placeholder="nicolas.rojas.g@usach.cl"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          {errors.email && <ErrorText>{errors.email}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label>Contraseña</Label>
          <PasswordWrapper>
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </PasswordToggle>
          </PasswordWrapper>
          {isRegisterMode && formData.password && (
            <>
              <PasswordStrengthBar strength={passwordStrength} />
              <ErrorText>
                {passwordStrength === 'weak' && 'La contraseña es débil. Debe incluir mayúsculas, minúsculas, números y caracteres especiales.'}
                {passwordStrength === 'medium' && 'La contraseña es moderada. Añade más variedad para mayor seguridad.'}
                {passwordStrength === 'strong' && 'La contraseña es fuerte.'}
              </ErrorText>
            </>
          )}
          {errors.password && <ErrorText>{errors.password}</ErrorText>}
        </FormGroup>

        {isRegisterMode && (
          <>
            <FormGroup>
              <Label>Confirmar contraseña</Label>
              <PasswordWrapper>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </PasswordWrapper>
              {formData.confirmPassword && errors.confirmPassword && (
                <ErrorText>{errors.confirmPassword}</ErrorText>
              )}
            </FormGroup>

            <FormGroup>
              <Label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                  disabled={!termsViewed}
                  style={{ margin: 0 }}
                />
                <span style={{ whiteSpace: 'nowrap' }}>
                  Acepto los <a href="#" onClick={viewTerms}>términos y condiciones</a>
                </span>
              </Label>
              {errors.terms && <ErrorText>{errors.terms}</ErrorText>}
            </FormGroup>
          </>
        )}

        <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '1rem' }}>
          {isRegisterMode ? 'Registrarse' : 'Iniciar sesión'}
        </Button>

        {!isRegisterMode && (
          <Button
            type="button"
            onClick={handlePasswordRecovery}
            style={{
              backgroundColor: 'transparent',
              color: '#4285f4',
              border: 'none',
              marginTop: '0.5rem'
            }}
          >
            Recuperar contraseña
          </Button>
        )}

        {/* Separator */}
        <div style={{ 
          textAlign: 'center', 
          margin: '1rem 0', 
          position: 'relative' 
        }}>
          <span style={{ 
            backgroundColor: 'white', 
            padding: '0 10px',
            color: '#666',
            position: 'relative',
            zIndex: 1
          }}>
            O
          </span>
          <hr style={{ 
            margin: '-0.7rem 0 1rem',
            borderColor: '#ddd'
          }} />
        </div>

        {/* Google Login Button */}
        {!isRegisterMode && (
          <GoogleLogin
            clientId={googleId}
            render={renderProps => (
              <Button 
                type="button"
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                style={{ 
                  backgroundColor: '#4285f4',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <FaGoogle /> Iniciar sesión con Google
              </Button>
            )}
            onSuccess={loginWithGoogle}
            onFailure={handleGoogleFailure}
            cookiePolicy={'single_host_origin'}
          />
        )}

        {isRegisterMode && (
          <GoogleLogin
            clientId={googleId}
            render={renderProps => (
              <Button 
                type="button"
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                style={{ 
                  backgroundColor: '#4285f4',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <FaGoogle /> Registrarse con Google
              </Button>
            )}
            onSuccess={registerWithGoogle}
            onFailure={handleGoogleFailure}
            cookiePolicy={'single_host_origin'}
          />
        )}
      </form>
      {errors.submit && <ErrorText>{errors.submit}</ErrorText>}
      {successMessage && <ErrorText style={{ color: 'green' }}>{successMessage}</ErrorText>}
      <LinkText>
        {isRegisterMode ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}
        <br />
        <a href="#" onClick={() => setIsRegisterMode(!isRegisterMode)}>
          {isRegisterMode ? 'Inicia sesión ahora' : 'Regístrate aquí'}
        </a>
      </LinkText>
      {modalMessage && (
        <Modal>
          <ModalContent>
            <CloseButton onClick={() => setModalMessage('')}>&times;</CloseButton>
            <p>{modalMessage}</p>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default Login;
