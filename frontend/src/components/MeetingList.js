// src/components/MemberDashboard/MeetingList.js
import React, { useState, useEffect } from "react";
import api from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";

function MeetingList() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMeetings = async () => {
      try {
        // Obtener el token del localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No se encontró token de autenticación");
          setLoading(false);
          return;
        }

        // Llamar a la API para obtener todas las reuniones
        const response = await api.get("/user/myMeetings");
        setMeetings(response.data || []);
      } catch (error) {
        console.error("Error al cargar las reuniones:", error);
        setMeetings([]);
      } finally {
        setLoading(false);
      }
    };

    loadMeetings();
  }, []);

  if (loading) {
    return (
      <div className="container p-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando reuniones...</p>
      </div>
    );
  }

  return (
    <div className="container p-4">
      <h2 className="text-center mb-4">Lista de Reuniones</h2>
      {meetings.length === 0 ? (
        <div className="alert alert-info text-center">
          No hay reuniones programadas.
        </div>
      ) : (
        <ul className="list-group">
          {meetings.map((meeting) => (
            <li key={meeting.id_reunion} className="list-group-item mb-3">
              <h3 className="text-primary">{meeting.nombre_reunion}</h3>
              <p>
                <strong>Fecha:</strong> {meeting.fecha}
              </p>
              <p>
                <strong>Ubicación:</strong> {meeting.ubicacion || "No especificada"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MeetingList;
