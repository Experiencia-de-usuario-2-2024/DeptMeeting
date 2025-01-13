import React, { useEffect, useState } from "react";
import "./App.css";
import Informacion from "./components/Informacion";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  
  localStorage.setItem('tipoUsuario', 'profesor');

  useEffect(() => {
    const userType = localStorage.getItem('tipoUsuario');
    console.log('Tipo de usuario:', userType); // Para debugging
    
    // Validación más flexible que acepta diferentes variantes
    setIsAdmin(
      userType?.toLowerCase() === 'profesor' || 
      userType?.toLowerCase() === 'profesora' ||
      userType?.toLowerCase() === 'admin' ||
      userType?.toLowerCase() === 'administrator'
    );
  }, []);

  return (
    <div>
      {isAdmin ? (
        <Informacion />
      ) : (
        <div style={{padding: "20px", textAlign: "center"}}>
          <h1>Acceso Denegado</h1>
          <p>No tienes permisos para acceder al panel de administración.</p>
          <p>Tipo de usuario actual: {localStorage.getItem('tipoUsuario')}</p>
        </div>
      )}
    </div>
  );
}

export default App;