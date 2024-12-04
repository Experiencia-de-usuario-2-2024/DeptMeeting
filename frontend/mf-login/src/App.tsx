import React from "react";
import "./App.css";
import Login from "./components/Login";
import LoginForm from './components/LoginForm.tsx';

function App() {
  const handleLogin = () => {
    // handle login logic here 
    console.log("Login en handleLogin de App.tsx");
  };

  return (
      <div className="App">
        <header className="App-header">
          <LoginForm/>
        </header>
      </div>
  );
}

export default App;
