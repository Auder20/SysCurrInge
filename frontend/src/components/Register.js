import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useRegister from "../hooks/useRegister";
import VerificationCode from "./VerificationCode";

function Register() {
  const [name, setNombre] = useState("");
  const [lastname, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Registro de Usuario</h2>
        {loading && <p className="text-center text-info">Cargando...</p>}
        {error && <p className="text-center text-danger">{error}</p>}
        {message && <p className="text-center text-success">{message}</p>}{" "}
        {/* Mostrar mensajes */}
        {showVerification ? (
          <VerificationCode email={email} onSuccess={registerButton} />
        ) : (
          <form onSubmit={handleSendVerificationCode}>
            {/* Campos del formulario de registro */}
            <div className="form-group mb-3">
              <input
                type="text"
                id="nombre"
                placeholder="Nombre"
                className="form-control"
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-3">
              <input
                type="text"
                id="apellido"
                placeholder="Apellido"
                className="form-control"
                onChange={(e) => setApellido(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-3">
              <input
                type="email"
                id="email"
                placeholder="Correo electrónico"
                className="form-control"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-3">
              <input
                type="password"
                id="password"
                placeholder="Contraseña"
                className="form-control"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Campo de Tipo de Usuario */}
            <div className="form-group mb-4">
              <label htmlFor="role" className="form-label">
                Tipo de Usuario
              </label>
              <select
                id="role"
                className="form-select"
                onChange={handleRoleChange}
                value={role}
              >
                <option value="seleccioneunaopcion">
                  Seleccione una opción
                </option>
                <option value="administrador" disabled={disableAdminOption}>
                  Administrador
                </option>
                <option value="coordinador">Coordinador</option>
                <option value="participante">Participante</option>
                <option value="consultor">Consultor</option>
                <option value="gestor actas">Gestor de Actas</option>
              </select>
            </div>

            {/* Campo de Tipo de Participante (solo habilitado si el rol es Participante) */}
            {(role === "participante" ||
              role === "coordinador" ||
              role === "consultor" ||
              role === "gestor actas") && (
              <div className="form-group mb-4">
                <label htmlFor="userType" className="form-label">
                  Tipo de {role.charAt(0).toUpperCase() + role.slice(1)}
                </label>
                <select
                  id="userType"
                  className="form-select"
                  onChange={(e) => {
                    setUserType(e.target.value);
                    console.log("Tipo de usuario capturado:", e.target.value);
                  }}
                  value={userType}
                >
                  {role === "participante" && (
                    <>
                      <option value="selecioneunaopcion">
                        Seleccione una opcion
                      </option>
                      <option value="miembro">Miembro</option>
                      <option value="invitado">Invitado</option>
                    </>
                  )}
                  {role === "coordinador" && (
                    <>
                      <option value="selecioneunaopcion">
                        Seleccione una opcion
                      </option>
                      <option value="moderador">Moderador de Reuniones</option>
                      <option value="asistente">Asistente</option>
                    </>
                  )}
                  {role === "consultor" && (
                    <>
                      <option value="selecioneunaopcion">
                        Seleccione una opcion
                      </option>

                      <option value="estudiante">Estudiante</option>
                      <option value="profesor">Profesor</option>
                      <option value="investigador">Investigador</option>
                    </>
                  )}
                  {role === "gestor actas" && (
                    <>
                      <option value="selecioneunaopcion">
                        Seleccione una opcion
                      </option>
                      <option value="secretario">Secretario</option>
                      <option value="revisor de actas">Revisor de Actas</option>
                    </>
                  )}
                </select>
              </div>
            )}

            <div className="text-center d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-secondary w-48"
                disabled={loading}
                onClick={() => navigate(-1)}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary w-48"
                disabled={loading}
              >
                {loading ? "Enviando Código..." : "Enviar Código"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Register;
