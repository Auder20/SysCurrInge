const express = require("express");
const { login, getMe } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Ruta para iniciar sesión
router.post("/login", login);

// Ruta para obtener información del usuario actual
router.get("/me", authMiddleware, getMe);

module.exports = router;
