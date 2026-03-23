import React, { useState, useEffect } from "react";

//asistencia reunion
const AttendanceRegistration = ({
  reunionId,
  participantes = [],
  onGuardar,
}) => {
  const [asistentes, setAsistentes] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Inicializar el estado de asistencia solo si hay participantes
    if (participantes.length > 0) {
      const asistentesIniciales = participantes.map((participante) => ({
        ...participante,
        estadoAsistencia: "ausente",
      }));
      setAsistentes(asistentesIniciales);
    }
  }, [participantes]);

  // Funciones de manejo y lógica pueden ser implementadas más tarde

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h1
        style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}
      >
        Registro de Asistencia
      </h1>
      <div className="toolbar" style={{ marginBottom: "20px" }}>
        <button
          onClick={() => console.log("Marcar todos presentes")}
          className="btn-secondary-custom"
        >
          Marcar todos presentes
        </button>
        <button onClick={() => console.log("Marcar todos ausentes")} className="btn-secondary-custom">
          Marcar todos ausentes
        </button>
      </div>
      <ul className="list-unstyled" style={{ padding: 0 }}>
        {asistentes.length > 0 ? (
          asistentes.map((asistente) => (
            <li
              key={asistente.id}
              className="card-custom mb-3"
            >
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold">{asistente.nombre}</span>
                <div>
                  <label>
                    <input
                      type="radio"
                      name={`asistencia-${asistente.id}`}
                      value="presente"
                      checked={asistente.estadoAsistencia === "presente"}
                      onChange={() => console.log("Cambiar a presente")}
                      className="form-control-custom"
                    />
                    Presente
                  </label>
                  <label className="ml-3">
                    <input
                      type="radio"
                      name={`asistencia-${asistente.id}`}
                      value="ausente"
                      checked={asistente.estadoAsistencia === "ausente"}
                      onChange={() => console.log("Cambiar a ausente")}
                      style={{ marginRight: "5px" }}
                    />
                    Ausente
                  </label>
                  <label style={{ marginLeft: "15px" }}>
                    <input
                      type="radio"
                      name={`asistencia-${asistente.id}`}
                      value="justificado"
                      checked={asistente.estadoAsistencia === "justificado"}
                      onChange={() => console.log("Cambiar a justificado")}
                      className="form-control-custom"
                      style={{ marginRight: "5px" }}
                    />
                    Justificado
                  </label>
                </div>
              </div>
            </li>
          ))
        ) : (
          <li>No hay participantes disponibles.</li>
        )}
      </ul>

      {error && <div className="alert-error" style={{ marginTop: "20px" }}>{error}</div>}
      {success && (
        <div className="alert-success" style={{ marginTop: "20px" }}>{success}</div>
      )}

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => console.log("Guardar asistencia")}
          className="btn-primary-custom"
        >
          Guardar Asistencia
        </button>
      </div>
    </div>
  );
};

// Ejemplo de uso del componente con datos de prueba
const App = () => {
  const ejemploParticipantes = [
    { id: 1, nombre: "Juan" },
    { id: 2, nombre: "Ana" },
    { id: 3, nombre: "Luis" },
  ];

  return (
    <AttendanceRegistration
      reunionId={1}
      participantes={ejemploParticipantes}
      onGuardar={(asistentes, reunionId) => console.log(asistentes, reunionId)}
    />
  );
};

export default App;
