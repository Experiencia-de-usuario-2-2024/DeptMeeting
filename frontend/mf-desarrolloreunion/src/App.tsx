import React from "react";
//import "./App.css";
import {MeetingManagementProvider} from "./components/MeetingManagementContext";
import FormularioPreReunion from "./components/FormularioPreReunion";
import MeetingManagement from "./components/MeetingManagement";




function App() {
  return (

      /*
      <div className="App">
      <FormularioPreReunion />
    </div>
      */
    <MeetingManagementProvider>
        <MeetingManagement />
    </MeetingManagementProvider>


  );
}

export default App;