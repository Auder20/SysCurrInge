import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, allowedRoles }) => {
  // Verificar si hay un token en localStorage
  const token = localStorage.getItem('token');
  
  // Si no hay token, redirigir a login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    // Decodificar el token
    const decoded = jwtDecode(token);
    
    // Verificar si el token ha expirado
    const currentTime = Date.now();
    const tokenExpiration = decoded.exp * 1000;
    
    if (currentTime >= tokenExpiration) {
      // Token expirado, limpiar y redirigir a login
      localStorage.removeItem('token');
      return <Navigate to="/login" replace />;
    }

    // Verificar si el usuario tiene el rol permitido
    const userRole = decoded.role;
    
    if (!userRole) {
      // No hay rol en el token, redirigir a login
      localStorage.removeItem('token');
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      // Usuario autenticado pero sin el rol correcto
      // Redirigir a su dashboard correspondiente
      const roleToRoute = {
        'administrador': '/admin',  // Corregido
        'coordinador': '/coordinator',  // Corregido
        'participante': '/member', // Default para participantes
        'invitado': '/guest'  // Corregido
      };

      // Si es participante, verificar el tipo_usuario para mayor precisión
      if (userRole === 'participante' && decoded.type_user) {
        if (decoded.type_user === 'invitado') {
          return <Navigate to="/guest" replace />;  // Corregido
        } else if (decoded.type_user === 'miembro') {
          return <Navigate to="/member" replace />;  // Corregido
        }
      }

      const redirectRoute = roleToRoute[userRole] || '/login';
      return <Navigate to={redirectRoute} replace />;
    }

    // Usuario autenticado y con rol correcto, renderizar el componente
    return children;
    
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    // Token inválido, limpiar y redirigir a login
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
