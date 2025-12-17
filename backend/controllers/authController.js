import { UserModel } from '../models/User.js';
import bcrypt from 'bcrypt';

export const authController = {
  // POST /api/auth/login - Iniciar sesión
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validaciones
      if (!email || !password) {
        return res.status(400).json({ 
          message: 'Email y contraseña son requeridos' 
        });
      }

      // Validar credenciales
      const user = await UserModel.validateCredentials(email, password);

      if (!user) {
        return res.status(401).json({ 
          message: 'Credenciales inválidas' 
        });
      }

      res.json({
        message: 'Login exitoso',
        user: user
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Error al iniciar sesión', 
        error: error.message 
      });
    }
  },

  // POST /api/auth/register - Registrar nuevo usuario
  register: async (req, res) => {
    try {
      const { email, password, nombre, apellido, rfc, nombreEmpresa } = req.body;

      // Validaciones
      if (!email || !password || !nombre || !apellido || !rfc || !nombreEmpresa) {
        return res.status(400).json({ 
          message: 'Todos los campos son requeridos (email, password, nombre, apellido, RFC y nombre de empresa)' 
        });
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          message: 'Email inválido' 
        });
      }

      // Validar contraseña segura: 8 caracteres, 1 mayúscula, 1 número, 1 signo
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({ 
          message: 'La contraseña debe tener al menos 8 caracteres, 1 mayúscula, 1 número y 1 signo especial (@$!%*?&)' 
        });
      }

      // Verificar si el usuario ya existe
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ 
          message: 'El email ya está registrado' 
        });
      }

      // Crear usuario con contraseña cifrada
      const newUser = await UserModel.create({ 
        email, 
        password, 
        nombre, 
        apellido,
        rfc,
        nombreEmpresa
      });

      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        user: newUser
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Error al registrar usuario', 
        error: error.message 
      });
    }
  },

  // POST /api/auth/logout - Cerrar sesión
  logout: (req, res) => {
    // En producción con JWT, podrías invalidar el token
    res.json({ message: 'Sesión cerrada exitosamente' });
  },

  // GET /api/auth/verify - Verificar token (para producción)
  verify: (req, res) => {
    // En producción, verificar JWT
    res.json({ message: 'Token válido' });
  }
};
