import React from "react";
import "./App.css";
import Login from "./components/Login";

function App() {
  const handleLogin = () => {
    // handle login logic here 
    console.log("Login en handleLogin de App.tsx");
  };

  return (
      <div className="App">
        <header className="App-header">
          {/* <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p> */}
          <Login onLogin={handleLogin} />

        </header>
      </div>
  );
}

export default App;
