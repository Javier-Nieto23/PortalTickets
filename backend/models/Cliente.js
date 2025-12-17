import { query } from '../config/database.js';

export const ClienteModel = {
  // Obtener todos los clientes
  findAll: async () => {
    const { rows } = await query(
      'SELECT * FROM clientes ORDER BY razon_social'
    );
    return rows;
  },

  // Buscar cliente por código
  findByCodigo: async (codigo) => {
    const { rows } = await query(
      'SELECT * FROM clientes WHERE codigo = $1',
      [codigo]
    );
    return rows[0] || null;
  },

  // Buscar cliente por ID
  findById: async (id) => {
    const { rows } = await query(
      'SELECT * FROM clientes WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  },

  // Crear cliente
  create: async (clienteData) => {
    const { rows } = await query(
      `INSERT INTO clientes (codigo, razon_social, nombre_contacto, telefono, email, direccion)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        clienteData.codigo,
        clienteData.razon_social,
        clienteData.nombre_contacto,
        clienteData.telefono,
        clienteData.email,
        clienteData.direccion
      ]
    );
    return rows[0];
  },

  // Buscar clientes (para autocomplete)
  search: async (termino) => {
    const { rows } = await query(
      `SELECT * FROM clientes 
       WHERE razon_social ILIKE $1 
       OR codigo ILIKE $1 
       OR nombre_contacto ILIKE $1
       ORDER BY razon_social
       LIMIT 10`,
      [`%${termino}%`]
    );
    return rows;
  }
};
