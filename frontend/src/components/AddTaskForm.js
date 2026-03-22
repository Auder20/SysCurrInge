import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";
import "../global.css";

const AddTaskForm = () => {
  const [descripcion, setDescripcion] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [estado, setEstado] = useState("pendiente");
  const [rolSeleccionado, setRolSeleccionado] = useState("");
  const [usuarioId, setUsuarioId] = useState("");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const navigate = useNavigate();
  const { addTask, loadAllUsers } = useAdmin();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const usersData = await loadAllUsers();
        setUsers(usersData || []);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [loadAllUsers]);

  const filteredUsers = users.filter(user => 
    user.rol === rolSeleccionado || user.tipo_usuario === rolSeleccionado
  );

  useEffect(() => {
    setUsuarioId("");
  }, [rolSeleccionado]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Datos enviados: ", {
      descripcion,
      fecha_vencimiento: fechaVencimiento,
      estado,
      rolSeleccionado,
      id_usuario: usuarioId,
    });

    const nuevaTarea = {
      descripcion,
      fecha_vencimiento: fechaVencimiento,
      estado,
      id_usuario: parseInt(usuarioId),
      rol: rolSeleccionado,
    };

    try {
      const res = await addTask(nuevaTarea);

      if (res && res.message) {
        if (res.message === "Tarea creada exitosamente") {
          setDescripcion("");
          setFechaVencimiento("");
          setUsuarioId("");
          setRolSeleccionado("");
          setEstado("pendiente");

          alert("La tarea fue registrada con éxito.");
          navigate(-1);
        } else {
          alert(res.message || "Error desconocido al agregar la tarea.");
        }
      }
    } catch (err) {
      console.error("Error en el envío de la tarea:", err.message);
      alert("Hubo un error al enviar la tarea.");
    }
  };

  const handleCancel = () => {
    setDescripcion("");
    setFechaVencimiento("");
    setUsuarioId("");
    setRolSeleccionado("");
    setEstado("pendiente");
    navigate(-1);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-page)' }}>
      <div className="d-flex justify-content-center align-items-center min-h-screen p-4">
        <div className="card-custom" style={{ maxWidth: '480px', margin: '40px auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>Agregar Nueva Tarea</h2>
          <hr style={{ opacity: 0.1, margin: '0 0 24px' }} />
          
          <form onSubmit={handleSubmit}>
            <div className="form-group-custom">
              <label className="form-label-custom">Descripción</label>
              <textarea
                className="form-control-custom"
                rows={5}
                placeholder="Descripción de la tarea"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
              />
            </div>

            <div className="form-group-custom">
              <label className="form-label-custom">Fecha de Vencimiento</label>
              <input
                type="date"
                className="form-control-custom"
                value={fechaVencimiento}
                onChange={(e) => setFechaVencimiento(e.target.value)}
                required
              />
            </div>

            <div className="form-group-custom">
              <label className="form-label-custom">Tipo de Usuario</label>
              <select
                className="form-control-custom"
                value={rolSeleccionado}
                onChange={(e) => setRolSeleccionado(e.target.value)}
                required
              >
                <option value="">Selecciona un rol</option>
                <option value="administrador">Administrador</option>
                <option value="coordinador">Coordinador</option>
                <option value="participante">Participante</option>
              </select>
            </div>

            {rolSeleccionado && (
              <div className="form-group-custom">
                <label className="form-label-custom">Seleccionar Usuario</label>
                {loadingUsers ? (
                  <div className="alert-info-custom">
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                    Cargando usuarios...
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="alert-info-custom">
                    No hay usuarios disponibles para este rol
                  </div>
                ) : (
                  <select
                    className="form-control-custom"
                    value={usuarioId}
                    onChange={(e) => setUsuarioId(e.target.value)}
                    required
                  >
                    <option value="">Selecciona un usuario</option>
                    {filteredUsers.map((user) => (
                      <option key={user.id_usuario} value={user.id_usuario}>
                        {user.nombre} {user.apellido} ({user.correo_electronico})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            <button type="submit" className="btn-primary-custom" style={{ width: '100%' }}>
              Agregar Tarea
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

export default AddTaskForm;
