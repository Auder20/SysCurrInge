// src/components/MemberDashboard/MemberDashboard.js
import React, { useState } from "react";
import TaskList from "./TaskList";
import MeetingList from "./MeetingList";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function MemberDashboard() {
  const [activeSection, setActiveSection] = useState("tasks");
  const navigate = useNavigate();
  const { logout } = useAuth();

  const sections = {
    tasks: { label: "Mis Tareas", icon: "✅", component: <TaskList /> },
    meetings: { label: "Mis Reuniones", icon: "📅", component: <MeetingList /> },
  };

  return (
    <div className="dashboard-layout">
      <nav className="dashboard-sidebar">
        <div className="sidebar-logo">⚡ SysCurringe</div>
        <span className="sidebar-section-label">Panel Miembro</span>
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
          <p className="page-subtitle">Revisa tus {sections[activeSection].label.toLowerCase()}</p>
        </div>
        <div className="card-custom">
          {sections[activeSection].component}
        </div>
      </main>
    </div>
  );
}

export default MemberDashboard;
