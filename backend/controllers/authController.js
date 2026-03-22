const { findByEmail, findUserById } = require("../models/User");
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
      { expiresIn: '24h' }
    );

    // Crear objeto de usuario seguro sin campos sensibles
    const { contrasena, ...safeUser } = user.toJSON();

    res.status(200).json({
      auth: true,
      token,
      rol: user.rol,
      message: "Inicio de sesión exitoso",
      user: safeUser,
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function getMe(req, res) {
  try {
    // Buscar el usuario por ID desde el token decodificado
    const user = await findUserById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Crear objeto de usuario seguro sin campos sensibles
    const { contrasena, ...safeUser } = user.toJSON();

    res.status(200).json({
      user: safeUser,
      message: "Información de usuario obtenida correctamente"
    });
  } catch (error) {
    console.error("Error al obtener información del usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

module.exports = { login, getMe };
