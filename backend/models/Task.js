const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Modelo de Tarea
const Task = sequelize.define(
  "Tarea",
  {
    id_tarea: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    fecha_vencimiento: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM("pendiente", "en_progreso", "completada"),
      defaultValue: "pendiente",
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "tarea",
    timestamps: false,
  }
);

module.exports = Task;
