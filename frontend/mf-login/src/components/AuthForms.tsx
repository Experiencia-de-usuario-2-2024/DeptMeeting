import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthForms: React.FC = () => {
    const [isLoginView, setIsLoginView] = useState(true);

    const switchToRegister = () => setIsLoginView(false);
    const switchToLogin = () => setIsLoginView(true);

    return (
        <div>
            {isLoginView ? (
                <LoginForm onSwitchToRegister={switchToRegister} />
            ) : (
                <RegisterForm onSwitchToLogin={switchToLogin} />
            )}
        </div>
    );
};

export default AuthForms;

