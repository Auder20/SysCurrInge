// login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import "../styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  function handleCancel() {
    navigate("/");
  }

  function handleRegister() {
    navigate("/register");
  }

  // Función para determinar la ruta según el rol y tipo de usuario
  function getRouteByRole(role, type_user) {
    if (role === "administrador") {
      return "/adminDashBoard";
    }
    
    if (role === "coordinador" && type_user === "moderador") {
      return "/coordinatorDashBoard";
    }
    
    if (role === "coordinador" && type_user === "asistente") {
      return "/dashBoard2";
    }
    
    if (role === "participante" && type_user === "miembro") {
      return "/memberDashBoard";
    }
    
    if (role === "participante" && type_user === "invitado") {
      return "/guestDashBoard";
    }
    
    return null; // No hay ruta definida para esta combinación
  }

  async function loginButton(e) {
    e.preventDefault();
    try {
      const response = await login(email, password);
      if (response && response.token) {
        const token = response.token;
        localStorage.setItem("token", token);
        const decoded = jwtDecode(token);
        
        const route = getRouteByRole(decoded.role, decoded.type_user);
        
        if (route) {
          navigate(route);
        } else {
          // Mostrar error claro al usuario en lugar de solo console.error
          alert(`No se encontró una página para tu rol (${decoded.role}) y tipo de usuario (${decoded.type_user}). Por favor, contacta al administrador.`);
          console.error("Rol o tipo de usuario no reconocido:", {
            role: decoded.role,
            type_user: decoded.type_user
          });
        }
      }
    } catch (error) {
      console.log("error al iniciar sesion", error);
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div className="d-none d-md-flex" style={{ flex: 1, background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px', color: '#fff' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚡</div>
        <h1 style={{ fontSize: '36px', fontWeight: 700, margin: '0 0 12px' }}>SysCurringe</h1>
        <p style={{ fontSize: '16px', opacity: 0.75, textAlign: 'center', maxWidth: '280px', lineHeight: 1.7, margin: 0 }}>
          Gestión de reuniones, tareas y participantes en un solo lugar.
        </p>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: '#fff' }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>Bienvenido de nuevo</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 32px' }}>Ingresa tus credenciales para continuar</p>
          <form onSubmit={loginButton}>
            <div className="form-group-custom">
              <label className="form-label-custom">Correo electrónico</label>
              <input type="email" className="form-control-custom" placeholder="correo@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group-custom">
              <label className="form-label-custom">Contraseña</label>
              <input type="password" className="form-control-custom" placeholder="•••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <div className="alert-error">{error}</div>}
            <button type="submit" className="btn-primary-custom" style={{ width: '100%', padding: '12px', marginBottom: '10px' }} disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
            <button type="button" className="btn-secondary-custom" style={{ width: '100%', padding: '12px' }} onClick={handleRegister}>
              Crear cuenta nueva
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
