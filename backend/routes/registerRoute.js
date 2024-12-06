//registerRoute.js
const express = require("express");
const {
  register,
  validateAdminRole,
  generateCode,
  verifyCode,
} = require("../controllers/registerController");

const router = express.Router();

// Ruta de registro
router.post("/register", register);
router.get("/admin-exists", validateAdminRole);
router.post("/send-verification-code", generateCode);
router.post("/verify-code", verifyCode);

module.exports = router;
