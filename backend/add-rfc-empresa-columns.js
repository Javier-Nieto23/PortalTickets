import pkg from 'pg';
const { Pool } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'caast_servicios',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
});

async function addRFCEmpresaColumns() {
  try {
    console.log('Conectando a la base de datos...');
    
    const sqlFile = path.join(__dirname, 'database', 'add-rfc-empresa.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    console.log('Ejecutando script SQL...');
    await pool.query(sql);
    
    console.log('✓ Columnas RFC y nombre_empresa agregadas exitosamente');
    
    // Verificar que las columnas existen
    const result = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'usuarios' 
      AND column_name IN ('rfc', 'nombre_empresa')
      ORDER BY column_name;
    `);
    
    console.log('\nColumnas agregadas:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name} (${row.data_type})`);
    });
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error al agregar columnas:', error.message);
    await pool.end();
    process.exit(1);
  }
}

addRFCEmpresaColumns();
