import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'caast_servicios',
  password: 'caast2025',
  port: 5432,
});

async function removeEstadoFechaAdquisicion() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Eliminando columnas estado y fecha_adquisicion de tabla equipos...');
    
    // Eliminar columna estado
    await client.query(`
      ALTER TABLE equipos DROP COLUMN IF EXISTS estado;
    `);
    console.log('✅ Columna estado eliminada');
    
    // Eliminar columna fecha_adquisicion
    await client.query(`
      ALTER TABLE equipos DROP COLUMN IF EXISTS fecha_adquisicion;
    `);
    console.log('✅ Columna fecha_adquisicion eliminada');
    
    // Verificar la tabla
    const result = await client.query(`
      SELECT column_name, data_type, character_maximum_length, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'equipos'
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📋 Estructura actualizada de la tabla equipos:');
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

removeEstadoFechaAdquisicion().catch(console.error);
