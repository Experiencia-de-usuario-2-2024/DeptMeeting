import React, { useState, useEffect } from 'react';
import styles from '../styles/RegisterForm.module.css';

interface RegisterFormProps {
    onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [rut, setRut] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [error, setError] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    useEffect(() => {
        // Calcular la fortaleza de la contraseña
        const strength = calculatePasswordStrength(password);
        setPasswordStrength(strength);

        // Verificar si las contraseñas coinciden
        setPasswordsMatch(password === confirmPassword || confirmPassword === '');
    }, [password, confirmPassword]);

    const calculatePasswordStrength = (pass: string): number => {
        let strength = 0;
        if (pass.length >= 8) strength++;
        if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
        if (pass.match(/\d/)) strength++;
        if (pass.match(/[^a-zA-Z\d]/)) strength++;
        return strength;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName || !rut || !password || !confirmPassword) {
            setError('Por favor, complete todos los campos.');
            return;
        }
        if (!passwordsMatch) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        if (passwordStrength < 3) {
            setError('La contraseña no cumple con los estándares de seguridad.');
            return;
        }
        if (!termsAccepted) {
            setError('Debe aceptar los términos y condiciones.');
            return;
        }
        // Aquí iría la lógica de registro
        console.log('Intento de registro con:', { fullName, rut, password });
        setError('');
    };

    return (
        <div className={styles.registerContainer}>
            <div className={styles.registerFormWrapper}>
                <form className={styles.registerForm} onSubmit={handleSubmit}>
                    <h1 className={styles.appName}>DeptMeeting</h1>
                    <h2 className={styles.registerTitle}>Crear Cuenta</h2>
                    {error && <p className={styles.errorMessage}>{error}</p>}
                    <div className={styles.inputGroup}>
                        <label htmlFor="fullName" className={styles.label}>
                            Nombre Completo
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            className={styles.input}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Juan Antonio Fernandez González"
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>
                            Correo electrónico
                        </label>
                        <input
                            type="text"
                            id="email"
                            className={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="juan.fernandez@mail.cl"
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="rut" className={styles.label}>
                            RUT
                        </label>
                        <input
                            type="text"
                            id="rut"
                            className={styles.input}
                            value={rut}
                            onChange={(e) => setRut(e.target.value)}
                            placeholder="20378498-3"
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
                        <div className={styles.passwordStrength}>
                            <div
                                className={styles.passwordStrengthBar}
                                style={{width: `${(passwordStrength / 4) * 100}%`}}
                            ></div>
                        </div>
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="confirmPassword" className={styles.label}>
                            Repetir Contraseña
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className={styles.input}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        {!passwordsMatch && (
                            <p className={styles.passwordMismatch}>Las contraseñas no coinciden</p>
                        )}
                    </div>
                    <div className={styles.termsGroup}>
                        <input
                            type="checkbox"
                            id="terms"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            required
                        />
                        <label htmlFor="terms" className={styles.termsLabel}>
                            Acepto los <a href="#" className={styles.termsLink}>Términos y Condiciones</a>
                        </label>
                    </div>
                    <button type="submit" className={styles.submitButton}>
                        Crear Cuenta
                    </button>
                    <div className={styles.loginSection}>
                        <p>¿Ya tienes una cuenta?</p>
                        <button onClick={onSwitchToLogin} className={styles.loginLink}>
                            Inicia Sesión
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;

