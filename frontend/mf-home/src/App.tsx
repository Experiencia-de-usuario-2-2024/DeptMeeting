import React from "react";
import "./App.css";
import HomeProfesor from "./components/HomeProfesor";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p> */}

        {/* llamada al componente creado */}
        <HomeProfesor />

      </header>
    </div>
  );
}

export default App;