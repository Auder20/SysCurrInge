const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Modelo de Agenda
const Agenda = sequelize.define(
  "Agenda",
  {
    id_agenda: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    id_reunion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    responsable: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    tiempo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    estado: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'pendiente',
    },
  },
  {
    tableName: "agenda",
    timestamps: true,
  }
);

// Función para crear un nuevo item de agenda
async function createAgendaItem(agendaData) {
  try {
    const agendaItem = await Agenda.create(agendaData);
    return agendaItem;
  } catch (error) {
    console.error("Error al crear item de agenda:", error);
    throw error;
  }
}

// Función para obtener agenda por ID de reunión
async function getAgendaByMeetingId(id_reunion) {
  try {
    const agendaItems = await Agenda.findAll({
      where: { id_reunion },
      order: [["id_agenda", "ASC"]],
    });
    return agendaItems;
  } catch (error) {
    console.error("Error al obtener agenda por reunión:", error);
    throw error;
  }
}

// Función para guardar múltiples items de agenda
async function saveAgendaItems(agendaItems) {
  try {
    const results = await Agenda.bulkCreate(agendaItems, {
      updateOnDuplicate: ["titulo", "descripcion", "responsable", "tiempo", "estado"],
    });
    return results;
  } catch (error) {
    console.error("Error al guardar items de agenda:", error);
    throw error;
  }
}

// Función para eliminar agenda por reunión
async function deleteAgendaByMeetingId(id_reunion) {
  try {
    const deletedCount = await Agenda.destroy({
      where: { id_reunion },
    });
    return deletedCount;
  } catch (error) {
    console.error("Error al eliminar agenda por reunión:", error);
    throw error;
  }
}

// Función para actualizar un item de agenda
async function updateAgendaItem(id_agenda, agendaData) {
  try {
    const agendaItem = await Agenda.findByPk(id_agenda);
    if (!agendaItem) {
      return null;
    }
    await agendaItem.update(agendaData);
    return agendaItem;
  } catch (error) {
    console.error("Error al actualizar item de agenda:", error);
    throw error;
  }
}

// Función para eliminar un item de agenda
async function deleteAgendaItem(id_agenda) {
  try {
    const agendaItem = await Agenda.findByPk(id_agenda);
    if (!agendaItem) {
      return null;
    }
    await agendaItem.destroy();
    return { message: "Item de agenda eliminado con éxito." };
  } catch (error) {
    console.error("Error al eliminar item de agenda:", error);
    throw error;
  }
}

module.exports = Agenda;
