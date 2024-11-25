import React, { lazy, Suspense, useEffect} from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, Link, useNavigate} from "react-router-dom";


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


      {/* <Suspense fallback={<div>Cargando...</div>}>
        <EstructuraPagina />
      </Suspense> */}

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginView />} />
          <Route path="/home" element={<EstructuraPagina />} />
          {/* <Route path="/micomponentedos" element={<MiComponenteDosPath />} /> */}
        </Routes>
        <RedirectIfNotAuthenticated />
      </BrowserRouter>



      
    </div>
  );
}

export default App;