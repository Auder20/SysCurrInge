// src/components/GuestDashboard/MinutesList.js
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function MinutesList() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular tiempo de carga
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="container p-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando actas...</p>
      </div>
    );
  }

  return (
    <div className="container p-4">
      <h2 className="text-primary mb-4">Actas Disponibles</h2>
      <div className="alert alert-info text-center">
        <h4 className="alert-heading">No hay actas disponibles</h4>
        <p>Las actas de reuniones estarán disponibles próximamente.</p>
        <hr />
        <p className="mb-0">
          Cuando se implemente el sistema de actas en el backend, podrás ver y descargar los documentos aquí.
        </p>
      </div>
    </div>
  );
}

export default MinutesList;
