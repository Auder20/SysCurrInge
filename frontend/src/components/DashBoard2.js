import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import api from "../services/api";

const Dashboard2 = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tareasRes, reunionesRes] = await Promise.all([
          api.get("/user/myTasks"),
          api.get("/user/myMeetings"),
        ]);
        setTasks(tareasRes.data || []);
        setMeetings(reunionesRes.data || []);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const pendientes = tasks.filter((t) => t.estado === "pendiente").length;
  const enProgreso = tasks.filter((t) => t.estado === "en_progreso").length;
  const completadas = tasks.filter((t) => t.estado === "completada").length;

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <nav className="dashboard-sidebar">
        <div className="sidebar-logo">⚡ SysCurringe</div>
        <span className="sidebar-section-label">Coordinador Asistente</span>
        <span className="sidebar-item active">📋 Mi Panel</span>
        <div style={{ flex: 1 }} />
        <button className="sidebar-item danger" onClick={handleLogout}>
          🚪 Cerrar sesión
        </button>
      </nav>

      {/* Main content */}
      <main className="dashboard-main">
        <div className="page-header">
          <h1 className="page-title">Panel de Asistente</h1>
          <p className="page-subtitle">
            Resumen de tus tareas y reuniones asignadas
          </p>
        </div>

        {loading ? (
          <div className="loading-wrap">
            <div className="spinner-border text-primary" role="status" />
            <span>Cargando tu información...</span>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="stats-grid" style={{ marginBottom: "24px" }}>
              <div className="stat-card">
                <div className="stat-value">{tasks.length}</div>
                <div className="stat-label">Tareas totales</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: "var(--warning)" }}>
                  {pendientes}
                </div>
                <div className="stat-label">Pendientes</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: "var(--info, #0284C7)" }}>
                  {enProgreso}
                </div>
                <div className="stat-label">En progreso</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: "var(--success)" }}>
                  {completadas}
                </div>
                <div className="stat-label">Completadas</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{meetings.length}</div>
                <div className="stat-label">Reuniones</div>
              </div>
            </div>

            {/* Tareas */}
            <div className="card-custom" style={{ marginBottom: "24px" }}>
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: "16px",
                }}
              >
                ✅ Tareas Asignadas
              </h2>

              {tasks.length === 0 ? (
                <div className="alert-info-custom">
                  No tienes tareas asignadas por el momento.
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table className="table-custom">
                    <thead>
                      <tr>
                        <th>Descripción</th>
                        <th>Vencimiento</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task) => (
                        <tr key={task.id_tarea}>
                          <td>{task.descripcion}</td>
                          <td style={{ color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                            {task.fecha_vencimiento
                              ? new Date(task.fecha_vencimiento).toLocaleDateString("es-CO")
                              : "—"}
                          </td>
                          <td>
                            <span className={`badge-${task.estado}`}>
                              {task.estado?.replace("_", " ")}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Reuniones */}
            <div className="card-custom">
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: "16px",
                }}
              >
                📅 Reuniones Programadas
              </h2>

              {meetings.length === 0 ? (
                <div className="alert-info-custom">
                  No tienes reuniones programadas por el momento.
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table className="table-custom">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Fecha</th>
                        <th>Ubicación</th>
                      </tr>
                    </thead>
                    <tbody>
                      {meetings.map((meeting) => (
                        <tr key={meeting.id_reunion}>
                          <td style={{ fontWeight: 500 }}>
                            {meeting.nombre_reunion}
                          </td>
                          <td style={{ color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                            {meeting.fecha
                              ? new Date(meeting.fecha).toLocaleDateString("es-CO")
                              : "—"}
                          </td>
                          <td style={{ color: "var(--text-secondary)" }}>
                            {meeting.ubicacion || "Sin especificar"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard2;