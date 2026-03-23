const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

// Importar modelos - ya están definidos, solo los exportamos
const User = require('./User');
const Task = require('./Task');
const Meeting = require('./Meeting');
const Agenda = require('./Agenda');
const VerificationCode = require('./VerificationCode');

// Setup associations (si existen)
const models = {
  User,
  Task,
  Meeting,
  Agenda,
  VerificationCode
};

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  sequelize,
  ...models
};
