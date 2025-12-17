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

async function migrateDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Iniciando migración...');
    console.log('📊 Base de datos:', process.env.DB_NAME || 'caast_servicios');
    
    // Verificar estructura actual
    console.log('\n📋 Verificando estructura actual de la tabla usuarios...');
    const checkColumns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'usuarios' 
      ORDER BY ordinal_position;
    `);
    
    console.log('Columnas actuales:');
    checkColumns.rows.forEach(row => {
      console.log(`  - ${row.column_name} (${row.data_type})`);
    });
    
    // Verificar si las columnas ya existen
    const hasRfc = checkColumns.rows.some(row => row.column_name === 'rfc');
    const hasNombreEmpresa = checkColumns.rows.some(row => row.column_name === 'nombre_empresa');
    
    // Agregar columna RFC si no existe
    if (!hasRfc) {
      console.log('\n➕ Agregando columna RFC...');
      await client.query('ALTER TABLE usuarios ADD COLUMN rfc VARCHAR(13);');
      console.log('✅ Columna RFC agregada');
    } else {
      console.log('\n⚠️  Columna RFC ya existe');
    }
    
    // Agregar columna nombre_empresa si no existe
    if (!hasNombreEmpresa) {
      console.log('➕ Agregando columna nombre_empresa...');
      await client.query('ALTER TABLE usuarios ADD COLUMN nombre_empresa VARCHAR(255);');
      console.log('✅ Columna nombre_empresa agregada');
    } else {
      console.log('⚠️  Columna nombre_empresa ya existe');
    }
    
    // Crear índice para RFC
    console.log('\n📑 Creando índice para RFC...');
    await client.query('CREATE INDEX IF NOT EXISTS idx_usuarios_rfc ON usuarios(rfc);');
    console.log('✅ Índice creado');
    
    // Verificar estructura final
    console.log('\n📋 Estructura final de la tabla usuarios:');
    const finalColumns = await client.query(`
      SELECT column_name, data_type, character_maximum_length 
      FROM information_schema.columns 
      WHERE table_name = 'usuarios' 
      ORDER BY ordinal_position;
    `);
    
    finalColumns.rows.forEach(row => {
      const length = row.character_maximum_length ? `(${row.character_maximum_length})` : '';
      console.log(`  - ${row.column_name}: ${row.data_type}${length}`);
    });
    
    console.log('\n✅ Migración completada exitosamente');
    
  } catch (error) {
    console.error('\n❌ Error durante la migración:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrateDatabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
