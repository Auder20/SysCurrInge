// src/components/CoordinatorDashboard/CoordinatorDashboard.js
import React, { useState } from "react";
import TaskManagement from "./TaskManagement";
import MeetingScheduler from "./MeetingScheduler";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { CoordinatorProvider } from "../context/CoordinatorContext";

function CoordinatorDashboard() {
  const [activeSection, setActiveSection] = useState("tasks");
  const navigate = useNavigate();
  const { logout } = useAuth();

  const sections = {
    tasks: { label: "Tareas", icon: "✅", component: <TaskManagement /> },
    meetings: { label: "Reuniones", icon: "📅", component: <MeetingScheduler /> },
  };

  return (
    <CoordinatorProvider>
      <div className="dashboard-layout">
        <nav className="dashboard-sidebar">
          <div className="sidebar-logo">⚡ SysCurringe</div>
          <span className="sidebar-section-label">Panel Coordinador</span>
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
            <p className="page-subtitle">Gestiona las {sections[activeSection].label.toLowerCase()} del sistema</p>
          </div>
          <div className="card-custom">
            {sections[activeSection].component}
          </div>
        </main>
      </div>
    </CoordinatorProvider>
  );
}

export default CoordinatorDashboard;
