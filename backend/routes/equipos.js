import express from 'express';
import { verificarToken } from '../middleware/auth.js';
import {
  crearEquipo,
  crearEquipoManual,
  obtenerMisEquipos,
  obtenerTodosLosEquipos,
  obtenerEquipoPorId,
  actualizarEquipo,
  eliminarEquipo
} from '../controllers/equipoController.js';

const router = express.Router();

// Rutas protegidas - requieren autenticación
router.post('/', verificarToken, crearEquipo);
router.post('/manual', verificarToken, crearEquipoManual);
router.get('/mis-equipos', verificarToken, obtenerMisEquipos);
router.get('/todos', verificarToken, obtenerTodosLosEquipos);
router.get('/:id', verificarToken, obtenerEquipoPorId);
router.put('/:id', verificarToken, actualizarEquipo);
router.delete('/:id', verificarToken, eliminarEquipo);

export default router;
