import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import useAdmin from "../hooks/useAdmin";

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getUserById, updateUser } = useAdmin();

  const [userData, setUserData] = useState(null); // Cambiamos el valor inicial a null para validar la carga

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUserById(id);
        setUserData(user);
      } catch (error) {
        console.error("Error al cargar el usuario:", error);
      }
    };

    fetchUserData();
  }, [id, getUserById]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mostrar mensaje de confirmación
    const confirmation = window.confirm(
      "¿Estás seguro de que deseas modificar este usuario?"
    );

    if (confirmation) {
      try {
        await updateUser(id, userData);
        navigate(-1); // Redirigir después de la actualización
      } catch (error) {
        console.error("Error al actualizar el usuario:", error);
      }
    } else {
      console.log("Actualización cancelada");
    }
  };

  const handleCancel = () => {
    navigate("/user-management");
  };

  if (!userData) {
    // Mostramos un mensaje de carga mientras los datos no estén disponibles
    return <div>Cargando datos del usuario...</div>;
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
        <h3 className="text-center mb-4">Editar Usuario</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              name="nombre"
              value={userData.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Apellido</label>
            <input
              type="text"
              className="form-control"
              name="apellido"
              value={userData.apellido}
              onChange={handleChange}
              placeholder="Apellido"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              name="correo_electronico"
              value={userData.correo_electronico}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Estado</label>
            <select
              className="form-select"
              name="estado"
              value={userData.estado}
              onChange={handleChange}
              required
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Rol</label>
            <select
              className="form-select"
              name="rol"
              value={userData.rol}
              onChange={handleChange}
              required
            >
              <option value="admnistrador">Administrador</option>
              <option value="coordinador">Coordinador</option>
              <option value="miembro">Miembro</option>
              <option value="invitado">Invitado</option>
              <option value="jefe de departamento">Jefe de Departamento</option>
            </select>
          </div>
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

export default EditUser;
