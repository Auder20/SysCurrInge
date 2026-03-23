import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";

const MeetingAgendas = () => {
  const [agenda, setAgenda] = useState([]);
  const [nuevoTema, setNuevoTema] = useState({
    titulo: "",
    descripcion: "",
    responsable: "",
    tiempo: "",
    estado: "pendiente",
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [temaEditandoIndex, setTemaEditandoIndex] = useState(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { saveAgenda, getAgendaByMeeting } = useAdmin();
  const { id_reunion } = useParams(); // Obtener id_reunion de la URL
  const navigate = useNavigate();

  // Cargar agenda existente si hay id_reunion
  useEffect(() => {
    const loadAgenda = async () => {
      if (id_reunion) {
        try {
          setLoading(true);
          const existingAgenda = await getAgendaByMeeting(id_reunion);
          setAgenda(existingAgenda || []);
        } catch (error) {
          console.error("Error al cargar agenda:", error);
          setError("Error al cargar la agenda existente.");
        } finally {
          setLoading(false);
        }
      }
    };

    loadAgenda();
  }, [id_reunion, getAgendaByMeeting]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoTema((prev) => ({ ...prev, [name]: value }));
  };

  const validarTema = () => {
    if (!nuevoTema.titulo || !nuevoTema.responsable || !nuevoTema.tiempo) {
      setError("Por favor, complete todos los campos requeridos.");
      return false;
    }
    setError("");
    return true;
  };

  const agregarTema = () => {
    if (validarTema()) {
      setAgenda([...agenda, nuevoTema]);
      setNuevoTema({
        titulo: "",
        descripcion: "",
        responsable: "",
        tiempo: "",
        estado: "pendiente",
      });
      setMensaje("Tema agregado con éxito.");
    }
  };

  const editarTema = (index) => {
    setModoEdicion(true);
    setTemaEditandoIndex(index);
    setNuevoTema(agenda[index]);
  };

  const actualizarTema = () => {
    if (validarTema()) {
      const nuevaAgenda = [...agenda];
      nuevaAgenda[temaEditandoIndex] = nuevoTema;
      setAgenda(nuevaAgenda);
      setModoEdicion(false);
      setTemaEditandoIndex(null);
      setNuevoTema({
        titulo: "",
        descripcion: "",
        responsable: "",
        tiempo: "",
        estado: "pendiente",
      });
      setMensaje("Tema actualizado con éxito.");
    }
  };

  const eliminarTema = (index) => {
    const nuevaAgenda = agenda.filter((_, i) => i !== index);
    setAgenda(nuevaAgenda);
    setMensaje("Tema eliminado con éxito.");
  };

  const guardarAgenda = async () => {
    if (!id_reunion) {
      setError("No se puede guardar la agenda sin una reunión asociada.");
      return;
    }

    try {
      setLoading(true);
      // Preparar los datos para el backend
      const agendaItems = agenda.map(item => ({
        titulo: item.titulo,
        descripcion: item.descripcion,
        responsable: item.responsable,
        tiempo: parseInt(item.tiempo),
        estado: item.estado
      }));

      await saveAgenda(id_reunion, agendaItems);
      setMensaje("Agenda guardada con éxito.");
      setError("");
      
      // Opcional: redirigir después de guardar
      setTimeout(() => {
        navigate(-1); // Regresar a la página anterior
      }, 2000);
    } catch (error) {
      console.error("Error al guardar agenda:", error);
      setError("Error al guardar la agenda. Intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-2xl font-bold mb-0">Agenda de Reunión</h1>
        {id_reunion && (
          <span className="badge bg-secondary">ID Reunión: {id_reunion}</span>
        )}
      </div>

      {loading && (
        <div className="text-center mb-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando agenda...</p>
        </div>
      )}

      {error && <div className="alert alert-danger mb-4">{error}</div>}
      {mensaje && <div className="alert alert-success mb-4">{mensaje}</div>}}

      <div className="border p-4 mb-6">
        <h2 className="text-xl font-semibold">
          {modoEdicion ? "Editar Tema" : "Agregar Nuevo Tema"}
        </h2>
        <div className="space-y-4">
          <input
            name="titulo"
            placeholder="Título del Tema"
            value={nuevoTema.titulo}
            onChange={handleInputChange}
            className="form-control"
          />
          <textarea
            name="descripcion"
            placeholder="Descripción del Tema"
            value={nuevoTema.descripcion}
            onChange={handleInputChange}
            className="form-control"
            rows="3"
          />
          <input
            name="responsable"
            placeholder="Responsable"
            value={nuevoTema.responsable}
            onChange={handleInputChange}
            className="form-control"
          />
          <input
            name="tiempo"
            placeholder="Tiempo Asignado (en minutos)"
            type="number"
            value={nuevoTema.tiempo}
            onChange={handleInputChange}
            className="form-control"
          />
          <select
            value={nuevoTema.estado}
            onChange={(e) =>
              handleInputChange({
                target: { name: "estado", value: e.target.value },
              })
            }
            className="form-control"
          >
            <option value="pendiente">Pendiente</option>
            <option value="en_progreso">En Progreso</option>
            <option value="completado">Completado</option>
          </select>
        </div>
        <button
          onClick={modoEdicion ? actualizarTema : agregarTema}
          className="btn-primary-custom"
          style={{ marginTop: '16px' }}
          disabled={loading}
        >
          {modoEdicion ? "Actualizar Tema" : "Agregar Tema"}
        </button>
      </div>

      <div className="mb-4">
        {agenda.map((tema, index) => (
          <div key={index} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">{tema.titulo}</h5>
              <p className="card-text">{tema.descripcion}</p>
              <p className="card-text">
                <strong>Responsable:</strong> {tema.responsable}
              </p>
              <p className="card-text">
                <strong>Tiempo:</strong> {tema.tiempo} minutos
              </p>
              <p className="card-text">
                <strong>Estado:</strong> 
                <span className={`badge ms-2 ${
                  tema.estado === 'completado' ? 'bg-success' : 
                  tema.estado === 'en_progreso' ? 'bg-warning' : 'bg-secondary'
                }`}>
                  {tema.estado}
                </span>
              </p>
              <div className="d-flex gap-2 mt-2">
                <button
                  onClick={() => editarTema(index)}
                  className="btn-warning-custom"
                  disabled={loading}
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarTema(index)}
                  className="btn-danger-custom"
                  disabled={loading}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {agenda.length > 0 && (
        <button
          className="btn-primary-custom"
          style={{ marginTop: '16px' }}
          onClick={guardarAgenda}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Guardando...</span>
              </span>
              Guardando...
            </>
          ) : (
            "Guardar Agenda"
          )}
        </button>
      )}
    </div>
  );
};

export default MeetingAgendas;
