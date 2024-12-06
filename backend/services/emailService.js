const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Función para generar un código de verificación aleatorio
const generateVerificationCode = () => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expirationTime = Date.now() + 15 * 60 * 1000; // El código expira en 15 minutos
  return { code, expirationTime };
};

// Función para enviar el correo con el código de verificación
const sendVerificationEmail = async (email, code) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Código de verificación",
      text: `Tu código de verificación es: ${code}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Correo enviado");
    console.log("se mando", code);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw new Error("Error al enviar el correo de verificación.");
  }
};

module.exports = {
  sendVerificationEmail,
  generateVerificationCode,
};
