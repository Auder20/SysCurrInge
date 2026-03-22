import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";
import useCoordinator from "../hooks/useCoordinator";
import { jwtDecode } from "jwt-decode";
import "../global.css";

const AddMeetingForm = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [userId, setUserId] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const { addMeeting } = useAdmin();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(String(decoded.id));
        setCurrentUser(decoded);
      } catch (error) {
        console.error('Error al decodificar token:', error);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !date || !userId) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    const newMeeting = {
      nombre_reunion: title,
      fecha: date,
      ubicacion: location,
      id_usuario: parseInt(userId),
    };

    try {
      const res = await addMeeting(newMeeting);

      if (res && res.message) {
        setTitle("");
        setDate("");
        setLocation("");
        setUserId("");

        alert("Reunión agregada con éxito!");
        navigate(-1);
      } else {
        alert(res.message || "Error desconocido al agregar la reunión.");
      }
    } catch (err) {
      console.error("Error al registrar la reunión:", err);
      alert("Error al registrar la reunión.");
    }
  };

  const handleCancel = () => {
    setTitle("");
    setDate("");
    setLocation("");
    navigate(-1);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-page)' }}>
      <div className="d-flex justify-content-center align-items-center min-h-screen p-4">
        <div className="card-custom" style={{ maxWidth: '480px', margin: '40px auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>Agregar Nueva Reunión</h2>
          <hr style={{ opacity: 0.1, margin: '0 0 24px' }} />
          
          <form onSubmit={handleSubmit}>
            <div className="form-group-custom">
              <label className="form-label-custom">Título de la Reunión</label>
              <input
                type="text"
                className="form-control-custom"
                placeholder="Ingrese el título de la reunión"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group-custom">
              <label className="form-label-custom">Fecha de la Reunión</label>
              <input
                type="date"
                className="form-control-custom"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group-custom">
              <label className="form-label-custom">Ubicación</label>
              <input
                type="text"
                className="form-control-custom"
                placeholder="Ingrese la ubicación"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="form-group-custom">
              <label className="form-label-custom">Organizador</label>
              {currentUser ? (
                <div className="form-control-custom" style={{ backgroundColor: '#f8f9fa' }}>
                  Usuario ID: {currentUser.id} (Rol: {currentUser.role})
                </div>
              ) : (
                <div className="form-control-custom" style={{ backgroundColor: '#f8f9fa' }}>
                  Cargando información del usuario...
                </div>
              )}
            </div>

            <button type="submit" className="btn-primary-custom" style={{ width: '100%' }}>
              Agregar Reunión
            </button>
            <button type="button" className="btn-secondary-custom" style={{ width: '100%', marginTop: '10px' }} onClick={handleCancel}>
              Cancelar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMeetingForm;
