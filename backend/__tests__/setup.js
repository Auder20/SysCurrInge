require('dotenv').config({ path: '.env.test' });

// Mock de sequelize para testing
jest.mock('../config/database', () => ({
  authenticate: jest.fn(() => Promise.resolve()),
  sync: jest.fn(() => Promise.resolve()),
  close: jest.fn(() => Promise.resolve())
}));

// Mock de nodemailer para testing
jest.mock('../services/emailService', () => ({
  sendVerificationEmail: jest.fn(() => Promise.resolve()),
  generateVerificationCode: jest.fn(() => ({
    code: '123456',
    expirationTime: Date.now() + 15 * 60 * 1000
  }))
}));

// Configuración global para tests
beforeAll(async () => {
  // Configuración previa a los tests
});

afterAll(async () => {
  // Limpieza después de los tests
});

beforeEach(() => {
  // Resetear mocks antes de cada test
  jest.clearAllMocks();
});
