// src/components/GuestDashboard/GuestDashboard.js
import React, { useState } from "react";
import MeetingList from "./MeetingList";
import MinutesList from "./MinutesList";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "../global.css";

function GuestDashboard() {
  const [activeSection, setActiveSection] = useState("meetings");
  const navigate = useNavigate();
  const { logout } = useAuth();

  const sections = {
    meetings: { label: "Reuniones", icon: "📅", component: <MeetingList /> },
    minutes: { label: "Actas", icon: "📄", component: <MinutesList /> },
  };

  return (
    <div className="dashboard-layout">
      <nav className="dashboard-sidebar">
        <div className="sidebar-logo">⚡ SysCurringe</div>
        <span className="sidebar-section-label">Panel Invitado</span>
        {Object.entries(sections).map(([key, { label, icon }]) => (
          <button key={key} className={`sidebar-item ${activeSection === key ? 'active' : ''}`} onClick={() => setActiveSection(key)}>
            <span>{icon}</span>{label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button className="sidebar-item danger" onClick={() => { logout(); navigate('/login'); }}>
          🚪 Cerrar sesión
        </button>
      </nav>
      <main className="dashboard-main">
        <div className="page-header">
          <h1 className="page-title">{sections[activeSection].label}</h1>
          <p className="page-subtitle">Consulta las {sections[activeSection].label.toLowerCase()} disponibles</p>
        </div>
        <div className="card-custom">
          {sections[activeSection].component}
        </div>
      </main>
    </div>
  );
}

export default GuestDashboard;
