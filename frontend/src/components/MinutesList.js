// src/components/GuestDashboard/MinutesList.js
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function MinutesList() {
  const [minutes, setMinutes] = useState([]);

  useEffect(() => {
    // Simulación de la carga de actas desde una API o base de datos
    setMinutes([
      {
        id: 1,
        title: "Acta de la Reunión General",
        date: "2024-11-10",
        link: "/actas/reunion-general",
      },
      {
        id: 2,
        title: "Acta de la Reunión de Evaluación",
        date: "2024-11-15",
        link: "/actas/reunion-evaluacion",
      },
    ]);
  }, []);

  return (
    <div className="container p-4">
      <h2 className="text-primary mb-4">Actas Disponibles</h2>
      <ul className="list-group">
        {minutes.map((minute) => (
          <li key={minute.id} className="list-group-item">
            <h5>{minute.title}</h5>
            <p>
              <strong>Fecha:</strong> {minute.date}
            </p>
            <a
              href={minute.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-info"
            >
              Ver Acta
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MinutesList;
