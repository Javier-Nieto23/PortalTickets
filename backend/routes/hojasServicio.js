import express from 'express';
import { hojaServicioController } from '../controllers/hojaServicioController.js';

const router = express.Router();

// Rutas de hojas de servicio
router.get('/', hojaServicioController.getAll);
router.get('/:id', hojaServicioController.getById);
router.get('/numero/:numero', hojaServicioController.getByNumero);
router.post('/', hojaServicioController.create);
router.put('/:id', hojaServicioController.update);
router.delete('/:id', hojaServicioController.delete);

// Ruta para generar PDF
router.get('/:id/pdf', hojaServicioController.generarPDF);

export default router;
