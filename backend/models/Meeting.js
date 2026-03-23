const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Modelo de Reunión
const Meeting = sequelize.define(
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
      allowNull: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "reunion",
    timestamps: false,
  }
);

module.exports = Meeting;
