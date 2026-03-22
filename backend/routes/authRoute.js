const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Ruta para iniciar sesión
router.post("/login", authController);

// Ruta para obtener información del usuario actual
router.get("/me", authMiddleware, authController.getMe);

module.exports = router;
