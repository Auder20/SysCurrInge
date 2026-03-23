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
} = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

// Aplicar middleware de autenticación y autorización a todas las rutas
router.use(authMiddleware);
router.use(roleMiddleware(['administrador']));

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

module.exports = router;
