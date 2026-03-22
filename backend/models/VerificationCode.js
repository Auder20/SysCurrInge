const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const VerificationCode = sequelize.define("VerificationCode", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expirationTime: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
}, {
  tableName: "verification_codes",
  timestamps: true,
});

module.exports = VerificationCode;
