import React, { useState } from 'react';
import styles from '../styles/LoginForm.module.css';
import { authenticateUser } from '../utils/auth';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authenticateUser(email, password);
      setError('');
      // Redirigir o realizar alguna acción después del login exitoso
    } catch (err) {
      // @ts-ignore
      setError(err.message);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginFormWrapper}>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <h1 className={styles.appName}>DeptMeeting</h1>
          <h2 className={styles.loginTitle}>Iniciar Sesión</h2>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className={styles.input}
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
            <a href="#" className={styles.registerLink}>
              Regístrate Aquí
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;