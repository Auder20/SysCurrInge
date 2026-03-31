import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import useAdmin from "../hooks/useAdmin";
import { formatDate } from "../utils/dateUtils";

function TaskManagement() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
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

  function handleRegister() {
    navigate("/addTaskForm");
  }

  const editTask = (taskId) => {
    navigate("/editTask/" + taskId);
    console.log(`Editar tarea ${taskId}`);
  };

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

  const filteredTasks = tasks.filter((task) => {
    return task.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  const getStatusBadge = (status) => {
    const statusClass = status === 'pendiente' ? 'badge-status-pendiente' : 
                       status === 'en_progreso' ? 'badge-status-en-progreso' : 
                       'badge-status-completada';
    return <span className={statusClass}>{status}</span>;
  };

  return (
  <div>
    <div className="toolbar">
      <div className="search-wrap">
        <input className="search-bar-custom" type="text" placeholder="Buscar tarea..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>
      <button className="btn-primary-custom" onClick={handleRegister}>+ Agregar Tarea</button>
    </div>

    {loading ? (
      <div className="loading-wrap">
        <div className="spinner-border text-primary" role="status" />
        <span>Cargando tareas...</span>
      </div>
    ) : (
      <>
        <div style={{ overflowX: 'auto' }}>
          <table className="table-custom">
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Vencimiento</th>
                <th>Estado</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentTasks.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No hay tareas registradas.</td></tr>
              ) : currentTasks.map((task) => (
                <tr key={task.id_tarea}>
                  <td style={{ maxWidth: '300px' }}>{task.descripcion}</td>
                  <td style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    {task.fecha_vencimiento ? new Date(task.fecha_vencimiento).toLocaleDateString('es-CO') : '—'}
                  </td>
                  <td><span className={`badge-${task.estado}`}>{task.estado?.replace('_', ' ')}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn-icon" title="Editar" onClick={() => editTask(task.id_tarea)}>✏️</button>
                    <button className="btn-icon" title="Eliminar" onClick={() => handleDeleteTask(task.id_tarea)}>🗑️</button>
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

export default TaskManagement;
