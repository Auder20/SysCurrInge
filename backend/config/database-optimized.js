const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    pool: {
      max: 10, // máximo de conexiones en el pool
      min: 2,  // mínimo de conexiones en el pool
      acquire: 30000, // tiempo máximo para adquirir una conexión (30 segundos)
      idle: 10000, // tiempo máximo que una conexión puede estar inactiva (10 segundos)
      evict: 1000 // verificar conexiones cada 1 segundo
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    },
    define: {
      timestamps: false,
      underscored: true,
      freezeTableName: true
    }
  }
);

// Health check para la base de datos
const checkDatabaseHealth = async () => {
  try {
    await sequelize.authenticate();
    return { status: 'healthy', message: 'Database connection successful' };
  } catch (error) {
    return { status: 'unhealthy', message: error.message };
  }
};

// Graceful shutdown
const closeDatabase = async () => {
  try {
    await sequelize.close();
    console.log('Database connection closed successfully');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
};

module.exports = { sequelize, checkDatabaseHealth, closeDatabase };
