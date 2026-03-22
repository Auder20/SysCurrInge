//registerController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  generateVerificationCode,
  sendVerificationEmail,
} = require("../services/emailService");

const {
  findByEmail,
  createNewUser,
  existsAdminUser,
} = require("../models/User");
const VerificationCode = require("../models/VerificationCode");

const validateAdminRole = async (req, res) => {
  try {
    const adminExists = await existsAdminUser();

    // Devuelve true si existe un administrador, y false si no existe
    return res.status(200).json(adminExists); // `adminExists` será `true` o `false`
  } catch (error) {
    console.error("Error al verificar administrador:", error);
    return res
      .status(500)
      .json({ error: "Error al verificar administrador. Inténtalo de nuevo." });
  }
};

const generateCode = async (req, res) => {
  const { email } = req.body; // Recibimos el correo del cuerpo de la solicitud.
  try {
    const { code, expirationTime } = generateVerificationCode();
    console.log("el codigo generado es", code);

    await sendVerificationEmail(email, code);

    // Guardar o actualizar el código en la base de datos usando upsert
    await VerificationCode.upsert({
      email,
      code,
      expirationTime,
    });

    res
      .status(200)
      .json({ message: "Código de verificación enviado al correo." });
  } catch (error) {
    console.error("Error al enviar el código de verificación:", error);
    res.status(500).json({
      error: "No se pudo enviar el código de verificación. Intenta de nuevo.",
    });
  }
};

// Función para verificar un código de verificación
const verifyCode = async (req, res) => {
  const { email, code } = req.body; // Recibimos el correo y el código del cuerpo de la solicitud.

  try {
    // Buscar el código de verificación en la base de datos
    const verificationData = await VerificationCode.findOne({
      where: { email },
    });

    if (!verificationData) {
      return res.status(400).json({
        error: "No se encontró un código de verificación para este correo.",
      });
    }

    const { code: storedCode, expirationTime } = verificationData;

    // Verificamos si el código ha expirado
    if (Date.now() > expirationTime) {
      // Si el código ha expirado, eliminamos el registro de la base de datos
      await VerificationCode.destroy({
        where: { email },
      });
      return res.status(400).json({
        error: "El código ha expirado. Solicita uno nuevo.",
      });
    }

    // Verificamos si el código ingresado es correcto
    if (storedCode !== code) {
      return res.status(400).json({
        error: "Código de verificación incorrecto.",
      });
    }

    // Si todo está bien, eliminamos el registro y respondemos con un mensaje de éxito
    await VerificationCode.destroy({
      where: { email },
    });

    return res.status(200).json({
      message: "Código de verificación correcto.",
    });
  } catch (error) {
    console.error("Error al verificar el código:", error);
    return res.status(500).json({
      error: "Hubo un error al verificar el código. Intenta de nuevo.",
    });
  }
};

const register = async (req, res) => {
  const { name, lastname, email, password, role, userType } = req.body;

  if (!name || !lastname || !email || !password || !role) {
    return res
      .status(400)
      .json({ error: "Todos los campos son obligatorios." });
  }

  const existingUser = await findByEmail(email);

  if (existingUser) {
    return res.status(400).json({ error: "Este correo ya está registrado." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await createNewUser({
      nombre: name,
      apellido: lastname,
      correo_electronico: email,
      contrasena: hashedPassword,
      rol: role,
      tipo_usuario: userType || null,
    });
    return res.status(201).json({
      message: "Registro exitoso. Redirigiendo...",
    });
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    return res.status(500).json({
      error: "Hubo un error al registrar al usuario. Inténtalo de nuevo.",
    });
  }
};

module.exports = { register, validateAdminRole, generateCode, verifyCode };
