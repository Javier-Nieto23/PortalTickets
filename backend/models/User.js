import { query } from '../config/database.js';
import bcrypt from 'bcrypt';

export const UserModel = {
  // Buscar usuario por email
  findByEmail: async (email) => {
    const result = await query(
      `SELECT u.*, e.Nombre_Empresa, e.rfc as empresa_rfc 
       FROM usuarios u 
       LEFT JOIN Empresas e ON u.ID_Empresa = e.ID_Empresa 
       WHERE u.email = $1`,
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
      `INSERT INTO usuarios (email, password, nombre, apellido, rfc, ID_Empresa, rol, activo) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING ID_usuario, email, nombre, apellido, rfc, ID_Empresa, rol, activo, created_at`,
      [
        userData.email,
        hashedPassword,
        userData.nombre,
        userData.apellido,
        userData.rfc,
        userData.ID_Empresa,
        userData.rol || 'usuario',
        true
      ]
    );

    return result.rows[0];
  },

  // Obtener usuario por ID
  findById: async (id) => {
    const result = await query(
      `SELECT u.ID_usuario, u.email, u.nombre, u.apellido, u.rfc, u.ID_Empresa, u.rol, u.activo, u.created_at,
              e.Nombre_Empresa, e.rfc as empresa_rfc
       FROM usuarios u
       LEFT JOIN Empresas e ON u.ID_Empresa = e.ID_Empresa
       WHERE u.ID_usuario = $1`,
      [id]
    );
    return result.rows[0];
  },

  // Obtener todos los usuarios (sin contraseñas)
  findAll: async () => {
    const result = await query(
      `SELECT u.ID_usuario, u.email, u.nombre, u.apellido, u.rfc, u.ID_Empresa, u.rol, u.activo, u.created_at,
              e.Nombre_Empresa, e.rfc as empresa_rfc
       FROM usuarios u
       LEFT JOIN Empresas e ON u.ID_Empresa = e.ID_Empresa
       ORDER BY u.created_at DESC`
    );
    return result.rows;
  }
};
