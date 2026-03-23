const request = require('supertest');
const express = require('express');
const authRoute = require('../../routes/authRoute');
const { login, getMe } = require('../../controllers/authController');

// Mock del controlador
jest.mock('../../controllers/authController');

describe('Auth Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRoute);
    jest.clearAllMocks();
  });

  describe('POST /api/auth/login', () => {
    it('debería llamar al controlador de login', async () => {
      const mockResponse = {
        auth: true,
        token: 'mock_token',
        rol: 'administrador',
        message: "Inicio de sesión exitoso",
        user: { id: 1, email: 'test@example.com' }
      };

      login.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(login).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
    });

    it('debería manejar errores de validación', async () => {
      login.mockImplementation((req, res) => {
        res.status(400).json({ error: "Email y contraseña son obligatorios" });
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' }); // falta password

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Email y contraseña son obligatorios");
    });
  });

  describe('GET /api/auth/me', () => {
    it('debería llamar al controlador getMe', async () => {
      const mockResponse = {
        user: { id: 1, email: 'test@example.com', rol: 'administrador' },
        message: "Información de usuario obtenida correctamente"
      };

      getMe.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .get('/api/auth/me');

      expect(getMe).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
    });

    it('debería manejar usuario no encontrado', async () => {
      getMe.mockImplementation((req, res) => {
        res.status(404).json({ error: "Usuario no encontrado" });
      });

      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Usuario no encontrado");
    });
  });
});
