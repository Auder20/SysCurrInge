import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";
import { FaEdit, FaTrash } from "react-icons/fa";

function UserManagement() {
  const navigate = useNavigate();
  const { loadAllUsers, deleteUser } = useAdmin();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await loadAllUsers();
        console.log("Usuarios obtenidos:", usersData);
        setUsers(usersData || []);
      } catch (error) {
        console.error("Error al cargar los usuarios:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [loadAllUsers]);

  function handleRegister() {
    navigate("/register");
  }

  const editUser = (userId) => {
    navigate("/edit-user/" + userId);
    console.log(`Editar usuario ${userId}`);
  };

  async function handleDeleteUser(userId) {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        console.log("si entro aqui");
        const response = await deleteUser(userId);
        console.log(response);
        setUsers(users.filter((user) => user.id_usuario !== userId));
        alert("Usuario eliminado con éxito.");
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        alert("Hubo un error al eliminar el usuario.");
      }
    }
  }

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.nombre} ${user.apellido}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const getRoleBadge = (role) => {
    const roleClass = role === 'administrador' ? 'badge-role-admin' : 
                     role === 'coordinador' ? 'badge-role-coordinador' : 
                     'badge-role-participante';
    return <span className={roleClass}>{role}</span>;
  };

  return (
  <div>
    <div className="toolbar">
      <div className="search-wrap">
        <input className="search-bar-custom" type="text" placeholder="Buscar usuario por nombre..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>
      <button className="btn-primary-custom" onClick={handleRegister}>+ Agregar Usuario</button>
    </div>

    {loading ? (
      <div className="loading-wrap">
        <div className="spinner-border text-primary" role="status" />
        <span>Cargando usuarios...</span>
      </div>
    ) : (
      <>
        <div style={{ overflowX: 'auto' }}>
          <table className="table-custom">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No hay usuarios registrados.</td></tr>
              ) : currentUsers.map((user) => (
                <tr key={user.id_usuario}>
                  <td style={{ fontWeight: 500 }}>{user.nombre} {user.apellido}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{user.correo_electronico}</td>
                  <td><span className={`badge-role-${user.rol}`}>{user.rol}</span></td>
                  <td><span style={{ color: user.estado ? 'var(--success)' : 'var(--danger)', fontWeight: 500, fontSize: '13px' }}>{user.estado ? 'Activo' : 'Inactivo'}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn-icon" title="Editar" onClick={() => editUser(user.id_usuario)}>✏️</button>
                    <button className="btn-icon" title="Eliminar" onClick={() => handleDeleteUser(user.id_usuario)} disabled={user.rol === 'administrador'}>🗑️</button>
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

export default UserManagement;
