// src/components/GuestDashboard/GuestDashboard.js
import React from "react";
import MeetingList from "./MeetingList";
import MinutesList from "./MinutesList";
import "bootstrap/dist/css/bootstrap.min.css";

function GuestDashboard() {
  return (
    <div className="container p-4">
      <h1 className="text-center mb-4">Panel de Invitado</h1>

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
