const jwt = require("jsonwebtoken");
const logger = require("../config/logger");

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ error: "Acceso denegado: No se proporcionó token" });
  }

  // Divide el encabezado para obtener el token
  const token = authHeader.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ error: "Acceso denegado: Token no encontrado" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Almacena la información del usuario en la solicitud
    next(); // Pasa al siguiente middleware o controlador
  } catch (error) {
    logger.error("Token inválido:", error);
    return res.status(401).json({ error: "Token inválido o expirado" }); // Código 401 para no autorizado
  }
};
