import React, { useState, useEffect } from "react";
import "../global.css";
import api from "../services/api";

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Función para generar y descargar CSV
  const downloadCSV = (data, filename, headers) => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header] || '';
        // Escapar comillas y envolver en comillas si contiene comas o comillas
        return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generar reporte de usuarios por rol
  const generateUsersReport = async () => {
    try {
      const response = await api.get('/admin/loadUsers');
      const users = response.data || [];
      
      // Agrupar usuarios por rol
      const usersByRole = users.reduce((acc, user) => {
        const role = user.rol || 'sin_rol';
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      }, {});

      const reportData = Object.entries(usersByRole).map(([role, count]) => ({
        rol: role,
        cantidad: count,
        porcentaje: ((count / users.length) * 100).toFixed(2) + '%'
      }));

      return {
        id: 'users-by-role',
        title: 'Reporte de Usuarios por Rol',
        date: new Date().toLocaleDateString(),
        stats: {
          total: users.length,
          roles: Object.keys(usersByRole).length
        },
        data: reportData,
        csvData: users,
        csvHeaders: ['id_usuario', 'nombre', 'apellido', 'correo_electronico', 'rol', 'estado', 'tipo_usuario']
      };
    } catch (error) {
      console.error('Error al generar reporte de usuarios:', error);
      return null;
    }
  };

  // Generar reporte de tareas por estado
  const generateTasksReport = async () => {
    try {
      const response = await api.get('/admin/loadTasks');
      const tasks = response.data || [];
      
      // Agrupar tareas por estado
      const tasksByStatus = tasks.reduce((acc, task) => {
        const status = task.estado || 'sin_estado';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      const reportData = Object.entries(tasksByStatus).map(([status, count]) => ({
        estado: status,
        cantidad: count,
        porcentaje: ((count / tasks.length) * 100).toFixed(2) + '%'
      }));

      return {
        id: 'tasks-by-status',
        title: 'Reporte de Tareas por Estado',
        date: new Date().toLocaleDateString(),
        stats: {
          total: tasks.length,
          estados: Object.keys(tasksByStatus).length
        },
        data: reportData,
        csvData: tasks,
        csvHeaders: ['id_tarea', 'descripcion', 'estado', 'fecha_vencimiento', 'id_usuario']
      };
    } catch (error) {
      console.error('Error al generar reporte de tareas:', error);
      return null;
    }
  };

  // Generar reporte de reuniones del mes actual
  const generateMeetingsReport = async () => {
    try {
      const response = await api.get('/admin/loadMeetings');
      const meetings = response.data || [];
      
      // Filtrar reuniones del mes actual
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const currentMonthMeetings = meetings.filter(meeting => {
        const meetingDate = new Date(meeting.fecha);
        return meetingDate.getMonth() === currentMonth && 
               meetingDate.getFullYear() === currentYear;
      });

      const reportData = currentMonthMeetings.map(meeting => ({
        nombre_reunion: meeting.nombre_reunion,
        fecha: meeting.fecha,
        ubicacion: meeting.ubicacion || 'No especificada'
      }));

      return {
        id: 'current-month-meetings',
        title: `Reuniones de ${new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`,
        date: new Date().toLocaleDateString(),
        stats: {
          total: currentMonthMeetings.length,
          mes: new Date().toLocaleDateString('es-ES', { month: 'long' })
        },
        data: reportData,
        csvData: currentMonthMeetings,
        csvHeaders: ['id_reunion', 'nombre_reunion', 'fecha', 'ubicacion', 'id_usuario']
      };
    } catch (error) {
      console.error('Error al generar reporte de reuniones:', error);
      return null;
    }
  };

  // Cargar todos los reportes
  useEffect(() => {
    const loadAllReports = async () => {
      try {
        setLoading(true);
        
        const [usersReport, tasksReport, meetingsReport] = await Promise.all([
          generateUsersReport(),
          generateTasksReport(),
          generateMeetingsReport()
        ]);

        const allReports = [usersReport, tasksReport, meetingsReport].filter(Boolean);
        setReports(allReports);
      } catch (error) {
        console.error('Error al cargar reportes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllReports();
  }, [refreshKey]);

  const handleRefreshReports = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleExportCSV = (report) => {
    if (report.csvData && report.csvHeaders) {
      downloadCSV(report.csvData, report.title.replace(/\s+/g, '_').toLowerCase(), report.csvHeaders);
    }
  };

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Reportes del Sistema</h3>
        <button onClick={handleRefreshReports} className="btn-secondary-custom">
          Actualizar Reportes
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Generando reportes...</p>
        </div>
      ) : (
        <div>
          {reports.length === 0 ? (
            <div className="alert alert-info text-center">
              <h4 className="alert-heading">No hay datos disponibles</h4>
              <p>No se pudo generar reportes. Verifica la conexión con el servidor.</p>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {reports.map((report) => (
                <div key={report.id} className="col">
                  <div className="card shadow-lg border-light rounded h-100">
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title text-primary">{report.title}</h5>
                      <p className="card-text text-muted small">
                        <strong>Generado:</strong> {report.date}
                      </p>
                      
                      {/* Estadísticas principales */}
                      <div className="mb-3">
                        <div className="row text-center">
                          {Object.entries(report.stats).map(([key, value]) => (
                            <div key={key} className="col-6">
                              <div className="bg-light rounded p-2 mb-2">
                                <h4 className="mb-0 text-primary">{value}</h4>
                                <small className="text-muted">{key.replace(/_/g, ' ').toUpperCase()}</small>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Vista previa de datos */}
                      <div className="mb-3 flex-grow-1">
                        <h6 className="text-muted mb-2">Resumen:</h6>
                        <div className="small" style={{ maxHeight: '120px', overflowY: 'auto' }}>
                          {report.data.slice(0, 3).map((item, index) => (
                            <div key={index} className="mb-1">
                              {Object.entries(item).map(([key, value]) => (
                                <span key={key} className="me-2">
                                  <strong>{key}:</strong> {value}
                                </span>
                              ))}
                            </div>
                          ))}
                          {report.data.length > 3 && (
                            <div className="text-muted">... y {report.data.length - 3} más</div>
                          )}
                        </div>
                      </div>

                      {/* Botón de exportación */}
                      <div className="mt-auto">
                        <button
                          onClick={() => handleExportCSV(report)}
                          className="btn-primary-custom"
                          style={{ width: '100%' }}
                        >
                          Exportar CSV
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Reports;
