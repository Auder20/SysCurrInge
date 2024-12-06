const express = require("express");
const cors = require("cors");
const authRoute = require("./routes/authRoute");
const registerRoute = require("./routes/registerRoute");
const adminRoute = require("./routes/adminRoute");
const app = express();
const PORT = process.env.PORT || 5001;

// Configuración de CORS
app.use(cors());

// Middleware para analizar cuerpos JSON
app.use(express.json());

// Rutas
app.use("/api/auth", authRoute);
app.use("/api/register", registerRoute);
app.use("/api/admin", adminRoute);

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
