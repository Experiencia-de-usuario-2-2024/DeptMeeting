import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import EstructuraPagina from "./components/EstructuraPagina";
import LoginView from "./microfrontends/LoginView";

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
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginView />} />
          <Route path="/home" element={<EstructuraPagina />} />
        </Routes>
        <RedirectIfNotAuthenticated />
      </BrowserRouter>
    </div>
  );
}

export default App;