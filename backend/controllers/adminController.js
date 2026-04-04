const User = require("../models/User");
const Task = require("../models/Task");
const Meeting = require("../models/Meeting");
const Agenda = require("../models/Agenda");
const logger = require("../config/logger");

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['contrasena'] }
    });
    res.json(users);
  } catch (error) {
    logger.error("Error al obtener los usuarios", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

const loadTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (error) {
    logger.error("Error al cargar tareas", error);
    res.status(500).json({ error: "Error al cargar tareas" });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['contrasena'] }
    });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    logger.error("Error al obtener el usuario", error);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};

const getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: "Tarea no encontrado" });
    }
    res.json(task);
  } catch (error) {
    logger.error("Error al obtener la tarea", error);
    res.status(500).json({ error: "Error al obtener la tarea" });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, correo_electronico, estado, rol } = req.body;

  const rolesPermitidos = ['administrador', 'coordinador', 'participante'];
  if (rol && !rolesPermitidos.includes(rol)) {
    return res.status(400).json({ error: "El rol especificado no es válido." });
  }

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    await user.update({
      nombre,
      apellido,
      correo_electronico,
      estado,
      rol,
    });

    res.json({ message: "Usuario actualizado correctamente", user });
  } catch (error) {
    logger.error("Error al actualizar el usuario:", error);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { descripcion, fecha_vencimiento, estado, id_usuario } = req.body;

  try {
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: "Tarea no encontrado" });
    }

    await task.update({
      descripcion,
      fecha_vencimiento,
      estado,
      id_usuario,
    });

    res.json({ message: "Tarea actualizada correctamente", task });
  } catch (error) {
    logger.error("Error al actualizar la Tarea:", error);
    res.status(500).json({ error: "Error al actualizar la Tarea" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: "No puedes eliminar tu propia cuenta." });
    }

    const userToDelete = await User.findByPk(id);
    if (!userToDelete) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    if (userToDelete.rol === 'administrador') {
      return res.status(403).json({ message: "No se puede eliminar una cuenta de administrador." });
    }

    await userToDelete.destroy();
    return res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    logger.error("Error al eliminar el usuario:", error);
    return res.status(500).json({ message: "Error interno al eliminar el usuario." });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada." });
    }

    await task.destroy();
    return res.json({ message: "Tarea eliminada correctamente" });
  } catch (error) {
    logger.error("Error al eliminar la Tarea:", error);
    return res
      .status(500)
      .json({ message: "Error interno al eliminar la tarea." });
  }
};

const addTask = async (req, res) => {
  const tarea = req.body;
  const { rolSeleccionado, id_usuario } = tarea;

  if (!rolSeleccionado || !id_usuario) {
    return res
      .status(400)
      .json({ message: "Faltan datos de rol o id_usuario." });
  }

  try {
    const usuario = await User.findOne({ 
      where: { id_usuario, rol: rolSeleccionado } 
    });
    
    if (!usuario) {
      return res
        .status(404)
        .json({ message: "Usuario no encontrado o no tiene el rol adecuado." });
    }

    const result = await Task.create({
      descripcion: tarea.descripcion,
      fecha_vencimiento: tarea.fecha_vencimiento,
      estado: tarea.estado || 'pendiente',
      id_usuario: tarea.id_usuario,
    });

    return res
      .status(201)
      .json({ message: "Tarea creada exitosamente", task: result });
  } catch (error) {
    logger.error("Error al agregar la tarea:", error);
    return res
      .status(500)
      .json({ message: "Error interno al agregar la tarea." });
  }
};

const addMeeting = async (req, res) => {
  const meeting = req.body;
  const { nombre_reunion, fecha, id_usuario } = meeting;

  if (!nombre_reunion || !fecha || !id_usuario) {
    return res.status(400).json({
      message: "Faltan datos esenciales (nombre_reunión, fecha o id_usuario).",
    });
  }

  try {
    const usuario = await User.findByPk(id_usuario);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const result = await Meeting.create(meeting);
    
    return res
      .status(201)
      .json({ message: "Reunión creada exitosamente", meeting: result });
  } catch (error) {
    logger.error("Error al agregar la reunión:", error);
    return res
      .status(500)
      .json({ message: "Error interno al agregar la reunión." });
  }
};

