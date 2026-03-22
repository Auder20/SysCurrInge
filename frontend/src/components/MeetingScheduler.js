import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, InputGroup, FormControl } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import useAdmin from "../hooks/useAdmin";

function MeetingScheduler() {
  const navigate = useNavigate();

  const [meetings, setMeetings] = useState([]); // Estado para las reuniones
  const [loading, setLoading] = useState(true); // Estado de carga
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [meetingsPerPage] = useState(6); // Número de reuniones por página
  const [searchQuery, setSearchQuery] = useState(""); // Query de búsqueda
  const { loadAllMeetings, deleteMeeting } = useAdmin(); // Hooks personalizados

  useEffect(() => {
    const loadMeetings = async () => {
      try {
        const meetingsData = await loadAllMeetings();
        console.log("Reuniones obtenidas:", meetingsData);
        setMeetings(meetingsData || []);
      } catch (error) {
        console.error("Error al cargar las reuniones:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMeetings();
  }, [loadAllMeetings]);

  // Función para registrar una nueva reunión
  function handleRegister() {
    navigate("/addMeetingForm");
  }

  // Función para editar reunión
  const editMeeting = (meetingId) => {
    navigate("/editMeeting/" + meetingId);
    console.log(`Editar reunión ${meetingId}`);
  };

  // Función para eliminar reunión
  async function handleDeleteMeeting(meetingId) {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta reunión?")) {
      try {
        const response = await deleteMeeting(meetingId);
        setMeetings(
          meetings.filter((meeting) => meeting.id_reunion !== meetingId)
        );
        console.log(response);
        alert("Reunión eliminada con éxito.");
      } catch (error) {
        console.error("Error al eliminar la reunión:", error);
        alert("Hubo un error al eliminar la reunión.");
      }
    }
  }

  // Filtrar reuniones por el query de búsqueda
  const filteredMeetings = meetings.filter((meeting) => {
    return meeting.nombre_reunion
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

  // Paginación
  const indexOfLastMeeting = currentPage * meetingsPerPage;
  const indexOfFirstMeeting = indexOfLastMeeting - meetingsPerPage;
  const currentMeetings = filteredMeetings.slice(
    indexOfFirstMeeting,
    indexOfLastMeeting
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Número total de páginas
  const totalPages = Math.ceil(filteredMeetings.length / meetingsPerPage);

  return (
    <div className="p-4">
      <h3 className="text-center mb-4">Gestión de Reuniones</h3>

      {/* Barra de búsqueda */}
      <div className="mb-4">
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Buscar reunión..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
      </div>

      {/* Botón para agregar reunión */}
      <div className="d-flex justify-content-center mb-3">
        <Button onClick={handleRegister} className="btn btn-primary">
          Agregar Reunión
        </Button>
      </div>

      {/* Mostrar reuniones */}
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <div>
          <div className="row row-cols-1 g-4">
            {currentMeetings.length === 0 ? (
              <div className="text-center col-12">
                No hay reuniones registradas.
              </div>
            ) : (
              currentMeetings.map((meeting) => (
                <div key={meeting.id_reunion} className="col">
                  <Card className="shadow-lg border-light rounded">
                    <Card.Body>
                      <Card.Title>{meeting.nombre_reunion}</Card.Title>
                      <Card.Text>
                        <strong>Fecha:</strong> {meeting.fecha}
                      </Card.Text>
                      <Card.Text>
                        <strong>Hora:</strong> {meeting.hora}
                      </Card.Text>
                      <div className="d-flex justify-content-end">
                        <Button
                          onClick={() => editMeeting(meeting.id_reunion)}
                          variant="outline-warning"
                          size="sm"
                          className="me-2"
                        >
                          <FaEdit /> Editar
                        </Button>
                        <Button
                          onClick={() =>
                            handleDeleteMeeting(meeting.id_reunion)
                          }
                          variant="outline-danger"
                          size="sm"
                        >
                          <FaTrash /> Eliminar
                        </Button>
                      </div>
                    </Card.Body>
                    <Card.Footer className="text-center">
                      <small className="text-muted">
                        Última actualización:{" "}
                        {meeting.fecha_actualizacion || "N/A"}
                      </small>
                    </Card.Footer>
                  </Card>
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

export default MeetingScheduler;
