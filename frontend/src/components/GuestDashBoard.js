// src/components/GuestDashboard/GuestDashboard.js
import React from "react";
import MeetingList from "./MeetingList";
import MinutesList from "./MinutesList";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function GuestDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="container p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Panel de Invitado</h1>
        <button className="btn btn-danger" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>

      {/* Sección de reuniones */}
      <section className="mb-5">
        <h2 className="text-primary mb-3">Reuniones Programadas</h2>
        <MeetingList />
      </section>

      {/* Sección de actas */}
      <section>
        <h2 className="text-primary mb-3">Actas Disponibles</h2>
        <MinutesList />
      </section>
    </div>
  );
}

export default GuestDashboard;
