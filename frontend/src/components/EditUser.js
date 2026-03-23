import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";

function EditUser() {
  console.log("🚀 EditUser: Componente montado!");
  const { id } = useParams();
  console.log("🔍 EditUser: ID del parámetro:", id);
  const navigate = useNavigate();
  const { getUserById, updateUser } = useAdmin();

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("🔍 EditUser: Cargando usuario con ID:", id);
        const user = await getUserById(id);
        console.log("✅ EditUser: Usuario recibido:", user);
        setUserData(user);
      } catch (error) {
        console.error("❌ Error al cargar el usuario:", error);
      }
    };

    fetchUserData();
  }, [id, getUserById]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🔍 EditUser: Intentando actualizar usuario:", userData);

    const confirmation = window.confirm(
      "¿Estás seguro de que deseas modificar este usuario?"
    );

    if (confirmation) {
      try {
        console.log("📤 EditUser: Enviando datos:", userData);
        const result = await updateUser(id, userData);
        console.log("✅ EditUser: Usuario actualizado:", result);
        navigate(-1);
      } catch (error) {
        console.error("❌ Error al actualizar el usuario:", error);
      }
    } else {
      console.log("❌ Actualización cancelada");
    }
  };

  const handleCancel = () => {
    navigate("/user-management");
  };

  if (!userData) {
    return <div>Cargando datos del usuario...</div>;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-page)' }}>
      <div className="d-flex justify-content-center align-items-center min-h-screen p-4">
        <div className="card-custom" style={{ maxWidth: '480px', margin: '40px auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>Editar Usuario</h2>
          <hr style={{ opacity: 0.1, margin: '0 0 24px' }} />
          
          <form onSubmit={handleSubmit}>
            <div className="form-group-custom">
              <label className="form-label-custom">Nombre</label>
              <input
                type="text"
                className="form-control-custom"
                name="nombre"
                value={userData.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                required
              />
            </div>

            <div className="form-group-custom">
              <label className="form-label-custom">Apellido</label>
              <input
                type="text"
                className="form-control-custom"
                name="apellido"
                value={userData.apellido}
                onChange={handleChange}
                placeholder="Apellido"
                required
              />
            </div>

            <div className="form-group-custom">
              <label className="form-label-custom">Correo Electrónico</label>
              <input
                type="email"
                className="form-control-custom"
                name="correo_electronico"
                value={userData.correo_electronico}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            <div className="form-group-custom">
              <label className="form-label-custom">Estado</label>
              <select
                className="form-control-custom"
                name="estado"
                value={userData.estado}
                onChange={handleChange}
                required
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>

            <div className="form-group-custom">
              <label className="form-label-custom">Rol</label>
              <select
                className="form-control-custom"
                name="rol"
                value={userData.rol}
                onChange={handleChange}
                required
              >
                <option value="administrador">Administrador</option>
                <option value="coordinador">Coordinador</option>
                <option value="participante">Participante</option>
                <option value="invitado">Invitado</option>
                <option value="jefe de departamento">Jefe de Departamento</option>
              </select>
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

export default EditUser;
