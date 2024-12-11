import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const Auth: React.FC = () => {
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

export default Auth;

