import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import useAdmin from "../hooks/useAdmin";

function EditMeeting() {
  const { id } = useParams(); // Obtener el id de la reunión desde la URL
  const navigate = useNavigate();
  const { getMeetingById, updateMeeting } = useAdmin(); // Hooks personalizados para manejar reuniones
  const [meetingData, setMeetingData] = useState(null); // Estado para los datos de la reunión
  const [loading, setLoading] = useState(true); // Estado de carga

  // Cargar datos de la reunión al montar el componente
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

    // Confirmación antes de enviar los cambios
    const confirmation = window.confirm(
      "¿Estás seguro de que deseas modificar esta reunión?"
    );

    if (confirmation) {
      try {
        await updateMeeting(id, meetingData);
        console.log("Reunión actualizada con éxito");
        navigate(-1); // Redirigir al listado de reuniones después de la actualización
      } catch (error) {
        console.error("Error al actualizar la reunión:", error);
        alert("Hubo un error al actualizar la reunión.");
      }
    } else {
      console.log("Edición cancelada");
    }
  };

  if (!meetingData) {
    // Mensaje de carga mientras se obtienen los datos
    return <div>Cargando datos de la reunión...</div>;
  }

  return (
    <div className="container mt-4 d-flex justify-content-center">
      <div
        className="p-4 shadow-sm rounded-3 w-100"
        style={{
          maxWidth: "400px", // Ajuste del ancho máximo
          backgroundColor: "#f8f9fa",
          border: "1px solid #ddd",
        }}
      >
        <h3 className="text-center mb-4">Editar Reunión</h3>
        <form onSubmit={handleSubmit}>
          {/* Nombre de la Reunión */}
          <div className="mb-3">
            <label className="form-label">Nombre de la Reunión</label>
            <input
              type="text"
              className="form-control"
              name="nombre_reunion"
              value={meetingData.nombre_reunion || ""}
              onChange={handleChange}
              placeholder="Ingrese el nombre de la reunión"
              required
            />
          </div>

          {/* Fecha de la Reunión */}
          <div className="mb-3">
            <label className="form-label">Fecha de la Reunión</label>
            <input
              type="date"
              className="form-control"
              name="fecha"
              value={meetingData.fecha || ""}
              onChange={handleChange}
              required
            />
          </div>

          {/* Ubicación */}
          <div className="mb-3">
            <label className="form-label">Ubicación</label>
            <input
              type="text"
              className="form-control"
              name="ubicacion"
              value={meetingData.ubicacion || ""}
              onChange={handleChange}
              placeholder="Ingrese la ubicación"
            />
          </div>

          {/* Botones */}
          <div className="d-flex justify-content-between mt-4">
            <button
              type="button"
              className="btn btn-secondary w-45"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary w-45">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditMeeting;
