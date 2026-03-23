import React, { useState, useEffect } from "react";
import api from "../services/api";

function TestComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testData = async () => {
      try {
        console.log("🧪 Iniciando prueba de API...");
        
        // Probar diferentes endpoints
        const endpoints = [
          "/admin/loadUsers",
          "/admin/loadTasks", 
          "/admin/loadMeetings",
          "/user/myTasks",
          "/user/myMeetings"
        ];

        for (const endpoint of endpoints) {
          try {
            console.log(`🔍 Probando ${endpoint}...`);
            const response = await api.get(endpoint);
            console.log(`✅ ${endpoint} OK:`, response.data);
          } catch (err) {
            console.error(`❌ ${endpoint} Error:`, err.response?.status, err.response?.data);
          }
        }

        setData("Prueba completada - revisa la consola");
      } catch (error) {
        console.error("Error en prueba:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    testData();
  }, []);

  if (loading) return <div>🧪 Ejecutando prueba...</div>;
  if (error) return <div>❌ Error: {error}</div>;

  return (
    <div style={{ padding: "20px", border: "2px solid blue", margin: "20px" }}>
      <h2>🧪 Componente de Prueba</h2>
      <p>Revisa la consola del navegador (F12) para ver los resultados de las pruebas de API.</p>
      <p>Estado: {data}</p>
    </div>
  );
}

export default TestComponent;
