import React, { useState, useEffect } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";

const AddTaskForm = () => {
  const [descripcion, setDescripcion] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [estado, setEstado] = useState("pendiente");
  const [rolSeleccionado, setRolSeleccionado] = useState(""); // Tipo de usuario seleccionado
  const [usuarioId, setUsuarioId] = useState(""); // ID del usuario
  const [users, setUsers] = useState([]); // Lista de usuarios cargados
  const [loadingUsers, setLoadingUsers] = useState(false);
  const navigate = useNavigate();
  const { addTask, loadAllUsers } = useAdmin();

  // Cargar usuarios cuando el componente se monte
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const usersData = await loadAllUsers();
        setUsers(usersData || []);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [loadAllUsers]);

  // Filtrar usuarios por rol seleccionado
  const filteredUsers = users.filter(user => 
    user.rol === rolSeleccionado || user.tipo_usuario === rolSeleccionado
  );

  // Resetear usuarioId cuando cambia el rol seleccionado
  useEffect(() => {
    setUsuarioId("");
  }, [rolSeleccionado]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mostrar datos en consola para depuración
    console.log("Datos enviados: ", {
      descripcion,
      fecha_vencimiento: fechaVencimiento,
      estado,
      rolSeleccionado,
      id_usuario: usuarioId,
    });

    // Objeto nueva tarea a enviar
    const nuevaTarea = {
      descripcion,
      fecha_vencimiento: fechaVencimiento,
      estado,
      id_usuario: parseInt(usuarioId),
      rol: rolSeleccionado, // Enviar el rol del usuario seleccionado
    };

    try {
      // Llamar a la función addTask del hook useAdmin
      const res = await addTask(nuevaTarea); // Esto llama a tu función que hace la petición al servidor

      // Comprobamos si la respuesta es exitosa (status 200-299)
      if (res && res.message) {
        if (res.message === "Tarea creada exitosamente") {
          // Limpiar el formulario si la tarea se creó correctamente
          setDescripcion("");
          setFechaVencimiento("");
          setUsuarioId("");
          setRolSeleccionado("");
          setEstado("pendiente");

          // Mostrar alerta de éxito
          alert("La tarea fue registrada con éxito.");

          // Redirigir a la página de listado de tareas
          navigate(-1);
        } else {
          alert(res.message || "Error desconocido al agregar la tarea.");
        }
      }
    } catch (err) {
      // Manejar cualquier error de la petición
      console.error("Error en el envío de la tarea:", err.message);
      alert("Hubo un error al enviar la tarea.");
    }
  };

  const handleCancel = () => {
    setDescripcion("");
    setFechaVencimiento("");
    setUsuarioId("");
    setRolSeleccionado("");
    setEstado("pendiente");
    navigate(-1); // Regresar a la página anterior
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center mb-4">Agregar Nueva Tarea</h2>

          <Form onSubmit={handleSubmit} className="shadow p-4 bg-light rounded">
            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Descripción de la tarea"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formFechaVencimiento" className="mt-3">
              <Form.Label>Fecha de Vencimiento</Form.Label>
              <Form.Control
                type="date"
                value={fechaVencimiento}
                onChange={(e) => setFechaVencimiento(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formRol" className="mt-3">
              <Form.Label>Tipo de Usuario</Form.Label>
              <Form.Control
                as="select"
                value={rolSeleccionado}
                onChange={(e) => setRolSeleccionado(e.target.value)}
                required
              >
                <option value="">Selecciona un rol</option>
                <option value="administrador">Administrador</option>
                <option value="coordinador">Coordinador</option>
                <option value="participante">Participante</option>
              </Form.Control>
            </Form.Group>

            {rolSeleccionado && (
              <Form.Group controlId="formUsuarioId" className="mt-3">
                <Form.Label>Seleccionar Usuario</Form.Label>
                {loadingUsers ? (
                  <Form.Control>
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                    Cargando usuarios...
                  </Form.Control>
                ) : filteredUsers.length === 0 ? (
                  <Form.Control>
                    No hay usuarios disponibles para este rol
                  </Form.Control>
                ) : (
                  <Form.Control
                    as="select"
                    value={usuarioId}
                    onChange={(e) => setUsuarioId(e.target.value)}
                    required
                  >
                    <option value="">Selecciona un usuario</option>
                    {filteredUsers.map((user) => (
                      <option key={user.id_usuario} value={user.id_usuario}>
                        {user.nombre} {user.apellido} ({user.correo_electronico})
                      </option>
                    ))}
                  </Form.Control>
                )}
              </Form.Group>
            )}

            <div className="d-flex justify-content-between mt-4">
              <Button
                variant="secondary"
                onClick={handleCancel}
                className="w-48"
              >
                Cancelar
              </Button>
              <Button variant="primary" type="submit" className="w-48">
                Agregar Tarea
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddTaskForm;
