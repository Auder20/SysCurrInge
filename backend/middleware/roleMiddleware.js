module.exports = (allowedRoles = ['administrador']) => (req, res, next) => {
  // Verificar que el usuario existe y tiene rol permitido
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ 
      error: `Acceso denegado: Se requiere uno de estos roles: ${allowedRoles.join(', ')}` 
    });
  }
  
  next();
};
