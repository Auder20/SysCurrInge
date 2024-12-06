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

  async function loginButton(e) {
    e.preventDefault();
    try {
      const response = await login(email, password);
      if (response && response.token) {
        const token = response.token;
        localStorage.setItem("token", token);
        const decoded = jwtDecode(token);
        if (decoded.role && decoded.role === "administrador") {
          navigate("/adminDashBoard");
        } else if (decoded.role && decoded.type_user) {
          if (
            decoded.role === "coordinador" &&
            decoded.type_user === "moderador"
          ) {
            navigate("/cordinatorDashBoard");
          } else if (
            decoded.role === "coordinador" &&
            decoded.type_user === "asistente"
          ) {
          } else if (
            decoded.role === "participante" &&
            decoded.type_user === "miembro"
          ) {
          } else if (
            decoded.role === "participante" &&
            decoded.type_user === "invitado"
          ) {
          } else {
            console.error(
              "El rol o el tipo de usuario no se encontró en el token decodificado"
            );
          }
        } else {
          console.error("El rol no se encontró en el token decodificado");
          console.log(decoded.role);
          console.log(decoded.type_user);
        }
      }
    } catch (error) {
      console.log("error al iniciar sesion", error);
    }
  }

  return (
    <div
      className="login-container"
      style={{
        backgroundColor: "#e0f7fa",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="card p-4 shadow"
        style={{ width: "300%", maxWidth: "300px", borderRadius: "10px" }}
      >
        <h2
          className="text-center mb-4"
          style={{
            fontFamily: "Arial, sans-serif",
            color: "#333",
            fontWeight: "bold",
          }}
        >
          Inicio de Sesión
        </h2>
        <form
          onSubmit={loginButton}
          className="d-flex flex-column align-items-center"
        >
          <div className="mb-3 w-100">
            <input
              type="email"
              className="form-control"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ borderRadius: "5px", padding: "10px" }}
              required
            />
          </div>
          <div className="mb-3 w-100">
            <input
              type="password"
              className="form-control"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ borderRadius: "5px", padding: "10px" }}
              required
            />
          </div>
          <div className="d-flex justify-content-between w-100 mb-3">
            <button
              type="button"
              className="btn btn-secondary me-2"
              onClick={handleCancel}
              style={{
                backgroundColor: "#6c757d",
                border: "none",
                borderRadius: "5px",
                padding: "10px 15px",
              }} // Estilo del botón
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#5a6268")
              } // Efecto hover
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#6c757d")
              }
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary me-2"
              disabled={loading}
              style={{
                backgroundColor: "#007bff",
                border: "none",
                borderRadius: "5px",
                padding: "10px 15px",
              }} // Estilo del botón
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#0056b3")
              } // Efecto hover
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#007bff")
              }
            >
              {loading ? "Cargando..." : "Iniciar Sesión"}
            </button>
          </div>
          {error && (
            <p className="text-danger mb-1" style={{ marginBottom: "5px" }}>
              {error}
            </p>
          )}
        </form>
        <p className="text-center mt-1" style={{ marginTop: "5px" }}>
          ¿No te has registrado?{" "}
          <button className="btn btn-link" onClick={handleRegister}>
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
