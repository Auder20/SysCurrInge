module.exports = (req, res, next) => {
  // Verificar que el usuario existe y tiene rol de administrador
  if (!req.user || req.user.role !== 'administrador') {
    return res.status(403).json({ 
      error: "Acceso denegado: Se requiere rol de administrador" 
    });
  }
  
  next();
};
