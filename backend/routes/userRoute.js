const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { getTasksByUserId } = require("../models/Task");
const { getAllMeetings } = require("../models/Meeting");

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get tasks for the current user
router.get("/myTasks", async (req, res) => {
  try {
    const tasks = await getTasksByUserId(req.user.id);
    res.json(tasks);
    console.log("Tareas del usuario obtenidas correctamente");
  } catch (error) {
    console.log("Error al obtener las tareas del usuario", error);
    res.status(500).json({ error: "Error al obtener tareas del usuario" });
  }
});

// Get all meetings for the current user
router.get("/myMeetings", async (req, res) => {
  try {
    const meetings = await getAllMeetings();
    res.json(meetings);
    console.log("Reuniones obtenidas correctamente");
  } catch (error) {
    console.log("Error al obtener las reuniones", error);
    res.status(500).json({ error: "Error al obtener reuniones" });
  }
});

module.exports = router;
