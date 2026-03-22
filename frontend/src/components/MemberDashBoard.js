// src/components/MemberDashboard/MemberDashboard.js
import React from "react";
import TaskList from "./TaskList";
import MeetingList from "./MeetingList";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function MemberDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="container p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Panel del Miembro</h1>
        <button className="btn btn-danger" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>

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
