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
  origin: [
    process.env.FRONTEND_URL || "https://sys-curringe.vercel.app",
    "http://localhost:3000",  // Para desarrollo local
    "http://localhost:3001"   // Para desarrollo local
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
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
app.get('/debug', async (req, res) => {
  try {
    const sequelize = require('./config/database');
    const { User, Task, Meeting } = require('./models');
    const userCount = await User.count();
    const taskCount = await Task.count();
    const meetingCount = await Meeting.count();
    
    res.json({
      users: userCount,
      tasks: taskCount,
      meetings: meetingCount,
      adminExists: await User.findOne({ where: { correo_electronico: 'admin@syscurringe.com' } }),
      env: {
        DATABASE_URL: process.env.DATABASE_URL ? '***CONFIGURADO***' : 'NO CONFIGURADO',
        DB_HOST: process.env.DB_HOST,
        DB_NAME: process.env.DB_NAME,
        DB_USER: process.env.DB_USER,
        NODE_ENV: process.env.NODE_ENV
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      env: {
        DATABASE_URL: process.env.DATABASE_URL ? '***CONFIGURADO***' : 'NO CONFIGURADO',
        DB_HOST: process.env.DB_HOST,
        DB_NAME: process.env.DB_NAME,
        DB_USER: process.env.DB_USER,
        NODE_ENV: process.env.NODE_ENV
      }
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
  
  // Ejecutar seed automáticamente en producción si es necesario
  if (process.env.NODE_ENV === 'production') {
    await runAutoSeed();
  }
});

// Función para seed automática
async function runAutoSeed() {
  try {
    logger.info('🗄️ Ejecutando seed automática en producción...');
    
    // Importar modelos
    const { User, Task, Meeting } = require('./models');
    
    // Verificar si ya existe el admin
    const adminExists = await User.findOne({ 
      where: { correo_electronico: 'admin@syscurringe.com' } 
    });
    
    if (!adminExists) {
      logger.info('📦 Creando usuarios iniciales...');
      
      const bcrypt = require('bcryptjs');
      const users = [
        {
          nombre: 'Admin',
          apellido: 'Sistema',
          correo_electronico: 'admin@syscurringe.com',
          contrasena: await bcrypt.hash('Admin123!', 10),
          rol: 'administrador',
          tipo_usuario: 'interno',
          estado: true
        },
        {
          nombre: 'Coordinador',
          apellido: 'Demo',
          correo_electronico: 'coordinador@syscurringe.com',
          contrasena: await bcrypt.hash('Coord123!', 10),
          rol: 'coordinador',
          tipo_usuario: 'interno',
          estado: true
        }
      ];
      
      for (const user of users) {
        try {
          await User.create(user);
          logger.info(`✅ Usuario creado: ${user.correo_electronico}`);
        } catch (error) {
          if (error.name === 'SequelizeUniqueConstraintError') {
            logger.info(`⏭ Usuario ya existe: ${user.correo_electronico}`);
          } else {
            logger.error(`❌ Error creando usuario: ${error.message}`);
          }
        }
      }
    }
    
    // Verificar si ya existen tareas
    const tasksCount = await Task.count();
    if (tasksCount === 0) {
      logger.info('📦 Creando tareas iniciales...');
      
      const tasks = [
        {
          descripcion: 'Configurar base de datos de producción',
          fecha_vencimiento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          estado: 'pendiente'
        },
        {
          descripcion: 'Revisar configuración de CORS',
          fecha_vencimiento: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          estado: 'en_progreso'
        }
      ];
      
      for (const task of tasks) {
        try {
          await Task.create(task);
          logger.info(`✅ Tarea creada: ${task.descripcion.substring(0, 30)}...`);
        } catch (error) {
          logger.error(`❌ Error creando tarea: ${error.message}`);
        }
      }
    }
    
    logger.info('🎉 Seed automática completada exitosamente!');
    
  } catch (error) {
    logger.error('❌ Error en seed automática:', error);
  }
}
