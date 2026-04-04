const express = require("express");
const {
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
  deleteMeeting,
  getMeetingById,
  updateMeeting,
  saveAgenda,
  getAgendaByMeeting,
} = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Aplicar middleware de autenticación y autorización a todas las rutas
router.use(authMiddleware);
router.use(roleMiddleware(['administrador']));

// RESTful endpoints for users
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// RESTful endpoints for tasks
router.get("/tasks", loadTasks);
router.get("/tasks/:id", getTaskById);
router.post("/tasks", addTask);
router.put("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);

// RESTful endpoints for meetings
router.get("/meetings", getMeetings);
router.get("/meetings/:id", getMeetingById);
router.post("/meetings", addMeeting);
router.put("/meetings/:id", updateMeeting);
router.delete("/meetings/:id", deleteMeeting);

// RESTful endpoints for agenda
router.get("/meetings/:id_reunion/agenda", getAgendaByMeeting);
router.post("/meetings/:id_reunion/agenda", saveAgenda);

module.exports = router;
