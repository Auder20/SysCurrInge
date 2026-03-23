const logger = require('../config/logger');

// Middleware para medir tiempo de respuesta
const requestTime = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'warn' : 'info';
    
    logger.log(logLevel, {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  });
  
  next();
};

// Middleware para detectar peticiones lentas
const slowRequestDetector = (threshold = 1000) => {
  return (req, res, next) => {
    const start = Date.now();
    
    const originalSend = res.send;
    res.send = function(data) {
      const duration = Date.now() - start;
      
      if (duration > threshold) {
        logger.warn('Slow request detected', {
          method: req.method,
          url: req.originalUrl,
          duration: `${duration}ms`,
          threshold: `${threshold}ms`
        });
      }
      
      return originalSend.call(this, data);
    };
    
    next();
  };
};

// Middleware para health checks
const healthCheck = async (req, res) => {
  try {
    const health = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100
      },
      version: process.env.npm_package_version || '1.0.0'
    };

    res.status(200).json(health);
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: 'Service unavailable'
    });
  }
};

// Middleware para readiness check
const readinessCheck = async (req, res) => {
  try {
    // Verificar conexión a base de datos
    const sequelize = require('../config/database');
    await sequelize.authenticate();
    
    res.status(200).json({
      status: 'READY',
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    logger.error('Readiness check failed:', error);
    res.status(503).json({
      status: 'NOT_READY',
      timestamp: new Date().toISOString(),
      database: 'disconnected'
    });
  }
};

module.exports = {
  requestTime,
  slowRequestDetector,
  healthCheck,
  readinessCheck
};
