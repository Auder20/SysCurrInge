const { findByEmail } = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Email y contraseña son obligatorios" });
  }

  try {
    const user = await findByEmail(email);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.contrasena);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user.id_usuario, role: user.rol, type_user: user.tipo_usuario },
      process.env.JWT_SECRET,
      { expiresIn: 86400 }
    );

    res.status(200).json({
      auth: true,
      token,
      rol: user.rol,
      message: "Inicio de sesión exitoso",
      user,
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

module.exports = login;
