const {
  createNewTask,
  getAllTasks,
  deleteTaskData,
  getTaskbyid,
  updateTaskData,
} = require("../models/Task");
const {
  getAllUsers,
  getUserbyid,
  updateUserData,
  deleteUserData,
  findUserByIdAndRole,
  findUserById,
} = require("../models/User");
const { createNewMeeting, getAllMeetings, deleteMeeting, getMeetingById, updateMeeting: updateMeetingData } = require("../models/Meeting");
const { saveAgendaItems, getAgendaByMeetingId } = require("../models/Agenda");

const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.log("Error al obtener los usuarios", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

const loadTasks = async (req, res) => {
  try {
    const tasks = await getAllTasks(); // Obtiene las tareas
    res.json(tasks); // Devuelve las tareas en formato JSON
  } catch (error) {
    console.log("Error al obtener las tareas", error);
    res.status(500).json({ error: "Error al obtener tareas" });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.query;
  try {
    const user = await getUserbyid(id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error al obtener el usuario", error);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};

const getTaskById = async (req, res) => {
  const { id } = req.query;
  try {
    const task = await getTaskbyid(id);
    if (!task) {
      return res.status(404).json({ error: "Tarea no encontrado" });
    }
    res.json(task);
  } catch (error) {
    console.error("Error al obtener la tarea", error);
    res.status(500).json({ error: "Error al obtener la tarea" });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.query;
  const { nombre, apellido, correo_electronico, estado, rol } = req.body;

  try {
    const updatedUser = await updateUserData(id, {
      nombre,
      apellido,
      correo_electronico,
      estado,
      rol,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario actualizado correctamente", updatedUser });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.query;
  const { descripcion, fecha_vencimiento, estado, id_usuario } = req.body;

  try {
    const updatedTask = await updateTaskData(id, {
      descripcion,
      fecha_vencimiento,
      estado,
      id_usuario,
    });

    if (!updatedTask) {
      return res.status(404).json({ error: "Tarea no encontrado" });
    }
    res.json({ message: "Tarea actualizada correctamente", updatedTask });
  } catch (error) {
    console.error("Error al actualizar la Tarea:", error);
    res.status(500).json({ error: "Error al actualizar la Tarea" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await deleteUserData(id);
    if (result === null) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
    return res.json(result);
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    return res
      .status(500)
      .json({ message: "Error interno al eliminar el usuario." });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await deleteTaskData(id);
    if (result === null) {
      return res.status(404).json({ message: "Tarea no encontrada." });
    }
    return res.json(result);
  } catch (error) {
    console.error("Error al eliminar la Tarea:", error);
    return res
      .status(500)
      .json({ message: "Error interno al eliminar la tarea." });
  }
};

const addTask = async (req, res) => {
  // Recibe el objeto tarea directamente desde el cuerpo de la solicitud
  const tarea = req.body;
  const { rolSeleccionado, id_usuario } = tarea; // Extraemos rol y id_usuario del objeto tarea

  // Verificamos si los datos de rol y id_usuario están presentes
  if (!rolSeleccionado || !id_usuario) {
    return res
      .status(400)
      .json({ message: "Faltan datos de rol o id_usuario." });
  }

  try {
    // Buscar el usuario por id y rol
    const usuario = await findUserByIdAndRole(id_usuario, rolSeleccionado); // Usa rolSeleccionado aquí
    if (!usuario) {
      return res
        .status(404)
        .json({ message: "Usuario no encontrado o no tiene el rol adecuado." });
    }

    // Crear la nueva tarea
    const result = await createNewTask({
      descripcion: tarea.descripcion,
      fecha_vencimiento: tarea.fecha_vencimiento,
      estado: tarea.estado || 'pendiente',
      id_usuario: tarea.id_usuario,
    });
    if (!result) {
      return res.status(500).json({ message: "Error al crear la tarea." });
    }

    // Retornamos la tarea creada
    return res
      .status(201)
      .json({ message: "Tarea creada exitosamente", task: result });
  } catch (error) {
    console.error("Error al agregar la tarea:", error);
    return res
      .status(500)
      .json({ message: "Error interno al agregar la tarea." });
  }
};

const addMeeting = async (req, res) => {
  // Recibe el objeto de la reunión directamente desde el cuerpo de la solicitud
  const meeting = req.body;
  const { nombre_reunion, fecha, id_usuario } = meeting; // Extraemos los campos necesarios del objeto reunión

  // Verificamos si los datos esenciales están presentes
  if (!nombre_reunion || !fecha || !id_usuario) {
    return res.status(400).json({
      message: "Faltan datos esenciales (nombre_reunión, fecha o id_usuario).",
    });
  }

  try {
    // Buscar el usuario por id_usuario (se asume que id_usuario se refiere al organizador)
    const usuario = await findUserById(id_usuario); // Suponiendo que 'findUserById' es una función que encuentra el usuario por su ID
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Crear la nueva reunión
    const result = await createNewMeeting(meeting); // Usamos la función 'createNewMeeting' para guardar la reunión en la base de datos
    if (!result) {
      return res.status(500).json({ message: "Error al crear la reunión." });
    }

    // Retornamos la reunión creada
    return res
      .status(201)
      .json({ message: "Reunión creada exitosamente", meeting: result });
  } catch (error) {
    console.error("Error al agregar la reunión:", error);
    return res
      .status(500)
      .json({ message: "Error interno al agregar la reunión." });
  }
};

const getMeetings = async (req, res) => {
  try {
    const meetings = await getAllMeetings();
    res.json(meetings);
  } catch (error) {
    console.log("Error al obtener las reuniones", error);
    res.status(500).json({ error: "Error al obtener reuniones" });
  }
};

const deleteMeetingById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await deleteMeeting(id);
    if (result === null) {
      return res.status(404).json({ message: "Reunión no encontrada." });
    }
    return res.json(result);
  } catch (error) {
    console.error("Error al eliminar la reunión:", error);
    return res
      .status(500)
      .json({ message: "Error interno al eliminar la reunión." });
  }
};

const saveAgenda = async (req, res) => {
  const { agendaItems } = req.body;
  const { id_reunion } = req.params;

  try {
    // Agregar id_reunion a cada item de agenda
    const agendaWithMeetingId = agendaItems.map(item => ({
      ...item,
      id_reunion: parseInt(id_reunion)
    }));

    const savedAgenda = await saveAgendaItems(agendaWithMeetingId);
    res.status(201).json({
      message: "Agenda guardada exitosamente",
      agenda: savedAgenda
    });
  } catch (error) {
    console.error("Error al guardar agenda:", error);
    res.status(500).json({
      error: "Error interno al guardar la agenda."
    });
  }
};

const getAgendaByMeeting = async (req, res) => {
  const { id_reunion } = req.params;

  try {
    const agendaItems = await getAgendaByMeetingId(parseInt(id_reunion));
    res.json(agendaItems);
  } catch (error) {
    console.log("Error al obtener la agenda", error);
    res.status(500).json({ error: "Error al obtener agenda" });
  }
};

const getMeetingByIdController = async (req, res) => {
  const { id } = req.query;

  try {
    const meeting = await getMeetingById(id);
    if (!meeting) {
      return res.status(404).json({ error: "Reunión no encontrada." });
    }
    
    res.json(meeting);
  } catch (error) {
    console.error("Error al obtener la reunión:", error);
    res.status(500).json({ error: "Error al obtener reunión" });
  }
};

const updateMeeting = async (req, res) => {
  const { id } = req.query;
  const meetingData = req.body;

  try {
    const updatedMeeting = await updateMeetingData(id, meetingData);
    if (!updatedMeeting) {
      return res.status(404).json({ error: "Reunión no encontrada." });
    }
    
    res.json({
      message: "Reunión actualizada correctamente",
      meeting: updatedMeeting
    });
  } catch (error) {
    console.error("Error al actualizar la reunión:", error);
    res.status(500).json({ error: "Error al actualizar reunión" });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  addTask,
  loadTasks,
  deleteTask,
  getTaskById,
  updateTask,
  addMeeting,
  getMeetings,
  deleteMeetingById,
  saveAgenda,
  getAgendaByMeeting,
  getMeetingById: getMeetingByIdController,
  updateMeeting,
};
