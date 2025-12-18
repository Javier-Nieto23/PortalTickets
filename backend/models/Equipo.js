import { query } from '../config/database.js';

export const Equipo = {
  // Crear nuevo equipo
  async create(equipoData) {
    const sql = `
      INSERT INTO equipos (
        usuario_id, tipo_equipo, marca, modelo, numero_serie, Nombre_Empleado,
        sistema_operativo, procesador, ram, disco_duro, observaciones
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    
    const values = [
      equipoData.usuario_id,
      equipoData.tipo_equipo,
      equipoData.marca,
      equipoData.modelo,
      equipoData.numero_serie,
      equipoData.Nombre_Empleado || null,
      equipoData.sistema_operativo || null,
      equipoData.procesador || null,
      equipoData.ram || null,
      equipoData.disco_duro || null,
      equipoData.observaciones || null
    ];
    
    const result = await query(sql, values);
    return result.rows[0];
  },

  // Crear equipo manualmente (admin) con empresa personalizada
  async createManual(equipoData) {
    const sql = `
      INSERT INTO equipos (
        usuario_id, tipo_equipo, marca, modelo, numero_serie, Nombre_Empleado,
        sistema_operativo, procesador, ram, disco_duro, observaciones
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    
    const values = [
      equipoData.usuario_id,
      equipoData.tipo_equipo,
      equipoData.marca,
      equipoData.modelo,
      equipoData.numero_serie,
      equipoData.Nombre_Empleado || null,
      equipoData.sistema_operativo || null,
      equipoData.procesador || null,
      equipoData.ram || null,
      equipoData.disco_duro || null,
      equipoData.observaciones || null
    ];
    
    const result = await query(sql, values);
    // Agregar empresa manualmente al resultado
    result.rows[0].Nombre_Empresa = equipoData.empresa;
    return result.rows[0];
  },

  // Obtener equipos de un usuario
  async findByUsuarioId(usuario_id) {
    const sql = `
      SELECT e.*, u.nombre, u.apellido, u.email, emp.Nombre_Empresa
      FROM equipos e
      JOIN usuarios u ON e.usuario_id = u.ID_usuario
      LEFT JOIN Empresas emp ON u.ID_Empresa = emp.ID_Empresa
      WHERE e.usuario_id = $1
      ORDER BY e.created_at DESC
    `;
    
    const result = await query(sql, [usuario_id]);
    return result.rows;
  },

  // Obtener equipo por ID
  async findById(id) {
    const sql = `
      SELECT e.*, u.nombre, u.apellido, u.email, emp.Nombre_Empresa
      FROM equipos e
      JOIN usuarios u ON e.usuario_id = u.ID_usuario
      LEFT JOIN Empresas emp ON u.ID_Empresa = emp.ID_Empresa
      WHERE e.id = $1
    `;
    
    const result = await query(sql, [id]);
    return result.rows[0];
  },

  // Obtener todos los equipos (admin)
  async findAll() {
    const sql = `
      SELECT e.*, u.nombre, u.apellido, u.email, emp.Nombre_Empresa
      FROM equipos e
      JOIN usuarios u ON e.usuario_id = u.ID_usuario
      LEFT JOIN Empresas emp ON u.ID_Empresa = emp.ID_Empresa
      ORDER BY e.created_at DESC
    `;
    
    const result = await query(sql);
    return result.rows;
  },

  // Actualizar equipo
  async update(id, equipoData) {
    const sql = `
      UPDATE equipos
      SET tipo_equipo = $1,
          marca = $2,
          modelo = $3,
          numero_serie = $4,
          Nombre_Empleado = $5,
          sistema_operativo = $6,
          procesador = $7,
          ram = $8,
          disco_duro = $9,
          observaciones = $10,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $11
      RETURNING *
    `;
    
    const values = [
      equipoData.tipo_equipo,
      equipoData.marca,
      equipoData.modelo,
      equipoData.numero_serie,
      equipoData.Nombre_Empleado || null,
      equipoData.sistema_operativo || null,
      equipoData.procesador || null,
      equipoData.ram || null,
      equipoData.disco_duro || null,
      equipoData.observaciones || null,
      id
    ];
    
    const result = await query(sql, values);
    return result.rows[0];
  },

  // Eliminar equipo
  async delete(id) {
    const sql = 'DELETE FROM equipos WHERE id = $1 RETURNING *';
    const result = await query(sql, [id]);
    return result.rows[0];
  },

  // Verificar si un número de serie ya existe
  async existsByNumeroSerie(numero_serie, excludeId = null) {
    let sql = 'SELECT id FROM equipos WHERE numero_serie = $1';
    const values = [numero_serie];
    
    if (excludeId) {
      sql += ' AND id != $2';
      values.push(excludeId);
    }
    
    const result = await query(sql, values);
    return result.rows.length > 0;
  }
};
