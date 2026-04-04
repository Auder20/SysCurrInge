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
const requiredEnvVars = ['JWT_SECRET', 'DATABASE_URL'];
const missingVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingVars.length > 0) {
  logger.error(`❌ Variables de entorno faltantes: ${missingVars.join(', ')}`);
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
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://syscurringe.onrender.com", "http://localhost:5001"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      manifestSrc: ["'self'"]
    },
  },
  crossOriginEmbedderPolicy: false,
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

// Configuración de CORS basado en entorno
const corsOrigins = {
  development: ['http://localhost:3000', 'http://localhost:3001'],
  production: ['https://syscurringe.onrender.com', 'https://syscurringe.vercel.app'],
  test: []
};

const allowedOrigins = corsOrigins[process.env.NODE_ENV] || corsOrigins.development;

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware para analizar cuerpos JSON
app.use(express.json());

// Aplicar rate limiters a rutas específicas
app.use('/api/auth/login', loginLimiter);
app.use('/api/register/send-verification-code', codeLimiter);
app.use('/api/register/verify-code', verifyLimiter);

const authMiddleware = require('./middleware/authMiddleware');
const roleMiddleware = require('./middleware/roleMiddleware');

// Rutas de health checks
app.get('/health', healthCheck);
app.get('/ready', readinessCheck);
app.get('/debug', authMiddleware, roleMiddleware(['administrador']), async (req, res) => {
  try {
    // Importar modelos y verificar conexión
    const sequelize = require('./config/database');
    const { User, Task, Meeting } = require('./models');
    
    // Probar conexión a la base de datos
    await sequelize.authenticate();
    
    // Contar usuarios
    const userCount = await User.count();
    const taskCount = await Task.count();
    const meetingCount = await Meeting.count();
    
    // Verificar si existe admin
    const adminUser = await User.findOne({ 
      where: { correo_electronico: 'admin@syscurringe.com' } 
    });
    
    res.json({
      message: "Configuración de base de datos",
      database_connection: "OK",
      database_url: process.env.DATABASE_URL ? '***CONFIGURADA***' : 'NO CONFIGURADA',
      database_url_length: process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0,
      users: {
        total: userCount,
        admin_exists: !!adminUser,
        admin_email: adminUser ? adminUser.correo_electronico : 'NO ENCONTRADO'
      },
      tasks: taskCount,
      meetings: meetingCount,
      env: {
        DATABASE_URL: process.env.DATABASE_URL ? '***CONFIGURADA***' : 'NO CONFIGURADA',
        NODE_ENV: process.env.NODE_ENV || 'NO DEFINIDO'
      },
      render_vars: Object.keys(process.env).filter(key => 
        key.includes('DATABASE') || key.includes('NODE_ENV')
      )
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      message: "Error al verificar configuración"
    });
  }
});

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
app.listen(PORT, async () => {
  logger.info(`Servidor corriendo en http://localhost:${PORT}`);
  logger.info(`Entorno: ${process.env.NODE_ENV || 'development'}`);

  // Ejecutar seed si RUN_SEED=true está en las variables de entorno
  if (process.env.RUN_SEED === 'true') {
    await runAutoSeed();
  }
});

// Función para seed automática — delega al seed.js principal
async function runAutoSeed() {
  try {
    logger.info('🗄️ Iniciando seed desde seed.js...');
    const seed = require('./seed.js');
    await seed();
    logger.info('🎉 Seed completada exitosamente.');
  } catch (error) {
    logger.error('❌ Error en seed:', error.message);
  }
}