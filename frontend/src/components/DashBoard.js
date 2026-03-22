import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../global.css";

// Componente Navbar simplificado
const Navbar = () => (
  <nav className="navbar navbar-expand-lg" style={{ backgroundColor: 'var(--bg-sidebar)', padding: '12px 24px' }}>
    <a className="navbar-brand" style={{ color: '#fff', fontSize: '18px', fontWeight: 700, textDecoration: 'none' }} href="#">
      ⚡ SysCurringe
    </a>
    <div className="collapse navbar-collapse">
      <ul className="navbar-nav" style={{ display: 'flex', gap: '24px', margin: 0, padding: 0, listStyle: 'none' }}>
        <li className="nav-item">
          <Link className="nav-link" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', padding: '8px 12px', borderRadius: 'var(--radius-sm)', transition: 'all var(--transition)' }} to="/" onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.65)'} >
            Inicio
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', padding: '8px 12px', borderRadius: 'var(--radius-sm)', transition: 'all var(--transition)' }} to="/reuniones" onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.65)'} >
            Reuniones
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', padding: '8px 12px', borderRadius: 'var(--radius-sm)', transition: 'all var(--transition)' }} to="/actas" onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.65)'} >
            Actas
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', padding: '8px 12px', borderRadius: 'var(--radius-sm)', transition: 'all var(--transition)' }} to="/tareas" onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.65)'} >
            Tareas
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', padding: '8px 12px', borderRadius: 'var(--radius-sm)', transition: 'all var(--transition)' }} to="/repositorio" onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.65)'} >
            Repositorio
          </Link>
        </li>
      </ul>
    </div>
  </nav>
);

// Componente ProximasReuniones simplificado
const ProximasReuniones = ({ reuniones }) => (
  <div className="card-custom mb-4">
    <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>Próximas Reuniones</div>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {reuniones.map((union, index) => (
        <li key={index} style={{ padding: '12px 16px', borderBottom: index < reuniones.length - 1 ? `1px solid var(--border)` : 'none', color: 'var(--text-primary)' }}>
          {union.fecha} - {union.tema}
        </li>
      ))}
    </ul>
  </div>
);

// Componente TareasPendientes simplificado
const TareasPendientes = ({ tareas }) => (
  <div className="card-custom mb-4">
    <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>Tareas Pendientes</div>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {tareas.map((tarea, index) => (
        <li key={index} style={{ padding: '12px 16px', borderBottom: index < tareas.length - 1 ? `1px solid var(--border)` : 'none', color: 'var(--text-primary)' }}>
          {tarea.descripcion} - Vence: {tarea.fechaLimite}
        </li>
      ))}
    </ul>
  </div>
);

// Componente ActasRecientes simplificado
const ActasRecientes = ({ actas }) => (
  <div className="card-custom mb-4">
    <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>Actas Recientes</div>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {actas.map((acta, index) => (
        <li key={index} style={{ padding: '12px 16px', borderBottom: index < actas.length - 1 ? `1px solid var(--border)` : 'none', color: 'var(--text-primary)' }}>
          {acta.titulo} - {acta.fecha}
        </li>
      ))}
    </ul>
  </div>
);

// Componente BuscadorRapido simplificado
const BuscadorRapido = () => {
  const [busqueda, setBusqueda] = useState("");

  return (
    <div className="card-custom">
      <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>Buscador Rápido</div>
      <div className="card-body" style={{ padding: 0 }}>
        <input
          type="text"
          placeholder="Buscar..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="form-control-custom"
        />
      </div>
    </div>
  );
};

// Componente principal Dashboard simplificado
const Dashboard = () => {
  // Datos de ejemplo
  const reuniones = [
    { fecha: "2024-09-22", tema: "Reunión de planificación" },
    { fecha: "2024-09-25", tema: "Revisión de proyectos" },
  ];

  const tareas = [
    { descripcion: "Preparar informe", fechaLimite: "2024-09-30" },
    { descripcion: "Revisar propuesta", fechaLimite: "2024-10-05" },
  ];

  const actas = [
    { titulo: "Acta reunión 15/09", fecha: "2024-09-15" },
    { titulo: "Acta reunión 08/09", fecha: "2024-09-08" },
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh' }}>
      <Navbar />
      <div className="container" style={{ padding: '32px 24px' }}>
        <div className="row">
          <div className="col-lg-8">
            <ProximasReuniones reuniones={reuniones} />
            <TareasPendientes tareas={tareas} />
            <ActasRecientes actas={actas} />
          </div>
          <div className="col-lg-4">
            <BuscadorRapido />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
