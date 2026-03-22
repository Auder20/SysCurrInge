import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import useCoordinator from "../hooks/useCoordinator";
import "../global.css";

function MeetingScheduler() {
  const navigate = useNavigate();

  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [meetingsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const { loadAllMeetings, deleteMeeting } = useCoordinator();

  useEffect(() => {
    const loadMeetings = async () => {
      try {
        const meetingsData = await loadAllMeetings();
        console.log("Reuniones obtenidas:", meetingsData);
        setMeetings(meetingsData || []);
      } catch (error) {
        console.error("Error al cargar las reuniones:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMeetings();
  }, [loadAllMeetings]);

  function handleRegister() {
    navigate("/addMeetingForm");
  }

  const editMeeting = (meetingId) => {
    navigate("/editMeeting/" + meetingId);
    console.log(`Editar reunión ${meetingId}`);
  };

  async function handleDeleteMeeting(meetingId) {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta reunión?")) {
      try {
        const response = await deleteMeeting(meetingId);
        setMeetings(
          meetings.filter((meeting) => meeting.id_reunion !== meetingId)
        );
        console.log(response);
        alert("Reunión eliminada con éxito.");
      } catch (error) {
        console.error("Error al eliminar la reunión:", error);
        alert("Hubo un error al eliminar la reunión.");
      }
    }
  }

  const filteredMeetings = meetings.filter((meeting) => {
    return meeting.nombre_reunion
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

  const indexOfLastMeeting = currentPage * meetingsPerPage;
  const indexOfFirstMeeting = indexOfLastMeeting - meetingsPerPage;
  const currentMeetings = filteredMeetings.slice(
    indexOfFirstMeeting,
    indexOfLastMeeting
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredMeetings.length / meetingsPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha";
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  return (
  <div>
    <div className="toolbar">
      <div className="search-wrap">
        <input className="search-bar-custom" type="text" placeholder="Buscar reunión..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>
      <button className="btn-primary-custom" onClick={handleRegister}>+ Agregar Reunión</button>
    </div>

    {loading ? (
      <div className="loading-wrap">
        <div className="spinner-border text-primary" role="status" />
        <span>Cargando reuniones...</span>
      </div>
    ) : (
      <>
        <div style={{ overflowX: 'auto' }}>
          <table className="table-custom">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Fecha</th>
                <th>Ubicación</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentMeetings.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No hay reuniones registradas.</td></tr>
              ) : currentMeetings.map((meeting) => (
                <tr key={meeting.id_reunion}>
                  <td style={{ fontWeight: 500 }}>{meeting.nombre_reunion}</td>
                  <td style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    {meeting.fecha ? new Date(meeting.fecha).toLocaleDateString('es-CO') : '—'}
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{meeting.ubicacion || 'Sin especificar'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn-icon" title="Editar" onClick={() => editMeeting(meeting.id_reunion)}>✏️</button>
                    <button className="btn-icon" title="Eliminar" onClick={() => handleDeleteMeeting(meeting.id_reunion)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination-custom">
          <button className="page-btn" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>← Anterior</button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`} onClick={() => paginate(i + 1)}>{i + 1}</button>
          ))}
          <button className="page-btn" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>Siguiente →</button>
        </div>
      </>
    )}
  </div>
);
}

export default MeetingScheduler;
