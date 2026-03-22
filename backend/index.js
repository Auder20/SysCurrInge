const express = require("express");
const cors = require("cors");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoute = require("./routes/authRoute");
const registerRoute = require("./routes/registerRoute");
const adminRoute = require("./routes/adminRoute");
const userRoute = require("./routes/userRoute");
const coordinatorRoute = require("./routes/coordinatorRoute");
const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(helmet());

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

// Configuración de CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middleware para analizar cuerpos JSON
app.use(express.json());

// Aplicar rate limiters a rutas específicas
app.use('/api/auth/login', loginLimiter);
app.use('/api/register/send-verification-code', codeLimiter);

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

// Middleware de manejo de errores (opcional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Algo salió mal. Intenta de nuevo." });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
