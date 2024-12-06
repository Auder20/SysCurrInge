// src/components/MemberDashboard/MeetingList.js
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function MeetingList() {
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    // Simulación de la carga de reuniones desde una API o base de datos
    setMeetings([
      {
        id: 1,
        title: "Reunión de Planificación",
        date: "2024-11-10",
        time: "10:00 AM",
        location: "Sala 1",
      },
      {
        id: 2,
        title: "Reunión de Revisión de Proyecto",
        date: "2024-11-12",
        time: "2:00 PM",
        location: "Sala 3",
      },
    ]);
  }, []);

  return (
    <div className="container p-4">
      <h2 className="text-center mb-4">Lista de Reuniones</h2>
      <ul className="list-group">
        {meetings.map((meeting) => (
          <li key={meeting.id} className="list-group-item mb-3">
            <h3 className="text-primary">{meeting.title}</h3>
            <p>
              <strong>Fecha:</strong> {meeting.date}
            </p>
            <p>
              <strong>Hora:</strong> {meeting.time}
            </p>
            <p>
              <strong>Lugar:</strong> {meeting.location}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MeetingList;
