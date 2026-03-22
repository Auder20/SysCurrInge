// src/components/AdminDashboard.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import UserManagement from "./UserManagement";
import TaskManagement from "./TaskManagement";
import MeetingScheduler from "./MeetingScheduler";
import Reports from "./Reports";
import "../global.css";

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("users");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const sections = {
    users:    { label: "Usuarios",   icon: "👥", component: <UserManagement /> },
    tasks:    { label: "Tareas",     icon: "✅", component: <TaskManagement /> },
    meetings: { label: "Reuniones",  icon: "📅", component: <MeetingScheduler /> },
    reports:  { label: "Reportes",   icon: "📊", component: <Reports /> },
  };

  return (
    <div className="dashboard-layout">
      <nav className="dashboard-sidebar">
        <div className="sidebar-logo">⚡ SysCurringe</div>
        <span className="sidebar-section-label">Panel Admin</span>
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
          <p className="page-subtitle">Gestiona los {sections[activeSection].label.toLowerCase()} del sistema</p>
        </div>
        <div className="card-custom">
          {sections[activeSection].component}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
