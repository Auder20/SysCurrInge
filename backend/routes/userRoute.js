const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getMyTasks, getMyMeetings } = require("../controllers/userController");

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

router.get("/myTasks", getMyTasks);
router.get("/myMeetings", getMyMeetings);

module.exports = router;
