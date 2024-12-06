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
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => console.log("Marcar todos presentes")}
          style={{ marginRight: "10px" }}
        >
          Marcar todos presentes
        </button>
        <button onClick={() => console.log("Marcar todos ausentes")}>
          Marcar todos ausentes
        </button>
      </div>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {asistentes.length > 0 ? (
          asistentes.map((asistente) => (
            <li
              key={asistente.id}
              style={{
                background: "#f9f9f9",
                padding: "15px",
                marginBottom: "10px",
                borderRadius: "5px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: "bold" }}>{asistente.nombre}</span>
                <div>
                  <label>
                    <input
                      type="radio"
                      name={`asistencia-${asistente.id}`}
                      value="presente"
                      checked={asistente.estadoAsistencia === "presente"}
                      onChange={() => console.log("Cambiar a presente")}
                      style={{ marginRight: "5px" }}
                    />
                    Presente
                  </label>
                  <label style={{ marginLeft: "15px" }}>
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

      {error && <div style={{ color: "red", marginTop: "20px" }}>{error}</div>}
      {success && (
        <div style={{ color: "green", marginTop: "20px" }}>{success}</div>
      )}

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => console.log("Guardar asistencia")}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
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
