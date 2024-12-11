import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
        const strength = calculatePasswordStrength(password);
        setPasswordStrength(strength);
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

    const handleSubmit = async (e: React.FormEvent) => {
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

        const tagName = fullName.split(' ').map(word => word[0]).join('');
        try {
            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `http://deptmeeting.diinf.usach.cl/api/api/auth/signup/`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    name: fullName,
                    email: email,
                    password: password,
                    type: 'user', // Assuming 'user' as a default type
                    tagName: tagName
                })
            };

            const response = await axios.request(config);
            console.log(JSON.stringify(response.data));
            setTimeout(() => {
                onSwitchToLogin();
            }, 5000);
        } catch (error) {
            console.log(error);
        }
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