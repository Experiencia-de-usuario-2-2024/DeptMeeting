import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import EstructuraPagina from "./components/EstructuraPagina";
import LoginView from "./microfrontends/LoginView";
import './styles/buttonOverride.css';  // Import the button override styles
import './App.css';

const RedirectIfNotAuthenticated = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('tokenUser');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  return null;
};

function App() {
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const message = localStorage.getItem('modalMessage');
    if (message) {
      setModalMessage(message);
      localStorage.removeItem('modalMessage');
    }

    const handlePopState = () => {
      const message = localStorage.getItem('modalMessage');
      if (message) {
        setModalMessage(message);
        localStorage.removeItem('modalMessage');
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginView />} />
          <Route path="/home" element={<EstructuraPagina />} />
        </Routes>
        <RedirectIfNotAuthenticated />
      </BrowserRouter>
      {modalMessage && (
        <div className="Modal">
          <div className="ModalContent">
            <button className="CloseButton" onClick={() => setModalMessage('')}>&times;</button>
            <p>{modalMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;