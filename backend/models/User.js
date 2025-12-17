import { query } from '../config/database.js';
import bcrypt from 'bcrypt';

export const UserModel = {
  // Buscar usuario por email
  findByEmail: async (email) => {
    const result = await query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );
    return result.rows[0];
  },

  // Validar credenciales
  validateCredentials: async (email, password) => {
    const user = await UserModel.findByEmail(email);
    
    if (!user) {
      return null;
    }

    // Comparar contraseña con bcrypt
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (isValidPassword) {
      // No devolver la contraseña
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }

    return null;
  },

  // Crear nuevo usuario
  create: async (userData) => {
    // Cifrar contraseña con bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    const result = await query(
      `INSERT INTO usuarios (email, password, nombre, apellido, rfc, nombre_empresa, rol, activo) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING id, email, nombre, apellido, rfc, nombre_empresa, rol, activo, created_at`,
      [
        userData.email,
        hashedPassword,
        userData.nombre,
        userData.apellido,
        userData.rfc,
        userData.nombreEmpresa,
        userData.rol || 'usuario',
        true
      ]
    );

    return result.rows[0];
  },

  // Obtener usuario por ID
  findById: async (id) => {
    const result = await query(
      'SELECT id, email, nombre, apellido, rfc, nombre_empresa, rol, activo, created_at FROM usuarios WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  // Obtener todos los usuarios (sin contraseñas)
  findAll: async () => {
    const result = await query(
      'SELECT id, email, nombre, apellido, rfc, nombre_empresa, rol, activo, created_at FROM usuarios ORDER BY created_at DESC'
    );
    return result.rows;
  }
};
