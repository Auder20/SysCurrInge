const UserModel = require('./User');
const bcrypt = require('bcryptjs');
const logger = require('../config/logger');

// Función para buscar un usuario por email
const findByEmail = async (email) => {
  try {
    const user = await UserModel.findOne({ where: { correo_electronico: email } });
    return user;
  } catch (error) {
    logger.error("Error al buscar usuario por email:", error);
    throw error;
  }
};

// Función para crear un nuevo usuario
const createNewUser = async (userData) => {
  try {
    const newUser = await UserModel.create(userData);
    return newUser;
  } catch (error) {
    logger.error("Error al crear usuario:", error);
    throw error;
  }
};

// Función para verificar si existe un administrador
const existsAdminUser = async () => {
  try {
    const adminUser = await UserModel.findOne({ where: { rol: 'administrador' } });
    return adminUser !== null;
  } catch (error) {
    logger.error("Error al verificar si existe admin:", error);
    throw error;
  }
};

// Función para obtener todos los usuarios
const getAllUsers = async () => {
  try {
    const users = await UserModel.findAll();
    return users;
  } catch (error) {
    logger.error("Error al obtener usuarios:", error);
    throw error;
  }
};

// Función para obtener usuario por ID
const getUserbyid = async (id) => {
  try {
    const user = await UserModel.findByPk(id);
    return user;
  } catch (error) {
    logger.error("Error al obtener usuario por ID:", error);
    throw error;
  }
};

// Función para actualizar datos del usuario
const updateUserData = async (id, userData) => {
  try {
    const updatedUser = await UserModel.update(userData, { where: { id_usuario: id } });
    return updatedUser;
  } catch (error) {
    logger.error("Error al actualizar usuario:", error);
    throw error;
  }
};

// Función para eliminar usuario
const deleteUserData = async (id) => {
  try {
    const deletedUser = await UserModel.destroy({ where: { id_usuario: id } });
    return deletedUser;
  } catch (error) {
    logger.error("Error al eliminar usuario:", error);
    throw error;
  }
};

// Función para buscar usuario por ID y rol
const findUserByIdAndRole = async (id, role) => {
  try {
    const user = await UserModel.findOne({ where: { id_usuario: id, rol: role } });
    return user;
  } catch (error) {
    logger.error("Error al buscar usuario por ID y rol:", error);
    throw error;
  }
};

// Alias para findUserById
const findUserById = getUserbyid;

module.exports = {
  findByEmail,
  createNewUser,
  existsAdminUser,
  getAllUsers,
  getUserbyid,
  updateUserData,
  deleteUserData,
  findUserByIdAndRole,
  findUserById,
};
