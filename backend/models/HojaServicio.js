import { query } from '../config/database.js';

export const HojaServicioModel = {
  // Crear nueva hoja de servicio
  create: async (hojaData, servicios) => {
    const client = await query('BEGIN');
    
    try {
      // Obtener siguiente número de solicitud
      const { rows: [{ nextval }] } = await query(
        "SELECT nextval('numero_solicitud_seq')"
      );
      
      // Insertar hoja de servicio
      const { rows: [hoja] } = await query(
        `INSERT INTO hojas_servicio (
          numero_solicitud, hoja_censo, hoja_servicio, cotizacion, pedido,
          cliente_id, razon_social, nombre_contacto, codigo_cliente,
          fecha_solicitud, proveedor_asignado, ejecutivo_asignado,
          estado, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *`,
        [
          nextval,
          hojaData.hoja_censo || null,
          hojaData.hoja_servicio || null,
          hojaData.cotizacion || 0,
          hojaData.pedido || 0,
          hojaData.cliente_id || null,
          hojaData.razon_social,
          hojaData.nombre_contacto,
          hojaData.codigo_cliente,
          hojaData.fecha_solicitud || new Date(),
          hojaData.proveedor_asignado || 'CAAST',
          hojaData.ejecutivo_asignado,
          hojaData.estado || 'pendiente',
          hojaData.created_by || null
        ]
      );
      
      // Insertar servicios solicitados
      if (servicios && servicios.length > 0) {
        for (let i = 0; i < servicios.length; i++) {
          const servicio = servicios[i];
          await query(
            `INSERT INTO servicios_solicitados (
              hoja_servicio_id, tipo_servicio, equipo, tipo_sistema, descripcion, orden
            ) VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              hoja.id,
              servicio.tipo_servicio,
              servicio.equipo,
              servicio.tipo_sistema,
              servicio.descripcion,
              i + 1
            ]
          );
        }
      }
      
      await query('COMMIT');
      return hoja;
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  },

  // Obtener todas las hojas de servicio
  findAll: async (filtros = {}) => {
    let queryText = `
      SELECT h.*, 
        json_agg(
          json_build_object(
            'id', s.id,
            'tipo_servicio', s.tipo_servicio,
            'equipo', s.equipo,
            'tipo_sistema', s.tipo_sistema,
            'descripcion', s.descripcion,
            'orden', s.orden
          ) ORDER BY s.orden
        ) as servicios
      FROM hojas_servicio h
      LEFT JOIN servicios_solicitados s ON h.id = s.hoja_servicio_id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (filtros.estado) {
      params.push(filtros.estado);
      queryText += ` AND h.estado = $${params.length}`;
    }
    
    if (filtros.fecha_desde) {
      params.push(filtros.fecha_desde);
      queryText += ` AND h.fecha_solicitud >= $${params.length}`;
    }
    
    if (filtros.fecha_hasta) {
      params.push(filtros.fecha_hasta);
      queryText += ` AND h.fecha_solicitud <= $${params.length}`;
    }
    
    queryText += ' GROUP BY h.id ORDER BY h.numero_solicitud DESC';
    
    const { rows } = await query(queryText, params);
    return rows;
  },

  // Obtener hoja de servicio por ID
  findById: async (id) => {
    const { rows } = await query(
      `SELECT h.*, 
        json_agg(
          json_build_object(
            'id', s.id,
            'tipo_servicio', s.tipo_servicio,
            'equipo', s.equipo,
            'tipo_sistema', s.tipo_sistema,
            'descripcion', s.descripcion,
            'orden', s.orden
          ) ORDER BY s.orden
        ) as servicios
      FROM hojas_servicio h
      LEFT JOIN servicios_solicitados s ON h.id = s.hoja_servicio_id
      WHERE h.id = $1
      GROUP BY h.id`,
      [id]
    );
    
    return rows[0] || null;
  },

  // Obtener por número de solicitud
  findByNumero: async (numero) => {
    const { rows } = await query(
      `SELECT h.*, 
        json_agg(
          json_build_object(
            'id', s.id,
            'tipo_servicio', s.tipo_servicio,
            'equipo', s.equipo,
            'tipo_sistema', s.tipo_sistema,
            'descripcion', s.descripcion,
            'orden', s.orden
          ) ORDER BY s.orden
        ) as servicios
      FROM hojas_servicio h
      LEFT JOIN servicios_solicitados s ON h.id = s.hoja_servicio_id
      WHERE h.numero_solicitud = $1
      GROUP BY h.id`,
      [numero]
    );
    
    return rows[0] || null;
  },

  // Actualizar hoja de servicio
  update: async (id, hojaData) => {
    const { rows } = await query(
      `UPDATE hojas_servicio SET
        hoja_censo = COALESCE($1, hoja_censo),
        hoja_servicio = COALESCE($2, hoja_servicio),
        razon_social = COALESCE($3, razon_social),
        nombre_contacto = COALESCE($4, nombre_contacto),
        ejecutivo_asignado = COALESCE($5, ejecutivo_asignado),
        estado = COALESCE($6, estado)
      WHERE id = $7
      RETURNING *`,
      [
        hojaData.hoja_censo,
        hojaData.hoja_servicio,
        hojaData.razon_social,
        hojaData.nombre_contacto,
        hojaData.ejecutivo_asignado,
        hojaData.estado,
        id
      ]
    );
    
    return rows[0] || null;
  },

  // Eliminar hoja de servicio
  delete: async (id) => {
    const { rowCount } = await query(
      'DELETE FROM hojas_servicio WHERE id = $1',
      [id]
    );
    
    return rowCount > 0;
  }
};
