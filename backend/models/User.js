import { query } from '../config/database.js';
import bcrypt from 'bcrypt';

export const UserModel = {
  // Buscar usuario por email
  findByEmail: async (email) => {
    const result = await query(
      `SELECT u.*, e.Nombre_Empresa, e.rfc as empresa_rfc 
       FROM usuarios u 
       LEFT JOIN Empresas e ON u.ID_Empresa = e.ID_Empresa 
       WHERE u.Email = $1`,
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
      `INSERT INTO usuarios (Nombre_usuario, apellido_usuario, Email, password, nombre, rfc, ID_Empresa, rol, activo) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING ID_usuario, Email, Nombre_usuario, apellido_usuario, nombre, rfc, ID_Empresa, rol, activo, created_at`,
      [
        userData.nombre,
        userData.apellido,
        userData.email,
        hashedPassword,
        userData.nombre,
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
      `SELECT u.ID_usuario, u.Email, u.Nombre_usuario, u.apellido_usuario, u.nombre, u.rfc, u.ID_Empresa, u.rol, u.activo, u.created_at,
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
      `SELECT u.ID_usuario, u.Email, u.Nombre_usuario, u.apellido_usuario, u.nombre, u.rfc, u.ID_Empresa, u.rol, u.activo, u.created_at,
              e.Nombre_Empresa, e.rfc as empresa_rfc
       FROM usuarios u
       LEFT JOIN Empresas e ON u.ID_Empresa = e.ID_Empresa
       ORDER BY u.created_at DESC`
    );
    return result.rows;
  },

  // Crear usuario cliente genérico para empresa
  createCliente: async (ID_Empresa, nombreEmpresa) => {
    console.log('createCliente recibió ID_Empresa:', ID_Empresa, 'nombreEmpresa:', nombreEmpresa);
    
    // Generar un email único para el cliente usando el nombre de empresa
    let emailCliente = `cliente.${nombreEmpresa.toLowerCase().replace(/\s+/g, '_')}@empresa.local`;
    
    // Verificar si el email ya existe, si es así agregar timestamp
    const emailCheck = await query(
      `SELECT Email FROM usuarios WHERE Email = $1`,
      [emailCliente]
    );
    
    if (emailCheck.rows.length > 0) {
      // Si el email existe, agregar timestamp para hacerlo único
      emailCliente = `cliente.${nombreEmpresa.toLowerCase().replace(/\s+/g, '_')}.${Date.now()}@empresa.local`;
    }
    
    // Generar contraseña aleatoria (no será usada, es solo por requerimiento de la DB)
    const passwordTemp = Math.random().toString(36).slice(-10);
    const hashedPassword = await bcrypt.hash(passwordTemp, 10);

    console.log('Insertando cliente con ID_Empresa:', ID_Empresa);
    const result = await query(
      `INSERT INTO usuarios (Nombre_usuario, apellido_usuario, Email, password, nombre, rfc, ID_Empresa, rol, activo) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING ID_usuario, Email, Nombre_usuario, apellido_usuario, nombre, rfc, ID_Empresa, rol, activo, created_at`,
      [
        'Cliente',
        nombreEmpresa,
        emailCliente,
        hashedPassword,
        'Cliente',
        null,
        ID_Empresa,
        'cliente',
        false // Usuario cliente inactivo por defecto
      ]
    );

    return result.rows[0];
  },

  // Buscar o crear cliente para empresa
  findOrCreateCliente: async (ID_Empresa, nombreEmpresa) => {
    // Buscar si ya existe un cliente para esta empresa
    const result = await query(
      `SELECT ID_usuario, Email, Nombre_usuario, apellido_usuario, nombre, rfc, ID_Empresa, rol, activo, created_at 
       FROM usuarios WHERE ID_Empresa = $1 AND rol = 'cliente' LIMIT 1`,
      [ID_Empresa]
    );

    if (result.rows.length > 0) {
      return result.rows[0];
    }

    // Si no existe, crear uno nuevo
    return await UserModel.createCliente(ID_Empresa, nombreEmpresa);
  }
};
