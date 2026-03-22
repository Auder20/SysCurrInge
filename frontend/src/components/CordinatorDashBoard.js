// src/components/CoordinatorDashboard/CoordinatorDashboard.js
import React from "react";
import TaskManagement from "./TaskManagement";
import MeetingScheduler from "./MeetingScheduler";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function CoordinatorDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="container p-4">
      <h1 className="text-center mb-4">Panel de Coordinador</h1>

      {/* Botón para cerrar sesión */}
      <button
        className="btn btn-danger position-absolute top-0 end-0 m-3"
        onClick={handleLogout}
      >
        Cerrar sesión
      </button>

      {/* Sección de gestión de tareas */}
      <section className="mb-5">
        <h2 className="text-primary mb-3">Gestión de Tareas</h2>
        <TaskManagement />
      </section>

      {/* Sección de programación de reuniones */}
      <section>
        <h2 className="text-primary mb-3">Programación de Reuniones</h2>
        <MeetingScheduler />
      </section>
    </div>
  );
}

export default CoordinatorDashboard;
