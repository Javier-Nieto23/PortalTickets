// Modelo de datos para Tickets con PostgreSQL
import { query } from '../config/database.js';

export const TicketModel = {
  // Obtener todos los tickets de un usuario específico
  async findByUserId(usuarioId) {
    const result = await query(
      'SELECT * FROM tickets WHERE usuario_id = $1 ORDER BY fecha DESC',
      [usuarioId]
    );
    return result.rows;
  },

  // Obtener todos los tickets (admin)
  async findAll(filtros = {}) {
    let sql = 'SELECT * FROM tickets WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (filtros.estado) {
      sql += ` AND estado = $${paramCount}`;
      params.push(filtros.estado);
      paramCount++;
    }

    if (filtros.prioridad) {
      sql += ` AND prioridad = $${paramCount}`;
      params.push(filtros.prioridad);
      paramCount++;
    }

    sql += ' ORDER BY fecha DESC';

    const result = await query(sql, params);
    return result.rows;
  },

  // Obtener un ticket por ID
  async findById(id) {
    const result = await query('SELECT * FROM tickets WHERE id = $1', [id]);
    return result.rows[0];
  },

  // Crear nuevo ticket
  async create(ticketData) {
    const result = await query(
      `INSERT INTO tickets (titulo, descripcion, estado, prioridad, usuario_id, creado_por, empresa, asignado_a)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        ticketData.titulo,
        ticketData.descripcion || '',
        ticketData.estado || 'abierto',
        ticketData.prioridad || 'media',
        ticketData.usuarioId || null,
        ticketData.creadoPor || 'Usuario desconocido',
        ticketData.empresa || 'Sin empresa',
        ticketData.asignadoA || null
      ]
    );
    return result.rows[0];
  },

  // Actualizar ticket
  async update(id, ticketData) {
    const result = await query(
      `UPDATE tickets 
       SET titulo = COALESCE($1, titulo),
           descripcion = COALESCE($2, descripcion),
           estado = COALESCE($3, estado),
           prioridad = COALESCE($4, prioridad),
           asignado_a = COALESCE($5, asignado_a),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [
        ticketData.titulo,
        ticketData.descripcion,
        ticketData.estado,
        ticketData.prioridad,
        ticketData.asignadoA,
        id
      ]
    );
    return result.rows[0];
  },

  // Eliminar ticket
  async delete(id) {
    const result = await query('DELETE FROM tickets WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

export default TicketModel;
