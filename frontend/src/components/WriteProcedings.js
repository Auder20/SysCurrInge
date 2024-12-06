import { useState, useEffect } from "react";

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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Redacción de Acta</h1>

      <div className="mb-4 border p-4 rounded">
        <h2 className="text-xl font-semibold">Información General</h2>
        <input
          name="titulo"
          value={acta.titulo}
          onChange={(e) => handleInputChange(e)}
          placeholder="Título del Acta"
          className="mb-2 border p-2 w-full"
        />
        <div className="flex gap-2 mb-2">
          <input
            type="date"
            name="fecha"
            value={acta.fecha}
            onChange={(e) => handleInputChange(e)}
            className="border p-2 w-full"
          />
          <input
            type="time"
            name="hora"
            value={acta.hora}
            onChange={(e) => handleInputChange(e)}
            className="border p-2 w-full"
          />
        </div>
        <textarea
          name="asistentes"
          value={acta.asistentes.join(", ")}
          onChange={(e) =>
            setActa({ ...acta, asistentes: e.target.value.split(", ") })
          }
          placeholder="Asistentes (separados por coma)"
          className="border p-2 w-full"
        />
      </div>

      <div className="mb-4 border p-4 rounded">
        <h2 className="text-xl font-semibold">Temas Tratados</h2>
        {acta.temas.map((tema, index) => (
          <div key={index} className="mb-4 p-2 border rounded">
            <input
              name="tema"
              value={tema.tema}
              onChange={(e) => handleInputChange(e, index, "temas")}
              placeholder="Tema"
              className="mb-2 border p-2 w-full"
            />
            <input
              name="responsable"
              value={tema.responsable}
              onChange={(e) => handleInputChange(e, index, "temas")}
              placeholder="Responsable"
              className="mb-2 border p-2 w-full"
            />
            <textarea
              name="comentarios"
              value={tema.comentarios}
              onChange={(e) => handleInputChange(e, index, "temas")}
              placeholder="Comentarios"
              className="mb-2 border p-2 w-full"
            />
            <button
              onClick={() => removeItem(index, "temas")}
              className="bg-red-500 text-white p-2 rounded"
            >
              Eliminar Tema
            </button>
          </div>
        ))}
        <button
          onClick={() => addItem("temas")}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Agregar Tema
        </button>
      </div>

      <div className="mb-4 border p-4 rounded">
        <h2 className="text-xl font-semibold">Decisiones y Acuerdos</h2>
        <textarea
          name="decisiones"
          value={acta.decisiones}
          onChange={(e) => handleInputChange(e)}
          placeholder="Decisiones y acuerdos alcanzados"
          className="border p-2 w-full"
        />
      </div>

      <div className="mb-4 border p-4 rounded">
        <h2 className="text-xl font-semibold">Tareas Asignadas</h2>
        {acta.tareas.map((tarea, index) => (
          <div key={index} className="mb-4 p-2 border rounded">
            <input
              name="descripcion"
              value={tarea.descripcion}
              onChange={(e) => handleInputChange(e, index, "tareas")}
              placeholder="Descripción de la tarea"
              className="mb-2 border p-2 w-full"
            />
            <input
              name="responsable"
              value={tarea.responsable}
              onChange={(e) => handleInputChange(e, index, "tareas")}
              placeholder="Responsable"
              className="mb-2 border p-2 w-full"
            />
            <input
              type="date"
              name="fechaVencimiento"
              value={tarea.fechaVencimiento}
              onChange={(e) => handleInputChange(e, index, "tareas")}
              className="mb-2 border p-2 w-full"
            />
            <button
              onClick={() => removeItem(index, "tareas")}
              className="bg-red-500 text-white p-2 rounded"
            >
              Eliminar Tarea
            </button>
          </div>
        ))}
        <button
          onClick={() => addItem("tareas")}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Agregar Tarea
        </button>
      </div>

      <div className="flex justify-end gap-2 mb-4">
        <button
          onClick={() => handleSubmit("guardar")}
          className="bg-green-500 text-white p-2 rounded"
        >
          Guardar Acta
        </button>
        <button
          onClick={() => handleSubmit("enviar")}
          className="bg-yellow-500 text-white p-2 rounded"
        >
          Enviar para Aprobación
        </button>
        <button className="border p-2 rounded">Cancelar</button>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      {successMessage && <div className="text-green-500">{successMessage}</div>}
    </div>
  );
};

export default WriteProcedings;
