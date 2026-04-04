const Task = require("../models/Task");
const Meeting = require("../models/Meeting");
const logger = require("../config/logger");

const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { id_usuario: req.user.id } });
    res.json(tasks);
  } catch (error) {
    logger.error("Error al obtener las tareas del usuario", error);
    res.status(500).json({ error: "Error al obtener tareas del usuario" });
  }
};

const getMyMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.findAll({ where: { id_usuario: req.user.id } });
    res.json(meetings);
  } catch (error) {
    logger.error("Error al obtener las reuniones del usuario", error);
    res.status(500).json({ error: "Error al obtener reuniones del usuario" });
  }
};

module.exports = {
  getMyTasks,
  getMyMeetings,
};
