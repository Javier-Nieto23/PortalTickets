import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ticketRoutes from './routes/tickets.js';
import authRoutes from './routes/auth.js';
import hojasServicioRoutes from './routes/hojasServicio.js';
import clientesRoutes from './routes/clientes.js';
import equiposRoutes from './routes/equipos.js';
import empresasRoutes from './routes/empresas.js';
import pool from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Rutas
app.get('/', (req, res) => {
  res.json({
    message: 'API de Hojas de Servicio CAAST funcionando correctamente',
    version: '2.0.0',
    endpoints: {
      auth: '/api/auth',
      hojasServicio: '/api/hojas-servicio',
      clientes: '/api/clientes',
      equipos: '/api/equipos',
      empresas: '/api/empresas',
      tickets: '/api/tickets (legacy)'
    }
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/hojas-servicio', hojasServicioRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/equipos', equiposRoutes);
app.use('/api/empresas', empresasRoutes);
app.use('/api/tickets', ticketRoutes); // Legacy

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
