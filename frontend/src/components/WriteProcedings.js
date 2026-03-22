import { useState, useEffect } from "react";
import "../global.css";

//redaccion de actas
const WriteProcedings = () => {
  const [acta, setActa] = useState({
    titulo: "",
    fecha: "",
    hora: "",
    asistentes: [],
    temas: [],
    decisiones: "",
    tareas: [],
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const now = new Date();
    setActa((prev) => ({
      ...prev,
      fecha: now.toISOString().split("T")[0],
      hora: now.toTimeString().split(" ")[0].slice(0, 5),
    }));
  }, []);

  const handleInputChange = (e, index, field) => {
    const { name, value } = e.target;
    if (field === "temas" || field === "tareas") {
      const newArray = [...acta[field]];
      newArray[index] = { ...newArray[index], [name]: value };
      setActa({ ...acta, [field]: newArray });
    } else {
      setActa({ ...acta, [name]: value });
    }
  };

  const addItem = (field) => {
    if (field === "temas") {
      setActa({
        ...acta,
        temas: [...acta.temas, { tema: "", responsable: "", comentarios: "" }],
      });
    } else if (field === "tareas") {
      setActa({
        ...acta,
        tareas: [
          ...acta.tareas,
          { descripcion: "", responsable: "", fechaVencimiento: "" },
        ],
      });
    }
  };

  const removeItem = (index, field) => {
    const newArray = acta[field].filter((_, i) => i !== index);
    setActa({ ...acta, [field]: newArray });
  };

  const handleSubmit = (action) => {
    setSuccessMessage(
      action === "guardar"
        ? "Acta guardada con éxito"
        : "Acta enviada para aprobación"
    );
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="container mx-auto p-4" style={{ backgroundColor: 'var(--bg-page)' }}>
      <h1 className="page-title mb-4">Redacción de Acta</h1>

      <div className="card-custom mb-4">
        <h2 className="card-title">Información General</h2>
        <input
          name="titulo"
          value={acta.titulo}
          onChange={(e) => handleInputChange(e)}
          placeholder="Título del Acta"
          className="form-control-custom"
        />
        <div className="d-flex gap-2 mb-2">
          <input
            type="date"
            name="fecha"
            value={acta.fecha}
            onChange={(e) => handleInputChange(e)}
            className="form-control-custom"
          />
          <input
            type="time"
            name="hora"
            value={acta.hora}
            onChange={(e) => handleInputChange(e)}
            className="form-control-custom"
          />
        </div>
        <textarea
          name="asistentes"
          value={acta.asistentes.join(", ")}
          onChange={(e) =>
            setActa({ ...acta, asistentes: e.target.value.split(", ") })
          }
          placeholder="Asistentes (separados por coma)"
          className="form-control-custom"
        />
      </div>

      <div className="card-custom mb-4">
        <h2 className="card-title">Temas Tratados</h2>
        {acta.temas.map((tema, index) => (
          <div key={index} className="mb-4 p-2 border rounded">
            <input
              name="tema"
              value={tema.tema}
              onChange={(e) => handleInputChange(e, index, "temas")}
              placeholder="Tema"
              className="form-control-custom"
            />
            <input
              name="responsable"
              value={tema.responsable}
              onChange={(e) => handleInputChange(e, index, "temas")}
              placeholder="Responsable"
              className="form-control-custom"
            />
            <textarea
              name="comentarios"
              value={tema.comentarios}
              onChange={(e) => handleInputChange(e, index, "temas")}
              placeholder="Comentarios"
              className="form-control-custom"
            />
            <button
              onClick={() => removeItem(index, "temas")}
              className="btn-danger-custom"
            >
              Eliminar Tema
            </button>
          </div>
        ))}
        <button
          onClick={() => addItem("temas")}
          className="btn-primary-custom"
        >
          Agregar Tema
        </button>
      </div>

      <div className="card-custom mb-4">
        <h2 className="card-title">Decisiones y Acuerdos</h2>
        <textarea
          name="decisiones"
          value={acta.decisiones}
          onChange={(e) => handleInputChange(e)}
          placeholder="Decisiones y acuerdos alcanzados"
          className="form-control-custom"
        />
      </div>

      <div className="card-custom mb-4">
        <h2 className="card-title">Tareas Asignadas</h2>
        {acta.tareas.map((tarea, index) => (
          <div key={index} className="mb-4 p-2 border rounded">
            <input
              name="descripcion"
              value={tarea.descripcion}
              onChange={(e) => handleInputChange(e, index, "tareas")}
              placeholder="Descripción de la tarea"
              className="form-control-custom"
            />
            <input
              name="responsable"
              value={tarea.responsable}
              onChange={(e) => handleInputChange(e, index, "tareas")}
              placeholder="Responsable"
              className="form-control-custom"
            />
            <input
              type="date"
              name="fechaVencimiento"
              value={tarea.fechaVencimiento}
              onChange={(e) => handleInputChange(e, index, "tareas")}
              className="form-control-custom"
            />
            <button
              onClick={() => removeItem(index, "tareas")}
              className="btn-danger-custom"
            >
              Eliminar Tarea
            </button>
          </div>
        ))}
        <button
          onClick={() => addItem("tareas")}
          className="btn-primary-custom"
        >
          Agregar Tarea
        </button>
      </div>

      <div className="d-flex justify-content-end gap-2 mb-4">
        <button
          onClick={() => handleSubmit("guardar")}
          className="btn-primary-custom"
        >
          Guardar Acta
        </button>
        <button
          onClick={() => handleSubmit("enviar")}
          className="btn-warning-custom"
        >
          Enviar para Aprobación
        </button>
        <button className="btn-secondary-custom">Cancelar</button>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {successMessage && <div className="alert-success">{successMessage}</div>}
    </div>
  );
};

export default WriteProcedings;
