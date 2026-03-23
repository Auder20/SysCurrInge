const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  loadTasks,
  addTask,
  deleteTask,
  getTaskById,
  updateTask,
} = require("../controllers/adminController");
const {
  getMeetings,
  addMeeting,
} = require("../controllers/adminController");
const {
  getUsers,
} = require("../controllers/adminController");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

// Apply auth and role middleware to all routes
router.use(authMiddleware);
router.use(roleMiddleware(['coordinador', 'administrador']));

// Task routes for coordinators
router.get("/loadTasks", loadTasks);
router.post("/addTask", addTask);
router.delete("/deleteTask/:id", deleteTask);
router.get("/loadTaskById", getTaskById);
router.put("/updateTask", updateTask);

// Meeting routes for coordinators
router.get("/loadMeetings", getMeetings);
router.post("/addMeeting", addMeeting);

// User routes for coordinators
router.get("/loadUsers", getUsers);

module.exports = router;
