import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'caast_servicios',
  password: 'caast2025',
  port: 5432,
});

async function addNombreUsuarioColumn() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Agregando columna nombre_usuario a tabla equipos...');
    
    // Agregar columna nombre_usuario
    await client.query(`
      ALTER TABLE equipos ADD COLUMN IF NOT EXISTS nombre_usuario VARCHAR(100);
    `);
    console.log('✅ Columna nombre_usuario agregada exitosamente');
    
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

addNombreUsuarioColumn().catch(console.error);
