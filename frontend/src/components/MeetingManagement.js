//gestion de reuniones
import React, { useState } from "react";

const MeetingManagement = () => {
  const [reuniones, setReuniones] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [lugar, setLugar] = useState("");

  const agregarReunion = (e) => {
    e.preventDefault();
    const nuevaReunion = {
      id: Date.now(),
      titulo,
      descripcion,
      fecha,
      lugar,
    };
    setReuniones([...reuniones, nuevaReunion]);
    setTitulo("");
    setDescripcion("");
    setFecha("");
    setLugar("");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Reuniones</h1>

      <form onSubmit={agregarReunion} className="mb-4">
        <input
          type="text"
          placeholder="Título de la Reunión"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          className="border p-2 mb-2 w-full"
        />
        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="datetime-local"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          placeholder="Lugar"
          value={lugar}
          onChange={(e) => setLugar(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Crear Reunión
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Lista de Reuniones</h2>
      <ul>
        {reuniones.map((reunion) => (
          <li key={reunion.id} className="border p-2 mb-2">
            <h3 className="font-bold">{reunion.titulo}</h3>
            <p>{reunion.descripcion}</p>
            <p>Fecha: {reunion.fecha}</p>
            <p>Lugar: {reunion.lugar}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MeetingManagement;
