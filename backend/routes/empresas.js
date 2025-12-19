import express from 'express';
import { 
  obtenerEmpresas, 
  obtenerEmpresaPorId, 
  crearEmpresa,
  actualizarEmpresa, 
  eliminarEmpresa,
  verificarEmpresa
} from '../controllers/empresaController.js';
import { verificarToken } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas o con autenticación
router.get('/', verificarToken, obtenerEmpresas);
router.get('/verificar', verificarToken, verificarEmpresa);
router.get('/:id', verificarToken, obtenerEmpresaPorId);
router.post('/', verificarToken, crearEmpresa);
router.put('/:id', verificarToken, actualizarEmpresa);
router.delete('/:id', verificarToken, eliminarEmpresa);

export default router;
