const {
  register,
  validateAdminRole,
  generateCode,
  verifyCode
} = require('../../controllers/registerController');
const {
  findByEmail,
  createNewUser,
  existsAdminUser
} = require('../../models/User');
const VerificationCode = require('../../models/VerificationCode');
const bcrypt = require('bcryptjs');
const {
  generateVerificationCode,
  sendVerificationEmail
} = require('../../services/emailService');

// Mock de los modelos y servicios
jest.mock('../../models/User');
jest.mock('../../models/VerificationCode');
jest.mock('bcryptjs');
jest.mock('../../services/emailService');

describe('RegisterController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('validateAdminRole', () => {
    it('debería retornar true si existe un administrador', async () => {
      existsAdminUser.mockResolvedValue(true);

      await validateAdminRole(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(true);
    });

    it('debería retornar false si no existe un administrador', async () => {
      existsAdminUser.mockResolvedValue(false);

      await validateAdminRole(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(false);
    });

    it('debería manejar errores del servidor', async () => {
      existsAdminUser.mockRejectedValue(new Error('Database error'));

      await validateAdminRole(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Error al verificar administrador. Inténtalo de nuevo."
      });
    });
  });

  describe('generateCode', () => {
    it('debería retornar error 400 si no se proporciona email', async () => {
      req.body = {};

      await generateCode(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "El correo electrónico es obligatorio."
      });
    });

    it('debería retornar error 400 si el email no tiene formato válido', async () => {
      req.body = { email: 'email-invalido' };

      await generateCode(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "El formato del correo electrónico no es válido."
      });
    });

    it('debería generar y enviar código de verificación exitosamente', async () => {
      const mockCodeData = {
        code: '123456',
        expirationTime: Date.now() + 15 * 60 * 1000
      };

      req.body = { email: 'test@example.com' };
      generateVerificationCode.mockReturnValue(mockCodeData);
      sendVerificationEmail.mockResolvedValue();
      VerificationCode.upsert.mockResolvedValue();

      await generateCode(req, res);

      expect(generateVerificationCode).toHaveBeenCalled();
      expect(sendVerificationEmail).toHaveBeenCalledWith('test@example.com', '123456');
      expect(VerificationCode.upsert).toHaveBeenCalledWith({
        email: 'test@example.com',
        code: '123456',
        expirationTime: mockCodeData.expirationTime
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Código de verificación enviado al correo."
      });
    });

    it('debería manejar errores al enviar el código', async () => {
      req.body = { email: 'test@example.com' };
      generateVerificationCode.mockReturnValue({ code: '123456', expirationTime: Date.now() + 15 * 60 * 1000 });
      sendVerificationEmail.mockRejectedValue(new Error('Email service error'));

      await generateCode(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "No se pudo enviar el código de verificación. Intenta de nuevo."
      });
    });
  });

  describe('verifyCode', () => {
    it('debería retornar error 400 si no se encuentra código para el email', async () => {
      req.body = { email: 'test@example.com', code: '123456' };
      VerificationCode.findOne.mockResolvedValue(null);

      await verifyCode(req, res);

      expect(VerificationCode.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "No se encontró un código de verificación para este correo."
      });
    });

    it('debería retornar error 400 si el código ha expirado', async () => {
      const expiredCode = {
        code: '123456',
        expirationTime: Date.now() - 1000 // expirado
      };

      req.body = { email: 'test@example.com', code: '123456' };
      VerificationCode.findOne.mockResolvedValue(expiredCode);
      VerificationCode.destroy.mockResolvedValue();

      await verifyCode(req, res);

      expect(VerificationCode.destroy).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "El código ha expirado. Solicita uno nuevo."
      });
    });

    it('debería retornar error 400 si el código es incorrecto', async () => {
      const validCode = {
        code: '654321',
        expirationTime: Date.now() + 15 * 60 * 1000
      };

      req.body = { email: 'test@example.com', code: '123456' };
      VerificationCode.findOne.mockResolvedValue(validCode);

      await verifyCode(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Código de verificación incorrecto."
      });
    });

    it('debería verificar código exitosamente', async () => {
      const validCode = {
        code: '123456',
        expirationTime: Date.now() + 15 * 60 * 1000
      };

      req.body = { email: 'test@example.com', code: '123456' };
      VerificationCode.findOne.mockResolvedValue(validCode);
      VerificationCode.destroy.mockResolvedValue();

      await verifyCode(req, res);

      expect(VerificationCode.destroy).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Código de verificación correcto."
      });
    });
  });

  describe('register', () => {
    it('debería retornar error 400 si faltan campos obligatorios', async () => {
      req.body = {
        name: 'John',
        lastname: 'Doe',
        email: 'test@example.com'
        // faltan password y role
      };

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Todos los campos son obligatorios."
      });
    });

    it('debería retornar error 400 si el email no tiene formato válido', async () => {
      req.body = {
        name: 'John',
        lastname: 'Doe',
        email: 'email-invalido',
        password: 'password123',
        role: 'administrador'
      };

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "El formato del correo electrónico no es válido."
      });
    });

    it('debería retornar error 400 si la contraseña es muy corta', async () => {
      req.body = {
        name: 'John',
        lastname: 'Doe',
        email: 'test@example.com',
        password: '123',
        role: 'administrador'
      };

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "La contraseña debe tener al menos 8 caracteres."
      });
    });

    it('debería retornar error 400 si el rol no es válido', async () => {
      req.body = {
        name: 'John',
        lastname: 'Doe',
        email: 'test@example.com',
        password: 'password123',
        role: 'rol_invalido'
      };

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "El rol especificado no es válido."
      });
    });

    it('debería retornar error 400 si el email ya está registrado', async () => {
      req.body = {
        name: 'John',
        lastname: 'Doe',
        email: 'test@example.com',
        password: 'password123',
        role: 'administrador'
      };
      findByEmail.mockResolvedValue({ id: 1 });

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Este correo ya está registrado."
      });
    });

    it('debería registrar usuario exitosamente', async () => {
      req.body = {
        name: 'John',
        lastname: 'Doe',
        email: 'test@example.com',
        password: 'password123',
        role: 'administrador',
        userType: 'moderador'
      };
      findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      createNewUser.mockResolvedValue();

      await register(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(createNewUser).toHaveBeenCalledWith({
        nombre: 'John',
        apellido: 'Doe',
        correo_electronico: 'test@example.com',
        contrasena: 'hashedPassword',
        rol: 'administrador',
        tipo_usuario: 'moderador'
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Registro exitoso. Redirigiendo..."
      });
    });

    it('debería manejar errores al registrar usuario', async () => {
      req.body = {
        name: 'John',
        lastname: 'Doe',
        email: 'test@example.com',
        password: 'password123',
        role: 'administrador'
      };
      findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockRejectedValue(new Error('Hash error'));

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Hubo un error al registrar al usuario. Inténtalo de nuevo."
      });
    });
  });
});
