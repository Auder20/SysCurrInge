import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = ({ userRole }) => {
  const styles = {
    container: {
      marginTop: "2rem",
    },
    cardHeader: {
      backgroundColor: "#007bff",
      color: "#fff",
      textAlign: "center",
      padding: "1rem",
      borderRadius: "0.25rem 0.25rem 0 0",
    },
    sectionHeader: {
      marginBottom: "1rem",
      fontWeight: "bold",
    },
    listItem: {
      border: "1px solid #ddd",
      borderRadius: "0.25rem",
      marginBottom: "0.5rem",
      padding: "0.75rem",
    },
  };

  return (
    <div className="container" style={styles.container}>
      <div className="card shadow-sm">
        <div className="card-header" style={styles.cardHeader}>
          <h1>Bienvenido al Dashboard</h1>
        </div>
        <div className="card-body">
          {/* Funcionalidades comunes a todos los usuarios */}
          <div className="common-features mb-4">
            <h2 style={styles.sectionHeader} className="text-secondary">
              Funcionalidades Comunes
            </h2>
            <ul className="list-group">
              <li className="list-group-item" style={styles.listItem}>
                Ver reuniones programadas
              </li>
              <li className="list-group-item" style={styles.listItem}>
                Consultar actas
              </li>
              <li className="list-group-item" style={styles.listItem}>
                Actualizar perfil
              </li>
            </ul>
          </div>

          {/* Secciones específicas de acuerdo al rol */}
          {userRole === "administrador" && (
            <div className="role-section mb-4">
              <h3 className="text-danger" style={styles.sectionHeader}>
                Sección de Administrador
              </h3>
              <ul className="list-group">
                <li className="list-group-item" style={styles.listItem}>
                  Gestión de usuarios
                </li>
                <li className="list-group-item" style={styles.listItem}>
                  Configuración avanzada
                </li>
              </ul>
            </div>
          )}

          {userRole === "coordinador" && (
            <div className="role-section mb-4">
              <h3 className="text-warning" style={styles.sectionHeader}>
                Sección de Coordinador
              </h3>
              <ul className="list-group">
                <li className="list-group-item" style={styles.listItem}>
                  Planificar reuniones
                </li>
                <li className="list-group-item" style={styles.listItem}>
                  Asignar tareas
                </li>
              </ul>
            </div>
          )}

          {userRole === "miembro" && (
            <div className="role-section mb-4">
              <h3 className="text-info" style={styles.sectionHeader}>
                Sección de Miembro
              </h3>
              <ul className="list-group">
                <li className="list-group-item" style={styles.listItem}>
                  Participar en reuniones
                </li>
                <li className="list-group-item" style={styles.listItem}>
                  Ver actas y detalles de reuniones
                </li>
              </ul>
            </div>
          )}

          {userRole === "invitado" && (
            <div className="role-section mb-4">
              <h3 className="text-muted" style={styles.sectionHeader}>
                Sección de Invitado
              </h3>
              <ul className="list-group">
                <li className="list-group-item" style={styles.listItem}>
                  Acceso limitado a reuniones públicas
                </li>
              </ul>
            </div>
          )}

          {userRole === "jefe de departamento" && (
            <div className="role-section mb-4">
              <h3 className="text-success" style={styles.sectionHeader}>
                Sección de Jefe de Departamento
              </h3>
              <ul className="list-group">
                <li className="list-group-item" style={styles.listItem}>
                  Supervisión de reuniones
                </li>
                <li className="list-group-item" style={styles.listItem}>
                  Revisión de actas y decisiones clave
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
