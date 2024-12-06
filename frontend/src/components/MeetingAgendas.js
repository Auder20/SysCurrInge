import React, { useState } from "react";

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

  const guardarAgenda = () => {
    // Aquí iría la lógica para guardar la agenda en el backend
    console.log("Agenda guardada:", agenda);
    setMensaje("Agenda guardada con éxito.");
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Agenda de Reunión</h1>

      {error && <div className="text-red-600 mb-4">{error}</div>}
      {mensaje && <div className="text-green-600 mb-4">{mensaje}</div>}

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
            className="border p-2 w-full"
          />
          <textarea
            name="descripcion"
            placeholder="Descripción del Tema"
            value={nuevoTema.descripcion}
            onChange={handleInputChange}
            className="border p-2 w-full"
          />
          <input
            name="responsable"
            placeholder="Responsable"
            value={nuevoTema.responsable}
            onChange={handleInputChange}
            className="border p-2 w-full"
          />
          <input
            name="tiempo"
            placeholder="Tiempo Asignado (en minutos)"
            type="number"
            value={nuevoTema.tiempo}
            onChange={handleInputChange}
            className="border p-2 w-full"
          />
          <select
            value={nuevoTema.estado}
            onChange={(e) =>
              handleInputChange({
                target: { name: "estado", value: e.target.value },
              })
            }
            className="border p-2 w-full"
          >
            <option value="pendiente">Pendiente</option>
            <option value="en_progreso">En Progreso</option>
            <option value="completado">Completado</option>
          </select>
        </div>
        <button
          onClick={modoEdicion ? actualizarTema : agregarTema}
          className="bg-blue-500 text-white p-2 mt-4"
        >
          {modoEdicion ? "Actualizar Tema" : "Agregar Tema"}
        </button>
      </div>

      <div className="space-y-4">
        {agenda.map((tema, index) => (
          <div key={index} className="border p-4">
            <h3 className="text-lg font-semibold">{tema.titulo}</h3>
            <p>{tema.descripcion}</p>
            <p>
              <strong>Responsable:</strong> {tema.responsable}
            </p>
            <p>
              <strong>Tiempo:</strong> {tema.tiempo} minutos
            </p>
            <p>
              <strong>Estado:</strong> {tema.estado}
            </p>
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => editarTema(index)}
                className="bg-yellow-500 text-white p-2"
              >
                Editar
              </button>
              <button
                onClick={() => eliminarTema(index)}
                className="bg-red-500 text-white p-2"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {agenda.length > 0 && (
        <button
          className="bg-green-500 text-white p-2 mt-6"
          onClick={guardarAgenda}
        >
          Guardar Agenda
        </button>
      )}
    </div>
  );
};

export default MeetingAgendas;
