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
  deleteMeetingById,
  saveAgenda,
  getAgendaByMeeting,
  getMeetingById,
  updateMeeting,
} = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

// Aplicar middleware de autenticación y autorización a todas las rutas
router.use(authMiddleware);
router.use(roleMiddleware);

router.get("/loadUsers", getUsers);
router.get("/loadUserById", getUserById);
router.put("/updateUser", updateUser);
router.put("/updateTask", updateTask);
router.delete("/deleteUser/:id", deleteUser);
router.delete("/deleteTask/:id", deleteTask);
router.post("/addTask", addTask);
router.post("/addMeeting", addMeeting);
router.get("/loadTasks", loadTasks);
router.get("/loadTaskById", getTaskById);
router.get("/loadMeetingById", getMeetingById);
router.put("/updateMeeting", updateMeeting);
router.post("/saveAgenda/:id_reunion", saveAgenda);
router.get("/agenda/:id_reunion", getAgendaByMeeting);

module.exports = router;
