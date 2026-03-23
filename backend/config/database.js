// /config/database.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

// Usar DATABASE_URL si existe, sino variables separadas
const databaseUrl = process.env.DATABASE_URL;

const sequelize = databaseUrl 
  ? new Sequelize(databaseUrl, {
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      dialect: 'postgres',
      dialectOptions: {
        ssl: databaseUrl.includes('render.com') ? {
          require: true,
          rejectUnauthorized: false
        } : {
          require: true,
          rejectUnauthorized: false
        }
      },
      define: {
        timestamps: false,
        underscored: true,
        freezeTableName: true
      },
      pool: {
        max: 10,
        min: 2,
        acquire: 30000,
        idle: 10000
      }
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASS,
      {
        host: process.env.DB_HOST,
        dialect: "postgres",
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        define: {
          timestamps: false,
          underscored: true,
          freezeTableName: true
        },
        pool: {
          max: 10,
          min: 2,
          acquire: 30000,
          idle: 10000
        },
        dialectOptions: {
          ssl: process.env.DB_HOST?.includes('render.com') ? {
            require: true,
            rejectUnauthorized: false
          } : {
            require: true,
            rejectUnauthorized: false
          }
        }
      }
    );

module.exports = sequelize;
