import express from 'express';
import { ticketController } from '../controllers/ticketController.js';

const router = express.Router();

// Rutas de tickets
router.get('/', ticketController.getAll);
router.get('/:id', ticketController.getById);
router.post('/', ticketController.create);
router.put('/:id', ticketController.update);
router.delete('/:id', ticketController.delete);

export default router;
