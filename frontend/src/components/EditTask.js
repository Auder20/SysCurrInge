import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";
import { jwtDecode } from "jwt-decode";
import "../global.css";

function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTaskById, updateTask } = useAdmin();

  const [taskData, setTaskData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const task = await getTaskById(id);
        setTaskData(task);
      } catch (error) {
        console.error("Error al cargar la tarea:", error);
      }
    };

    fetchTaskData();
  }, [id, getTaskById]);

  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmation = window.confirm(
      "¿Estás seguro de que deseas modificar esta tarea?"
    );

    if (confirmation) {
      try {
        await updateTask(id, taskData);
        navigate(-1);
      } catch (error) {
        console.error("Error al actualizar la tarea:", error);
      }
    } else {
      console.log("Edición cancelada");
    }
  };

  if (!taskData) {
    return <div>Cargando datos de la tarea...</div>;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-page)' }}>
      <div className="d-flex justify-content-center align-items-center min-h-screen p-4">
        <div className="card-custom" style={{ maxWidth: '480px', margin: '40px auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>Editar Tarea</h2>
          <hr style={{ opacity: 0.1, margin: '0 0 24px' }} />
          
          <form onSubmit={handleSubmit}>
            <div className="form-group-custom">
              <label className="form-label-custom">Descripción</label>
              <textarea
                className="form-control-custom"
                name="descripcion"
                value={taskData.descripcion}
                onChange={handleChange}
                placeholder="Descripción de la tarea"
                rows={5}
                style={{ resize: "vertical" }}
                required
              />
            </div>

            <div className="form-group-custom">
              <label className="form-label-custom">Fecha de Vencimiento</label>
              <input
                type="date"
                className="form-control-custom"
                name="fecha_vencimiento"
                value={taskData.fecha_vencimiento}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group-custom">
              <label className="form-label-custom">Estado</label>
              <select
                className="form-control-custom"
                name="estado"
                value={taskData.estado}
                onChange={handleChange}
                required
              >
                <option value="pendiente">Pendiente</option>
                <option value="en_progreso">En Progreso</option>
                <option value="completada">Completada</option>
              </select>
            </div>

            <div className="form-group-custom">
              <label className="form-label-custom">ID Usuario</label>
              <input
                type="number"
                className="form-control-custom"
                name="id_usuario"
                value={taskData.id_usuario}
                onChange={handleChange}
                placeholder="ID del Usuario"
                required
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

export default EditTask;
