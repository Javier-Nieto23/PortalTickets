import express from 'express';
import { authController } from '../controllers/authController.js';

const router = express.Router();

// Rutas de autenticación
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);
router.get('/verify', authController.verify);

export default router;
