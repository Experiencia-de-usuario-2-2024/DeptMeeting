import React, { useState } from 'react';
import styles from '../styles/LoginForm.module.css';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, complete todos los campos.');
      return;
    }
    console.log('Intento de login con:', { email, password });
    setError('');
  };

  return (
      <div className={styles.loginContainer}>
        <div className={styles.loginFormWrapper}>
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <h1 className={styles.appName}>DeptMeeting</h1>
            <h2 className={styles.loginTitle}>Iniciar Sesión</h2>
            {error && <p className={styles.errorMessage}>{error}</p>}
            <div className={styles.formGroup}>
              <label htmlFor="email">
                Correo Electrónico
              </label>
              <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">
                Contraseña
              </label>
              <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />
            </div>
            <a href="#" className={styles.forgotPassword}>
              ¿Olvidaste tu contraseña?
            </a>
            <button type="submit" className={styles.submitButton}>
              Iniciar Sesión
            </button>
            <div className={styles.registerSection}>
              <p>¿No tienes una cuenta?</p>
              <button type="button" onClick={onSwitchToRegister} className={styles.registerLink}>
                Regístrate Aquí
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default LoginForm;

