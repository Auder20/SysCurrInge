const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Modelo de Tarea
function createModelTask() {
  return sequelize.define(
    "Tarea",
    {
      id_tarea: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      fecha_vencimiento: {
        type: DataTypes.DATE,
      },
      estado: {
        type: DataTypes.ENUM("pendiente", "en_progreso", "completada"),
        defaultValue: "pendiente",
      },
      id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "usuario", // Nombre de la tabla relacionada
          key: "id_usuario",
        },
        onDelete: "SET NULL",
      },
    },
    {
      tableName: "tarea",
      timestamps: false,
    }
  );
}

const Task = createModelTask();

// Funciones CRUD para Tareas

// Crear una nueva tarea
async function createNewTask(newTaskData) {
  try {
    const task = await Task.create(newTaskData);
    return task;
  } catch (error) {
    console.error("Error al crear la tarea:", error);
    throw error;
  }
}

// Obtener todas las tareas
async function getAllTasks() {
  try {
    const tasks = await Task.findAll(); // Obtiene todos los usuarios de la tabla
    return tasks; // Retorna el array de usuarios como un objeto
  } catch (error) {
    console.error("Error al obtener todos las tareas:", error);
    throw error;
  }
}

// Obtener una tarea por su ID
async function getTaskbyid(id) {
  try {
    const task = await Task.findByPk(id);
    return task;
  } catch (error) {
    console.error("Error al obtener la tarea por ID:", error);
    throw error;
  }
}

// Actualizar una tarea por su ID
async function updateTaskData(id, newTaskData) {
  try {
    const task = await Task.findByPk(id);
    if (!task) {
      return null;
    }
    await task.update(newTaskData);
    return task;
  } catch (error) {
    console.error("Error al actualizar los datos de la tarea:", error);
    throw error;
  }
}

// Eliminar una tarea por su ID
async function deleteTaskData(id) {
  try {
    const task = await Task.findByPk(id);
    if (!task) {
      return null;
    }
    await task.destroy();
    return { message: "Tarea eliminada con éxito." };
  } catch (error) {
    console.error("Error al eliminar la tarea:", error);
    throw error;
  }
}

// Obtener tareas por usuario
async function getTasksByUserId(userId) {
  try {
    const tasks = await Task.findAll({
      where: { id_usuario: userId },
    });
    return tasks;
  } catch (error) {
    console.error("Error al obtener tareas por ID de usuario:", error);
    throw error;
  }
}

module.exports = TaskModel;
