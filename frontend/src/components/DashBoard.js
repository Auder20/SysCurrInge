import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

// Componente Navbar simplificado
const Navbar = () => (
  <nav className="navbar navbar-expand-lg" style={{ backgroundColor: 'var(--bg-sidebar)', padding: '12px 24px' }}>
    <a className="navbar-brand" style={{ color: '#fff', fontSize: '18px', fontWeight: 700, textDecoration: 'none' }} href="#">
      ⚡ SysCurringe
    </a>
    <div className="collapse navbar-collapse">
      <ul className="navbar-nav" style={{ display: 'flex', gap: '24px', margin: 0, padding: 0, listStyle: 'none' }}>
        <li className="nav-item">
          <Link className="nav-link-custom" to="/">Inicio</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link-custom" to="/reuniones">Reuniones</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link-custom" to="/actas">Actas</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link-custom" to="/tareas">Tareas</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link-custom" to="/repositorio">Repositorio</Link>
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
          {union.fecha} - {union.nombre_reunion || union.tema}
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
          {tarea.descripcion} - Vence: {formatDate(tarea.fecha_vencimiento)}
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

// Componente principal Dashboard
const Dashboard = () => {
  const [reuniones, setReuniones] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos desde la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reunionesResponse, tareasResponse] = await Promise.all([
          api.get('/user/myMeetings'),
          api.get('/user/myTasks')
        ]);
        
        setReuniones(reunionesResponse.data || []);
        setTareas(tareasResponse.data || []);
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Formatear fechas para mostrar
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div>Cargando...</div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh' }}>
      <Navbar />
      <div className="container" style={{ padding: '32px 24px' }}>
        <div className="row">
          <div className="col-lg-8">
            <ProximasReuniones reuniones={reuniones} />
            <TareasPendientes tareas={tareas} />
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
