import React from "react";
import { MeetingManagementProvider } from "./components/MeetingManagementContext";
import MeetingManagement from "./components/MeetingManagement";


function App() {
  return (
    <MeetingManagementProvider>
        <MeetingManagement />
    </MeetingManagementProvider>
  );
}

export default App;