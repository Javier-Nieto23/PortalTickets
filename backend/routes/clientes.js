import express from 'express';
import { clienteController } from '../controllers/clienteController.js';

const router = express.Router();

// Rutas de clientes
router.get('/', clienteController.getAll);
router.get('/search', clienteController.search);
router.get('/:id', clienteController.getById);
router.post('/', clienteController.create);

export default router;
