const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const Task = require("../models/Task");
const Meeting = require("../models/Meeting");

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get tasks for the current user
router.get("/myTasks", async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { id_usuario: req.user.id } });
    res.json(tasks);
  } catch (error) {
    console.error("Error al obtener las tareas del usuario", error);
    res.status(500).json({ error: "Error al obtener tareas del usuario" });
  }
});

// Get all meetings for the current user
router.get("/myMeetings", async (req, res) => {
  try {
    const meetings = await Meeting.findAll({ where: { id_usuario: req.user.id } });
    res.json(meetings);
  } catch (error) {
    console.error("Error al obtener las reuniones del usuario", error);
    res.status(500).json({ error: "Error al obtener reuniones del usuario" });
  }
});

module.exports = router;
