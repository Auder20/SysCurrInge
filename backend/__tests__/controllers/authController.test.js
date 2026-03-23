const { login, getMe } = require('../../controllers/authController');
const { findByEmail, findUserById } = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock de los modelos
jest.mock('../../models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      user: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('debería retornar error 400 si faltan email o contraseña', async () => {
      req.body = { email: 'test@example.com' }; // falta password

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Email y contraseña son obligatorios"
      });
    });

    it('debería retornar error 401 si el usuario no existe', async () => {
      req.body = { email: 'nonexistent@example.com', password: 'password123' };
      findByEmail.mockResolvedValue(null);

      await login(req, res);

      expect(findByEmail).toHaveBeenCalledWith('nonexistent@example.com');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "Credenciales incorrectas"
      });
    });

    it('debería retornar error 401 si la contraseña es incorrecta', async () => {
      const mockUser = {
        id_usuario: 1,
        email: 'test@example.com',
        contrasena: 'hashedPassword',
        rol: 'administrador',
        tipo_usuario: null,
        toJSON: jest.fn().mockReturnValue({
          id_usuario: 1,
          email: 'test@example.com',
          contrasena: 'hashedPassword',
          rol: 'administrador',
          tipo_usuario: null
        })
      };

      req.body = { email: 'test@example.com', password: 'wrongpassword' };
      findByEmail.mockResolvedValue(mockUser);
      bcrypt.compareSync.mockReturnValue(false);

      await login(req, res);

      expect(bcrypt.compareSync).toHaveBeenCalledWith('wrongpassword', 'hashedPassword');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "Credenciales incorrectas"
      });
    });

    it('debería iniciar sesión exitosamente con credenciales correctas', async () => {
      const mockUser = {
        id_usuario: 1,
        email: 'test@example.com',
        contrasena: 'hashedPassword',
        rol: 'administrador',
        tipo_usuario: null,
        toJSON: jest.fn().mockReturnValue({
          id_usuario: 1,
          email: 'test@example.com',
          contrasena: 'hashedPassword',
          rol: 'administrador',
          tipo_usuario: null
        })
      };

      const expectedToken = 'mocked_jwt_token';

      req.body = { email: 'test@example.com', password: 'correctpassword' };
      findByEmail.mockResolvedValue(mockUser);
      bcrypt.compareSync.mockReturnValue(true);
      jwt.sign.mockReturnValue(expectedToken);

      await login(req, res);

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 1, role: 'administrador', type_user: null },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        auth: true,
        token: expectedToken,
        rol: 'administrador',
        message: "Inicio de sesión exitoso",
        user: {
          id_usuario: 1,
          email: 'test@example.com',
          rol: 'administrador',
          tipo_usuario: null
        }
      });
    });

    it('debería manejar errores internos del servidor', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      findByEmail.mockRejectedValue(new Error('Database error'));

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Error interno del servidor"
      });
    });
  });

  describe('getMe', () => {
    it('debería retornar error 404 si el usuario no existe', async () => {
      req.user = { id: 1 };
      findUserById.mockResolvedValue(null);

      await getMe(req, res);

      expect(findUserById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Usuario no encontrado"
      });
    });

    it('debería retornar información del usuario exitosamente', async () => {
      const mockUser = {
        id_usuario: 1,
        email: 'test@example.com',
        contrasena: 'hashedPassword',
        rol: 'administrador',
        tipo_usuario: null,
        toJSON: jest.fn().mockReturnValue({
          id_usuario: 1,
          email: 'test@example.com',
          contrasena: 'hashedPassword',
          rol: 'administrador',
          tipo_usuario: null
        })
      };

      req.user = { id: 1 };
      findUserById.mockResolvedValue(mockUser);

      await getMe(req, res);

      expect(findUserById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        user: {
          id_usuario: 1,
          email: 'test@example.com',
          rol: 'administrador',
          tipo_usuario: null
        },
        message: "Información de usuario obtenida correctamente"
      });
    });

    it('debería manejar errores internos del servidor', async () => {
      req.user = { id: 1 };
      findUserById.mockRejectedValue(new Error('Database error'));

      await getMe(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Error interno del servidor"
      });
    });
  });
});
