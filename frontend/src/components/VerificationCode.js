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
    <div className="container mt-5">
      <form
        onSubmit={handleVerifyCode}
        className="p-4 border rounded shadow-sm bg-light"
      >
        <h3 className="text-center mb-4">Verificación de Código</h3>
        <p className="text-center text-muted">
          Ingrese el código enviado a su correo electrónico.
        </p>
        <div className="form-group mb-3">
          <label htmlFor="verificationCode" className="form-label">
            Código de verificación
          </label>
          <input
            type="text"
            id="verificationCode"
            className={`form-control ${error ? "is-invalid" : ""}`}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Ingrese su código"
            maxLength={6}
          />
          {error && <div className="invalid-feedback">{error}</div>}
        </div>
        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn-secondary-custom"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancelar
          </button>
          <button type="submit" className="btn-primary-custom" disabled={loading}>
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Verificando...
              </>
            ) : (
              "Verificar"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default VerificationCode;