const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.findAll();
    res.json(meetings);
  } catch (error) {
    logger.error("Error al obtener reuniones", error);
    res.status(500).json({ error: "Error al obtener reuniones" });
  }
};

const deleteMeeting = async (req, res) => {
  const { id } = req.params;

  try {
    const meeting = await Meeting.findByPk(id);
    if (!meeting) {
      return res.status(404).json({ message: "Reunión no encontrada." });
    }

    await meeting.destroy();
    return res.json({ message: "Reunión eliminada correctamente" });
  } catch (error) {
    logger.error("Error al eliminar la reunión:", error);
    return res
      .status(500)
      .json({ message: "Error interno al eliminar la reunión." });
  }
};

const getMeetingById = async (req, res) => {
  const { id } = req.params;
  try {
    const meeting = await Meeting.findByPk(id);
    if (!meeting) {
      return res.status(404).json({ error: "Reunión no encontrada" });
    }
    res.json(meeting);
  } catch (error) {
    logger.error("Error al obtener la reunión", error);
    res.status(500).json({ error: "Error al obtener la reunión" });
  }
};

const updateMeeting = async (req, res) => {
  const { id } = req.params;
  const { nombre_reunion, fecha, ubicacion, id_usuario } = req.body;

  try {
    const meeting = await Meeting.findByPk(id);
    if (!meeting) {
      return res.status(404).json({ error: "Reunión no encontrada" });
    }

    await meeting.update({
      nombre_reunion,
      fecha,
      ubicacion,
      id_usuario,
    });

    res.json({ message: "Reunión actualizada correctamente", meeting });
  } catch (error) {
    logger.error("Error al actualizar la reunión:", error);
    res.status(500).json({ error: "Error al actualizar la reunión" });
  }
};

const saveAgenda = async (req, res) => {
  const { id_reunion } = req.params;
  const { agendaItems } = req.body;

  try {
    const meeting = await Meeting.findByPk(id_reunion);
    if (!meeting) {
      return res.status(404).json({ error: "Reunión no encontrada" });
    }

    // Eliminar agenda existente para esta reunión
    await Agenda.destroy({ where: { id_reunion } });

    // Guardar nuevos items de agenda
    const savedItems = await Agenda.bulkCreate(
      agendaItems.map(item => ({
        ...item,
        id_reunion
      }))
    );

    res.json({ 
      message: "Agenda guardada correctamente", 
      agendaItems: savedItems 
    });
  } catch (error) {
    logger.error("Error al guardar la agenda:", error);
    res.status(500).json({ error: "Error al guardar la agenda" });
  }
};

const getAgendaByMeeting = async (req, res) => {
  const { id_reunion } = req.params;

  try {
    const meeting = await Meeting.findByPk(id_reunion);
    if (!meeting) {
      return res.status(404).json({ error: "Reunión no encontrada" });
    }

    // Obtener items de agenda de la base de datos
    const agendaItems = await Agenda.findAll({
      where: { id_reunion },
      order: [['id_agenda', 'ASC']]
    });

    res.json({ meeting, agendaItems });
  } catch (error) {
    logger.error("Error al obtener la agenda:", error);
    res.status(500).json({ error: "Error al obtener la agenda" });
  }
};

module.exports = {
  getUsers,
  loadTasks,
  getUserById,
  getTaskById,
  updateUser,
  updateTask,
  deleteUser,
  deleteTask,
  addTask,
  addMeeting,
  getMeetings,
  deleteMeeting,
  getMeetingById,
  updateMeeting,
  saveAgenda,
  getAgendaByMeeting,
};
