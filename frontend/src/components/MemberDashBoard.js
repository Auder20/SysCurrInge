// src/components/MemberDashboard/MemberDashboard.js
import React from "react";
import TaskList from "./TaskList";
import MeetingList from "./MeetingList";
import "bootstrap/dist/css/bootstrap.min.css";

function MemberDashboard() {
  return (
    <div className="container p-4">
      <h1 className="text-center mb-4">Panel del Miembro</h1>

      {/* Sección de tareas asignadas */}
      <section className="mb-5">
        <h2 className="text-primary mb-3">Tareas Asignadas</h2>
        <TaskList />
      </section>

      {/* Sección de reuniones programadas */}
      <section>
        <h2 className="text-primary mb-3">Reuniones Programadas</h2>
        <MeetingList />
      </section>
    </div>
  );
}

export default MemberDashboard;
