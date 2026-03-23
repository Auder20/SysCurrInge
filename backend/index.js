const express = require("express");
const cors = require("cors");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

const logger = require('./config/logger');
const { requestTime, slowRequestDetector, healthCheck, readinessCheck } = require('./middleware/performance');

const authRoute = require("./routes/authRoute");
const registerRoute = require("./routes/registerRoute");
const adminRoute = require("./routes/adminRoute");
const userRoute = require("./routes/userRoute");
const coordinatorRoute = require("./routes/coordinatorRoute");

// Validar variables de entorno requeridas
const requiredEnvVars = ['JWT_SECRET', 'DB_NAME', 'DB_USER', 'DB_PASS', 'DB_HOST'];
const missingVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingVars.length > 0) {
  console.error(`❌ Variables de entorno faltantes: ${missingVars.join(', ')}`);
  console.error('Revisa tu archivo .env');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware de logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
}

// Performance middleware
app.use(requestTime);
app.use(slowRequestDetector(1000)); // Alertar si una petición toma más de 1 segundo

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Desactiva CSP — el frontend React maneja su propio CSP
  crossOriginEmbedderPolicy: false, // Necesario si usas imágenes o recursos externos
}));

// Compression middleware
app.use(compression());

// Configuración de rate limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máx 10 intentos por IP en 15 min
  message: { error: 'Demasiados intentos de login. Intenta en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const codeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // máx 5 códigos por IP por hora
  message: { error: 'Demasiadas solicitudes de código. Intenta en 1 hora.' },
});

const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos (mismo que la expiración del código)
  max: 5, // máx 5 intentos de verificación por IP
  message: { error: 'Demasiados intentos de verificación. Solicita un nuevo código.' },
});

// Configuración de CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || "https://sys-curringe.vercel.app",
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middleware para analizar cuerpos JSON
app.use(express.json());

// Aplicar rate limiters a rutas específicas
app.use('/api/auth/login', loginLimiter);
app.use('/api/register/send-verification-code', codeLimiter);
app.use('/api/register/verify-code', verifyLimiter);

// Rutas de health checks
app.get('/health', healthCheck);
app.get('/ready', readinessCheck);

// Rutas
app.use("/api/auth", authRoute);
app.use("/api/register", registerRoute);
app.use("/api/admin", adminRoute);
app.use("/api/user", userRoute);
app.use("/api/coordinator", coordinatorRoute);

// Ruta básica para la raíz
app.get('/', (req, res) => {
  res.send('¡Bienvenido al Backend!'); // O lo que quieras que se muestre en la raíz
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });
  res.status(500).json({ error: "Algo salió mal. Intenta de nuevo." });
});

// Iniciar servidor
app.listen(PORT, () => {
  logger.info(`Servidor corriendo en http://localhost:${PORT}`);
  logger.info(`Entorno: ${process.env.NODE_ENV || 'development'}`);
});
