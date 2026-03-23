import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";

function EditMeeting() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMeetingById, updateMeeting } = useAdmin();
  const [meetingData, setMeetingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeetingData = async () => {
      try {
        const meeting = await getMeetingById(id);
        setMeetingData(meeting);
      } catch (error) {
        console.error("Error al cargar la reunión:", error);
      }
    };

    fetchMeetingData();
  }, [id, getMeetingById]);

  const handleChange = (e) => {
    setMeetingData({ ...meetingData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmation = window.confirm(
      "¿Estás seguro de que deseas modificar esta reunión?"
    );

    if (confirmation) {
      try {
        await updateMeeting(id, meetingData);
        console.log("Reunión actualizada con éxito");
        navigate(-1);
      } catch (error) {
        console.error("Error al actualizar la reunión:", error);
        alert("Hubo un error al actualizar la reunión.");
      }
    } else {
      console.log("Edición cancelada");
    }
  };

  if (!meetingData) {
    return <div>Cargando datos de la reunión...</div>;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-page)' }}>
      <div className="d-flex justify-content-center align-items-center min-h-screen p-4">
        <div className="card-custom" style={{ maxWidth: '480px', margin: '40px auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>Editar Reunión</h2>
          <hr style={{ opacity: 0.1, margin: '0 0 24px' }} />
          
          <form onSubmit={handleSubmit}>
            <div className="form-group-custom">
              <label className="form-label-custom">Nombre de la Reunión</label>
              <input
                type="text"
                className="form-control-custom"
                name="nombre_reunion"
                value={meetingData.nombre_reunion || ""}
                onChange={handleChange}
                placeholder="Ingrese el nombre de la reunión"
                required
              />
            </div>

            <div className="form-group-custom">
              <label className="form-label-custom">Fecha de la Reunión</label>
              <input
                type="date"
                className="form-control-custom"
                name="fecha"
                value={meetingData.fecha || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group-custom">
              <label className="form-label-custom">Ubicación</label>
              <input
                type="text"
                className="form-control-custom"
                name="ubicacion"
                value={meetingData.ubicacion || ""}
                onChange={handleChange}
                placeholder="Ingrese la ubicación"
              />
            </div>

            <button type="submit" className="btn-primary-custom" style={{ width: '100%' }}>
              Guardar Cambios
            </button>
            <button type="button" className="btn-secondary-custom" style={{ width: '100%', marginTop: '10px' }} onClick={() => navigate(-1)}>
              Cancelar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditMeeting;
