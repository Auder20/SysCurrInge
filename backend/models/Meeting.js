const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Definimos el modelo de reunión
function createModelMeeting() {
  return sequelize.define(
    "Reunion",
    {
      id_reunion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nombre_reunion: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      fecha: {
        type: DataTypes.DATEONLY, // Para fechas sin tiempo
        allowNull: false,
      },
      ubicacion: {
        type: DataTypes.STRING(100),
        allowNull: true, // Puede ser null si no se proporciona ubicación
      },
      id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: true, // Puede ser null si no se asigna un usuario
        references: {
          model: "usuario", // La tabla referenciada (corregido de "Usuarios")
          key: "id_usuario", // La clave primaria de la tabla 'usuario'
        },
        onDelete: "SET NULL", // Si el usuario es eliminado, se establece en NULL
      },
    },
    {
      tableName: "reunion", // Especificamos el nombre de la tabla en la base de datos
      timestamps: false, // No estamos utilizando campos de timestamps como createdAt y updatedAt
    }
  );
}

const Meeting = createModelMeeting();

// Función para crear una nueva reunión
async function createNewMeeting(meetingData) {
  try {
    const meeting = await Meeting.create(meetingData);
    return meeting;
  } catch (error) {
    console.error("Error al crear la reunión:", error);
    throw error;
  }
}

// Función para obtener todas las reuniones
async function getAllMeetings() {
  try {
    const meetings = await Meeting.findAll(); // Obtiene todas las reuniones de la tabla
    return meetings;
  } catch (error) {
    console.error("Error al obtener todas las reuniones:", error);
    throw error;
  }
}

// Función para obtener una reunión por ID
async function getMeetingById(id) {
  try {
    const meeting = await Meeting.findByPk(id); // Busca la reunión por su ID
    return meeting;
  } catch (error) {
    console.error("Error al obtener la reunión por ID:", error);
    throw error;
  }
}

// Función para actualizar una reunión
async function updateMeeting(id, newMeetingData) {
  try {
    const meeting = await Meeting.findByPk(id);
    if (!meeting) {
      return null;
    }
    await meeting.update(newMeetingData);
    return meeting;
  } catch (error) {
    console.error("Error al actualizar la reunión:", error);
    throw error;
  }
}

// Función para eliminar una reunión
async function deleteMeeting(id) {
  try {
    const meeting = await Meeting.findByPk(id);
    if (!meeting) {
      return null;
    }
    await meeting.destroy();
    return { message: "Reunión eliminada con éxito." };
  } catch (error) {
    console.error("Error al eliminar la reunión:", error);
    throw error;
  }
}

// Función para obtener reuniones por ID de usuario
async function getMeetingsByUserId(id_usuario) {
  try {
    const meetings = await Meeting.findAll({
      where: { id_usuario },
      order: [['fecha', 'ASC']],
    });
    return meetings;
  } catch (error) {
    console.error("Error al obtener reuniones por usuario:", error);
    throw error;
  }
}

module.exports = {
  createNewMeeting,
  getAllMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
  getMeetingsByUserId,
};
