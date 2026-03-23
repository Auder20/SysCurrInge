const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Definimos el modelo de usuario
function createModelUser() {
  return sequelize.define(
    "Usuario",
    {
      id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      apellido: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      correo_electronico: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      contrasena: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rol: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tipo_usuario: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "usuario",
      timestamps: false,
    }
  );
}

const User = createModelUser();

async function findByEmail(correo) {
  try {
    const user = await User.findOne({
      where: { correo_electronico: correo },
    });
    return user;
  } catch (error) {
    console.error("Error al buscar el usuario por correo electrónico:", error);
    throw error;
  }
}

async function createNewUser(userNew) {
  try {
    const user = await User.create(userNew);
    return user;
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    throw error;
  }
}

// Verifica si existe un usuario con rol "administrador"
async function existsAdminUser() {
  try {
    const adminUser = await User.findOne({
      where: { rol: "administrador" },
    });

    // Si se encuentra un administrador, retorna true, sino false
    return !!adminUser; // Retorna true si hay un administrador, false si no
  } catch (error) {
    console.error(
      "Error al buscar un usuario con rol de administrador:",
      error
    );
    throw error;
  }
}

async function getAllUsers() {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['contrasena'] }
    });
    return users;
  } catch (error) {
    console.error("Error al obtener todos los usuarios:", error);
    throw error;
  }
}

async function getUserbyid(id) {
  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['contrasena'] }
    });
    return user;
  } catch (error) {
    console.error("Error al obtener el usuario por ID:", error);
    throw error;
  }
}

async function updateUserData(id, newUserData) {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return null;
    }
    await user.update(newUserData);
    return user;
  } catch (error) {
    console.error("Error al actualizar los datos del usuario:", error);
    throw error;
  }
}

async function deleteUserData(id) {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return null;
    }
    await user.destroy();
    return { message: "Usuario eliminado con éxito." };
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    throw error;
  }
}

// Función para buscar un usuario por su ID y rol
async function findUserByIdAndRole(id_usuario, rol) {
  try {
    // Buscar al usuario en la base de datos usando tanto el id como el rol
    const usuario = await User.findOne({
      where: {
        id_usuario: id_usuario,
        rol: rol, // Comprobamos que el rol coincida
      },
    });

    // Si el usuario no existe, devolver null
    if (!usuario) {
      return null; // No se encontró el usuario con ese ID y rol
    }

    return usuario; // Retorna el usuario encontrado
  } catch (error) {
    console.error("Error al buscar el usuario por ID y rol:", error);
    throw error; // En caso de error, lanzamos la excepción
  }
}

async function findUserById(id_usuario) {
  try {
    // Buscar al usuario en la base de datos solo usando el id_usuario
    const usuario = await User.findOne({
      where: {
        id_usuario: id_usuario, // Comprobamos solo el ID
      },
    });

    // Si el usuario no existe, devolver null
    if (!usuario) {
      return null; // No se encontró el usuario con ese ID
    }

    return usuario; // Retorna el usuario encontrado
  } catch (error) {
    console.error("Error al buscar el usuario por ID:", error);
    throw error; // En caso de error, lanzamos la excepción
  }
}

// Exportar tanto el modelo como las funciones
const UserModel = sequelize.define(
  "Usuario",
  {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    correo_electronico: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    contrasena: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo_usuario: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "usuario",
    timestamps: false,
  }
);

module.exports = UserModel;
