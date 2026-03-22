import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useRegister from "../hooks/useRegister";
import VerificationCode from "./VerificationCode";

function Register() {
  const [name, setNombre] = useState("");
  const [lastname, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [userType, setUserType] = useState(""); // Estado para el tipo de usuario
  const [disableAdminOption, setDisableAdminOption] = useState(false);
  const [message, setMessage] = useState(""); // Agregar estado para mensajes
  const { generateCode, register, validateAdminRole, loading, error } =
    useRegister();
  const [showVerification, setShowVerification] = useState(false); // Estado para mostrar la verificación de código
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAdminRole = async () => {
      try {
        const adminExists = await validateAdminRole();
        setDisableAdminOption(adminExists);
      } catch (error) {
        console.error("Error al verificar el administrador", error);
      }
    };

    verifyAdminRole();
  }, [validateAdminRole]);

  // Maneja el envío del código de verificación
  async function handleSendVerificationCode(e) {
    e.preventDefault();
    
    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }
    
    // Validar que la contraseña tenga al menos 8 caracteres
    if (password.length < 8) {
      setMessage("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    
    try {
      const response = await generateCode(email); // Enviar código al correo
      setShowVerification(true); // Muestra el componente de verificación
    } catch (error) {
      console.error("Error al enviar el código de verificación", error);
      setMessage("Hubo un error al enviar el código. Intente nuevamente.");
    }
  }

  // Maneja el registro del usuario
  async function registerButton() {
    try {
      console.log("si entra a la peticion ");
      const response = await register(
        name,
        lastname,
        email,
        password,
        role,
        userType
      );
      // Verifica si la respuesta contiene el mensaje de éxito
      if (response.message) {
        setMessage("Registro exitoso, redirigiendo al login...");

        // Redirigir después de 2 segundos
        setTimeout(() => {
          navigate("/login"); // Redirige a la página de login
        }, 2000);
      } else {
        setMessage("Hubo un error en el registro. Intente nuevamente.");
      }
    } catch (error) {
      console.error("Error en el registro", error);
      setMessage("Hubo un error en el registro. Intente nuevamente.");
    }
  }

  // Función para habilitar o deshabilitar tipos de usuario según el rol
  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    setUserType(""); // Limpiar el tipo de usuario cuando cambie el rol
    console.log(userType);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div className="d-none d-md-flex" style={{ flex: 1, background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px', color: '#fff' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚀</div>
        <h1 style={{ fontSize: '36px', fontWeight: 700, margin: '0 0 12px' }}>Únete a SysCurringe</h1>
        <p style={{ fontSize: '16px', opacity: 0.75, textAlign: 'center', maxWidth: '280px', lineHeight: 1.7, margin: 0 }}>
          Crea tu cuenta para gestionar reuniones y tareas.
        </p>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: '#fff' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>Crear Cuenta</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 32px' }}>Completa el formulario para registrarte</p>
          
          {loading && <p className="text-center" style={{ color: 'var(--text-secondary)' }}>Cargando...</p>}
          {error && <div className="alert-error">{error}</div>}
          {message && <div className="alert-success">{message}</div>}
          
          {showVerification ? (
            <VerificationCode email={email} onSuccess={registerButton} />
          ) : (
            <form onSubmit={handleSendVerificationCode}>
              <div className="form-group-custom">
                <label className="form-label-custom">Nombre</label>
                <input
                  type="text"
                  className="form-control-custom"
                  placeholder="Nombre"
                  value={name}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-custom">
                <label className="form-label-custom">Apellido</label>
                <input
                  type="text"
                  className="form-control-custom"
                  placeholder="Apellido"
                  value={lastname}
                  onChange={(e) => setApellido(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-custom">
                <label className="form-label-custom">Correo electrónico</label>
                <input
                  type="email"
                  className="form-control-custom"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-custom">
                <label className="form-label-custom">Contraseña</label>
                <input
                  type="password"
                  className="form-control-custom"
                  placeholder="•••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-custom">
                <label className="form-label-custom">Confirmar Contraseña</label>
                <input
                  type="password"
                  className="form-control-custom"
                  placeholder="•••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-custom">
                <label className="form-label-custom">Tipo de Usuario</label>
                <select
                  className="form-control-custom"
                  onChange={handleRoleChange}
                  value={role}
                  required
                >
                  <option value="seleccioneunaopcion">Seleccione una opción</option>
                  <option value="administrador" disabled={disableAdminOption}>Administrador</option>
                  <option value="coordinador">Coordinador</option>
                  <option value="participante">Participante</option>
                  <option value="consultor">Consultor</option>
                  <option value="gestor actas">Gestor de Actas</option>
                </select>
              </div>

              {(role === "participante" || role === "coordinador" || role === "consultor" || role === "gestor actas") && (
                <div className="form-group-custom">
                  <label className="form-label-custom">Tipo de {role.charAt(0).toUpperCase() + role.slice(1)}</label>
                  <select
                    className="form-control-custom"
                    onChange={(e) => {
                      setUserType(e.target.value);
                      console.log("Tipo de usuario capturado:", e.target.value);
                    }}
                    value={userType}
                  >
                    <option value="selecioneunaopcion">Seleccione una opcion</option>
                    {role === "participante" && (
                      <>
                        <option value="miembro">Miembro</option>
                        <option value="invitado">Invitado</option>
                      </>
                    )}
                    {role === "coordinador" && (
                      <>
                        <option value="moderador">Moderador de Reuniones</option>
                        <option value="asistente">Asistente</option>
                      </>
                    )}
                    {role === "consultor" && (
                      <>
                        <option value="estudiante">Estudiante</option>
                        <option value="profesor">Profesor</option>
                        <option value="investigador">Investigador</option>
                      </>
                    )}
                    {role === "gestor actas" && (
                      <>
                        <option value="secretario">Secretario</option>
                        <option value="revisor de actas">Revisor de Actas</option>
                      </>
                    )}
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                <button
                  type="button"
                  className="btn-secondary-custom"
                  style={{ flex: 1 }}
                  disabled={loading}
                  onClick={() => navigate(-1)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary-custom"
                  style={{ flex: 1 }}
                  disabled={loading}
                >
                  {loading ? "Enviando Código..." : "Enviar Código"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;
