import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom"; // Importar Link

// Componente Navbar simplificado
const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <a className="navbar-brand" href="#">
      Dashboard
    </a>
    <div className="collapse navbar-collapse">
      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/">
            Inicio
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/reuniones">
            Reuniones
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/actas">
            Actas
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/tareas">
            Tareas
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/repositorio">
            Repositorio
          </Link>
        </li>
      </ul>
    </div>
  </nav>
);

// Componente ProximasReuniones simplificado
const ProximasReuniones = ({ reuniones }) => (
  <div className="card mb-3">
    <div className="card-header">Próximas Reuniones</div>
    <ul className="list-group list-group-flush">
      {reuniones.map((reunion, index) => (
        <li className="list-group-item" key={index}>
          {reunion.fecha} - {reunion.tema}
        </li>
      ))}
    </ul>
  </div>
);

// Componente TareasPendientes simplificado
const TareasPendientes = ({ tareas }) => (
  <div className="card mb-3">
    <div className="card-header">Tareas Pendientes</div>
    <ul className="list-group list-group-flush">
      {tareas.map((tarea, index) => (
        <li className="list-group-item" key={index}>
          {tarea.descripcion} - Vence: {tarea.fechaLimite}
        </li>
      ))}
    </ul>
  </div>
);

// Componente ActasRecientes simplificado
const ActasRecientes = ({ actas }) => (
  <div className="card mb-3">
    <div className="card-header">Actas Recientes</div>
    <ul className="list-group list-group-flush">
      {actas.map((acta, index) => (
        <li className="list-group-item" key={index}>
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
    <div className="card mb-3">
      <div className="card-header">Buscador Rápido</div>
      <div className="card-body">
        <input
          type="text"
          placeholder="Buscar..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="form-control"
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
    <div className="container mt-4">
      <Navbar />
      <div className="mt-4">
        <ProximasReuniones reuniones={reuniones} />
        <TareasPendientes tareas={tareas} />
        <ActasRecientes actas={actas} />
        <BuscadorRapido />
      </div>
    </div>
  );
};

export default Dashboard;
