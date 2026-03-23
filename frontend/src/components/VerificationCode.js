import React, { useState } from "react";
import useRegister from "../hooks/useRegister";
import { useNavigate } from "react-router-dom";

function VerificationCode({ email, onSuccess }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { verifyCode } = useRegister();
  const navigate = useNavigate();

  async function handleVerifyCode(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    if (code.length !== 6) {
      setError("El código debe tener 6 caracteres.");
      setLoading(false);
      return;
    }

    try {
      const response = await verifyCode(email, code);
      if (response === true) {
        onSuccess();
      } else {
        setError("Código incorrecto. Intente nuevamente.");
      }
    } catch (error) {
      setError("Error al verificar el código. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Verificación de Código</h1>
        <p className="auth-subtitle">
          Ingresa el código de 6 dígitos enviado a tu correo electrónico.
        </p>
        
        <form onSubmit={handleVerifyCode} className="auth-form">
          <div className="form-group">
            <label htmlFor="verificationCode" className="form-label">
              Código de verificación
            </label>
            <input
              type="text"
              id="verificationCode"
              className={`form-control-custom ${error ? "is-invalid" : ""}`}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="000000"
              maxLength={6}
            />
            {error && <div className="error-message">{error}</div>}
          </div>
          
          <div className="auth-buttons">
            <button
              type="button"
              className="btn-secondary-custom"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary-custom" disabled={loading}>
              {loading ? "Verificando..." : "Verificar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VerificationCode;
