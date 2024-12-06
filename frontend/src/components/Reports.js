import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEdit, FaTrash } from "react-icons/fa";

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(6);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Simula la carga de reportes desde un servidor
    const loadReports = async () => {
      try {
        setLoading(true);
        // Simula reportes
        const mockReports = [
          { id: 1, title: "Reporte de Ventas", date: "2024-11-10" },
          { id: 2, title: "Reporte de Usuarios", date: "2024-11-12" },
          { id: 3, title: "Reporte Financiero", date: "2024-11-13" },
          // Agregar más reportes simulados si es necesario
        ];
        setReports(mockReports);
      } catch (error) {
        console.error("Error al cargar reportes:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  const handleGenerateReport = () => {
    console.log("Generar reporte");
    alert("Funcionalidad para generar un reporte aún no implementada.");
  };

  const editReport = (reportId) => {
    console.log(`Editar reporte ${reportId}`);
    alert(
      `Funcionalidad para editar el reporte ${reportId} aún no implementada.`
    );
  };

  const handleDeleteReport = (reportId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este reporte?")) {
      setReports(reports.filter((report) => report.id !== reportId));
      alert("Reporte eliminado con éxito.");
    }
  };

  // Filtrar reportes según el query de búsqueda
  const filteredReports = reports.filter((report) =>
    report.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Paginación
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(
    indexOfFirstReport,
    indexOfLastReport
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Número total de páginas
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  return (
    <div className="p-3">
      <h3 className="text-center mb-3">Gestión de Reportes</h3>
      <div className="text-center">
        <button onClick={handleGenerateReport} className="btn btn-primary mb-4">
          Generar Reporte
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar reporte..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <div>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {currentReports.length === 0 ? (
              <div className="text-center col-12">
                No hay reportes disponibles.
              </div>
            ) : (
              currentReports.map((report) => (
                <div key={report.id} className="col">
                  <div className="card shadow-lg border-light rounded">
                    <div className="card-body">
                      <h5 className="card-title">{report.title}</h5>
                      <p className="card-text">
                        <strong>Fecha:</strong>{" "}
                        {report.date || "Fecha no disponible"}
                      </p>
                      <div className="d-flex justify-content-end">
                        <button
                          onClick={() => editReport(report.id)}
                          className="btn btn-outline-warning btn-sm me-2"
                        >
                          <FaEdit /> Editar
                        </button>
                        <button
                          onClick={() => handleDeleteReport(report.id)}
                          className="btn btn-outline-danger btn-sm"
                        >
                          <FaTrash /> Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Paginación */}
          <div className="d-flex justify-content-center mt-4">
            <nav aria-label="Page navigation">
              <ul className="pagination">
                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </button>
                </li>
                {[...Array(totalPages)].map((_, index) => (
                  <li
                    key={index}
                    className={`page-item ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;
