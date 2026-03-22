import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, InputGroup, FormControl } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import useAdmin from "../hooks/useAdmin";

function TaskManagement() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]); // Estado para las tareas
  const [loading, setLoading] = useState(true); // Estado de carga
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [tasksPerPage] = useState(6); // Número de tareas por página
  const [searchQuery, setSearchQuery] = useState(""); // Query de búsqueda
  const { loadAllTasks, deleteTask } = useAdmin();

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasksData = await loadAllTasks();
        console.log("Tareas obtenidas:", tasksData);
        setTasks(tasksData || []);
      } catch (error) {
        console.error("Error al cargar las tareas:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [loadAllTasks]);

  // Función para registrar una nueva tarea
  function handleRegister() {
    navigate("/addTaskForm");
  }

  // Función para editar tarea
  const editTask = (taskId) => {
    navigate("/editTask/" + taskId);
    console.log(`Editar tarea ${taskId}`);
  };

  // Función para eliminar tarea
  async function handleDeleteTask(taskId) {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
      try {
        const response = await deleteTask(taskId);
        setTasks(tasks.filter((task) => task.id_tarea !== taskId));
        console.log(response);
        alert("Tarea eliminada con éxito.");
      } catch (error) {
        console.error("Error al eliminar la tarea:", error);
        alert("Hubo un error al eliminar la tarea.");
      }
    }
  }

  // Filtrar tareas por el query de búsqueda
  const filteredTasks = tasks.filter((task) => {
    return task.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Paginación
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Número total de páginas
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  return (
    <div className="p-4">
      <h3 className="text-center mb-4">Gestión de Tareas</h3>

      {/* Barra de búsqueda */}
      <div className="mb-4">
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Buscar tarea..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
      </div>

      {/* Botón para agregar tarea */}
      <div className="d-flex justify-content-center mb-3">
        <Button onClick={handleRegister} className="btn btn-primary">
          Agregar Tarea
        </Button>
      </div>

      {/* Mostrar tareas */}
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <div>
          <div className="row row-cols-1 g-4">
            {currentTasks.length === 0 ? (
              <div className="text-center col-12">
                No hay tareas registradas.
              </div>
            ) : (
              currentTasks.map((task) => (
                <div key={task.id_tarea} className="col">
                  <Card className="shadow-lg border-light rounded">
                    <Card.Body>
                      <Card.Title>{task.descripcion}</Card.Title>
                      <Card.Text>
                        <strong>Fecha de Vencimiento:</strong>{" "}
                        {task.fecha_vencimiento}
                      </Card.Text>
                      <Card.Text>
                        <strong>Estado:</strong> {task.estado}
                      </Card.Text>
                      <div className="d-flex justify-content-end">
                        <Button
                          onClick={() => editTask(task.id_tarea)}
                          variant="outline-warning"
                          size="sm"
                          className="me-2"
                        >
                          <FaEdit /> Editar
                        </Button>
                        <Button
                          onClick={() => handleDeleteTask(task.id_tarea)}
                          variant="outline-danger"
                          size="sm"
                        >
                          <FaTrash /> Eliminar
                        </Button>
                      </div>
                    </Card.Body>
                    <Card.Footer className="text-center">
                      <small className="text-muted">
                        Última actualización:{" "}
                        {task.fecha_actualizacion || "N/A"}
                      </small>
                    </Card.Footer>
                  </Card>
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

export default TaskManagement;
