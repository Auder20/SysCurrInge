// src/components/MemberDashboard/TaskList.js
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        // Obtener el token del localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No se encontró token de autenticación");
          setLoading(false);
          return;
        }

        // Decodificar el token para obtener el ID del usuario
        const decoded = jwtDecode(token);
        
        // Llamar a la API para obtener las tareas del usuario
        const response = await api.get("/user/myTasks");
        setTasks(response.data || []);
      } catch (error) {
        console.error("Error al cargar las tareas:", error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  if (loading) {
    return (
      <div className="container p-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando tareas...</p>
      </div>
    );
  }

  return (
    <div className="container p-4">
      <h2 className="text-center mb-4">Lista de Tareas</h2>
      {tasks.length === 0 ? (
        <div className="alert alert-info text-center">
          No tienes tareas asignadas.
        </div>
      ) : (
        <ul className="list-group">
          {tasks.map((task) => (
            <li key={task.id_tarea} className="list-group-item mb-3">
              <h3 className="text-primary">{task.descripcion}</h3>
              <p>
                <strong>Estado:</strong> {task.estado}
              </p>
              <p>
                <strong>Fecha de Vencimiento:</strong> {task.fecha_vencimiento}
              </p>
              {/* Aquí puedes agregar botones para actualizar/eliminar tareas si es necesario */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskList;
