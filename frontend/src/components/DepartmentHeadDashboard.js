// src/components/DepartmentHeadDashboard/DepartmentHeadDashboard.js
import React from "react";
import TaskList from "./TaskList";
import ReportList from "./ReportList";
import MeetingList from "./MeetingList";

function DepartmentHeadDashboard() {
  return (
    <div>
      <h1>Panel del Jefe de Departamento</h1>

      {/* Sección de Tareas */}
      <section>
        <h2>Tareas del Departamento</h2>
        <TaskList />
      </section>

      {/* Sección de Reportes */}
      <section>
        <h2>Reportes del Departamento</h2>
        <ReportList />
      </section>

      {/* Sección de Reuniones del Departamento */}
      <section>
        <h2>Reuniones del Departamento</h2>
        <MeetingList />
      </section>
    </div>
  );
}

export default DepartmentHeadDashboard;
