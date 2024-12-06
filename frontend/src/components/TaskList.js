// src/components/MemberDashboard/TaskList.js
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Simulación de la carga de tareas desde una API o base de datos
    setTasks([
      {
        id: 1,
        title: "Revisión de Proyecto",
        status: "Pendiente",
        dueDate: "2024-11-10",
      },
      {
        id: 2,
        title: "Informe de Actividades",
        status: "En progreso",
        dueDate: "2024-11-15",
      },
    ]);
  }, []);

  return (
    <div className="container p-4">
      <h2 className="text-center mb-4">Lista de Tareas</h2>
      <ul className="list-group">
        {tasks.map((task) => (
          <li key={task.id} className="list-group-item mb-3">
            <h3 className="text-primary">{task.title}</h3>
            <p>
              <strong>Estado:</strong> {task.status}
            </p>
            <p>
              <strong>Fecha de Vencimiento:</strong> {task.dueDate}
            </p>
            {/* Aquí puedes agregar botones para actualizar/eliminar tareas si es necesario */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
