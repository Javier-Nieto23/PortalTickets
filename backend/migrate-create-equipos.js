import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'caast_servicios',
  password: 'caast2025',
  port: 5432,
});

async function createEquiposTable() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Iniciando creación de tabla equipos...');
    
    // Crear tabla equipos
    await client.query(`
      CREATE TABLE IF NOT EXISTS equipos (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        tipo_equipo VARCHAR(50) NOT NULL,
        marca VARCHAR(100) NOT NULL,
        modelo VARCHAR(100) NOT NULL,
        numero_serie VARCHAR(100) NOT NULL UNIQUE,
        sistema_operativo VARCHAR(100),
        procesador VARCHAR(100),
        ram VARCHAR(50),
        disco_duro VARCHAR(50),
        estado VARCHAR(50) NOT NULL DEFAULT 'operativo',
        fecha_adquisicion DATE,
        observaciones TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✅ Tabla equipos creada exitosamente');
    
    // Crear índices
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_equipos_usuario_id ON equipos(usuario_id);
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_equipos_numero_serie ON equipos(numero_serie);
    `);
    
    console.log('✅ Índices creados exitosamente');
    
    // Verificar la tabla
    const result = await client.query(`
      SELECT column_name, data_type, character_maximum_length, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'equipos'
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📋 Estructura de la tabla equipos:');
    console.table(result.rows);
    
    console.log('\n✅ Migración completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

createEquiposTable().catch(console.error);
