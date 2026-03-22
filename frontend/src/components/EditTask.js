import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import useAdmin from "../hooks/useAdmin";
import { jwtDecode } from "jwt-decode";

function EditTask() {
  const { id } = useParams(); // Obtener el id de la tarea desde la URL
  const navigate = useNavigate();
  const { getTaskById, updateTask } = useAdmin(); // Hooks personalizados para manejar tareas

  const [taskData, setTaskData] = useState(null); // Estado para los datos de la tarea
  const [users, setUsers] = useState([]); // Estado para la lista de usuarios
  const [loadingUsers, setLoadingUsers] = useState(false); // Estado de carga de usuarios

  // Cargar datos de la tarea al montar el componente
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

    // Confirmación antes de enviar los cambios
    const confirmation = window.confirm(
      "¿Estás seguro de que deseas modificar esta tarea?"
    );

    if (confirmation) {
      try {
        await updateTask(id, taskData);
        navigate(-1); // Redirigir al listado de tareas después de la actualización
      } catch (error) {
        console.error("Error al actualizar la tarea:", error);
      }
    } else {
      console.log("Edición cancelada");
    }
  };

  if (!taskData) {
    // Mensaje de carga mientras se obtienen los datos
    return <div>Cargando datos de la tarea...</div>;
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
        <h3 className="text-center mb-4">Editar Tarea</h3>
        <form onSubmit={handleSubmit}>
          {/* Descripción */}
          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <textarea
              className="form-control"
              name="descripcion"
              value={taskData.descripcion}
              onChange={handleChange}
              placeholder="Descripción de la tarea"
              rows="5" // Controla la altura del campo
              style={{ resize: "vertical" }} // Permite ajustar manualmente la altura
              required
            />
          </div>

          {/* Fecha de Vencimiento */}
          <div className="mb-3">
            <label className="form-label">Fecha de Vencimiento</label>
            <input
              type="date"
              className="form-control"
              name="fecha_vencimiento"
              value={taskData.fecha_vencimiento}
              onChange={handleChange}
              required
            />
          </div>

          {/* Estado */}
          <div className="mb-3">
            <label className="form-label">Estado</label>
            <select
              className="form-select"
              name="estado"
              value={taskData.estado}
              onChange={handleChange}
              required
            >
              <option value="pendiente">Pendiente</option>
              <option value="en progreso">En Progreso</option>
              <option value="completada">Completada</option>
            </select>
          </div>

          {/* ID Usuario */}
          <div className="mb-3">
            <label className="form-label">ID Usuario</label>
            <input
              type="number"
              className="form-control"
              name="id_usuario"
              value={taskData.id_usuario}
              onChange={handleChange}
              placeholder="ID del Usuario"
              required
            />
          </div>

          {/* Botones */}
          <div className="d-flex justify-content-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-secondary w-45"
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

export default EditTask;
