const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

// Importar modelos
const User = require('./User');
const Task = require('./Task');
const Meeting = require('./Meeting');
const Agenda = require('./Agenda');
const VerificationCode = require('./VerificationCode');

// Inicializar modelos
const models = {
  User: User(sequelize, Sequelize.DataTypes),
  Task: Task(sequelize, Sequelize.DataTypes),
  Meeting: Meeting(sequelize, Sequelize.DataTypes),
  Agenda: Agenda(sequelize, Sequelize.DataTypes),
  VerificationCode: VerificationCode(sequelize, Sequelize.DataTypes)
};

// Setup associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  sequelize,
  ...models
};
