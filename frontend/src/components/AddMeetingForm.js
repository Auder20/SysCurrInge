import React, { useState } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useAdmin from "../hooks/useAdmin"; // Asumimos que tienes un hook similar a useAdmin

const AddMeetingForm = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [userId, setUserId] = useState(""); // ID del organizador
  const navigate = useNavigate();
  const { addMeeting } = useAdmin(); // Asumimos que tienes un hook similar a useAdmin con la función addMeeting

  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que todos los campos estén completos
    if (!title || !date || !userId) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    // Objeto nueva reunión a enviar
    const newMeeting = {
      nombre_reunion: title,
      fecha: date,
      ubicacion: location,
      id_usuario: parseInt(userId), // Asegurarse de que el ID sea un número
    };

    try {
      // Llamar a la función addMeeting del hook useAdmin
      const res = await addMeeting(newMeeting); // Esto llama a tu función que hace la petición al servidor

      // Comprobamos si la respuesta es exitosa
      if (res && res.message) {
        // Limpiar los campos del formulario
        setTitle("");
        setDate("");
        setLocation("");
        setUserId("");

        alert("Reunión agregada con éxito!");
        navigate(-1); // Regresar a la página anterior
      } else {
        alert(res.message || "Error desconocido al agregar la reunión.");
      }
    } catch (err) {
      console.error("Error al registrar la reunión:", err);
      alert("Error al registrar la reunión.");
    }
  };

  // Función para cancelar el formulario
  const handleCancel = () => {
    setTitle("");
    setDate("");
    setLocation("");
    navigate(-1); // Regresar a la página anterior
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center mb-4">Agregar Nueva Reunión</h2>

          <Form onSubmit={handleSubmit} className="shadow p-4 bg-light rounded">
            <Form.Group controlId="formTitle">
              <Form.Label>Título de la Reunión</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el título de la reunión"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formDate" className="mt-3">
              <Form.Label>Fecha de la Reunión</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formLocation" className="mt-3">
              <Form.Label>Ubicación</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la ubicación"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formUserId" className="mt-3">
              <Form.Label>ID del Organizador</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ingrese el ID del organizador"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-between mt-4">
              <Button
                variant="secondary"
                onClick={handleCancel}
                className="w-48"
              >
                Cancelar
              </Button>
              <Button variant="primary" type="submit" className="w-48">
                Agregar Reunión
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddMeetingForm;
