import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";
import { FaEdit, FaTrash } from "react-icons/fa";

function UserManagement() {
  const navigate = useNavigate();
  const { loadAllUsers, deleteUser } = useAdmin();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [usersPerPage] = useState(6); // Número de usuarios por página
  const [searchQuery, setSearchQuery] = useState(""); // Query de búsqueda

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
    navigate("/editUser/" + userId);
    console.log(`Editar usuario ${userId}`);
  };

  async function handleDeleteUser(userId) {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        console.log("si entro aqui");
        const response = await deleteUser(userId); // Llamada a la función deleteUser con el id
        console.log(response);
        setUsers(users.filter((user) => user.id_usuario !== userId)); // Actualiza el estado con la lista de usuarios sin el eliminado
        alert("Usuario eliminado con éxito.");
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        alert("Hubo un error al eliminar el usuario.");
      }
    }
  }
  // Filtrar usuarios por el query de búsqueda
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.nombre} ${user.apellido}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  // Paginación
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Número total de páginas
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="p-4">
      <h3 className="text-center mb-4">Gestión de Usuarios</h3>

      <div className="d-flex justify-content-center mb-3">
        <button onClick={handleRegister} className="btn btn-primary">
          Agregar Usuario
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar usuario..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <div>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {currentUsers.length === 0 ? (
              <div className="text-center col-12">
                No hay usuarios registrados.
              </div>
            ) : (
              currentUsers.map((user) => (
                <div key={user.id_usuario} className="col">
                  <div className="card shadow-lg border-light rounded">
                    <div className="card-body">
                      <h5 className="card-title">
                        {user.nombre || "Nombre no disponible"}{" "}
                        {user.apellido || "apellido no disponible"}
                      </h5>
                      <p className="card-text">
                        <strong>Correo:</strong>{" "}
                        {user.correo_electronico || "Correo no disponible"}
                      </p>
                      <p className="card-text">
                        <strong>Estado:</strong>{" "}
                        {user.estado || "Estado no disponible"}
                      </p>

                      <p className="card-text">
                        <strong>Rol:</strong> {user.rol || "Rol no disponible"}
                      </p>
                      <div className="d-flex justify-content-end">
                        <button
                          onClick={() => editUser(user.id_usuario)}
                          className="btn btn-outline-warning btn-sm me-2"
                        >
                          <FaEdit /> Editar
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id_usuario)}
                          className="btn btn-outline-danger btn-sm"
                          disabled={user.rol === "administrador"} // Condición para deshabilitar
                        >
                          <FaTrash /> Eliminar
                        </button>
                      </div>
                    </div>
                    <div className="card-footer text-center">
                      <small className="text-muted">
                        Última actualización:{" "}
                        {user.fecha_actualizacion || "N/A"}
                      </small>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Paginación */}
          <div className="d-flex justify-content-center mt-4">
            <nav aria-label="Page navigation">
              <ul className="pagination">
                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </button>
                </li>
                {[...Array(totalPages)].map((_, index) => (
                  <li
                    key={index}
                    className={`page-item ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
