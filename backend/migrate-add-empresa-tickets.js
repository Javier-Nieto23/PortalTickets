import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'caast_servicios',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
});

async function addEmpresaToTickets() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Agregando columna empresa a la tabla tickets...');
    
    // Verificar si la columna ya existe
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'tickets' AND column_name = 'empresa';
    `);
    
    if (checkColumn.rows.length > 0) {
      console.log('⚠️  La columna empresa ya existe en la tabla tickets');
    } else {
      // Agregar columna empresa
      await client.query('ALTER TABLE tickets ADD COLUMN empresa VARCHAR(255);');
      console.log('✅ Columna empresa agregada a la tabla tickets');
    }
    
    // Mostrar estructura final
    console.log('\n📋 Estructura de la tabla tickets:');
    const finalColumns = await client.query(`
      SELECT column_name, data_type, character_maximum_length 
      FROM information_schema.columns 
      WHERE table_name = 'tickets' 
      ORDER BY ordinal_position;
    `);
    
    finalColumns.rows.forEach(row => {
      const length = row.character_maximum_length ? `(${row.character_maximum_length})` : '';
      console.log(`  - ${row.column_name}: ${row.data_type}${length}`);
    });
    
    console.log('\n✅ Migración completada');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

addEmpresaToTickets()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
