import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'caast_servicios',
  password: 'Nieto023',
  port: 5432,
});

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    console.log('Paso 1: Crear tabla Empresas...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS Empresas (
        ID_Empresa SERIAL PRIMARY KEY,
        Nombre_Empresa VARCHAR(255) NOT NULL UNIQUE,
        rfc VARCHAR(13)
      )
    `);

    console.log('Paso 2: Migrar empresas únicas de usuarios a tabla Empresas...');
    await client.query(`
      INSERT INTO Empresas (Nombre_Empresa)
      SELECT DISTINCT empresa
      FROM usuarios
      WHERE empresa IS NOT NULL AND empresa != ''
      ON CONFLICT (Nombre_Empresa) DO NOTHING
    `);

    console.log('Paso 3: Agregar columna ID_Empresa a usuarios...');
    await client.query(`
      ALTER TABLE usuarios
      ADD COLUMN IF NOT EXISTS ID_Empresa INTEGER
    `);

    console.log('Paso 4: Actualizar ID_Empresa en usuarios basado en el nombre de empresa...');
    await client.query(`
      UPDATE usuarios u
      SET ID_Empresa = e.ID_Empresa
      FROM Empresas e
      WHERE u.empresa = e.Nombre_Empresa
    `);

    console.log('Paso 5: Renombrar columna id a ID_usuario en usuarios...');
    await client.query(`
      ALTER TABLE usuarios
      RENAME COLUMN id TO ID_usuario
    `);

    console.log('Paso 6: Agregar constraint FK en usuarios.ID_Empresa...');
    await client.query(`
      ALTER TABLE usuarios
      ADD CONSTRAINT fk_usuarios_empresa
      FOREIGN KEY (ID_Empresa) REFERENCES Empresas(ID_Empresa)
    `);

    console.log('Paso 7: Actualizar tabla equipos - renombrar columnas...');
    await client.query(`
      ALTER TABLE equipos
      RENAME COLUMN nombre_usuario TO Nombre_Empleado
    `);

    console.log('Paso 8: Agregar constraint FK en equipos.usuario_id...');
    await client.query(`
      ALTER TABLE equipos
      ADD CONSTRAINT fk_equipos_usuario
      FOREIGN KEY (usuario_id) REFERENCES usuarios(ID_usuario) ON DELETE CASCADE
    `);

    console.log('Paso 9: Actualizar tabla tickets - renombrar usuario_id a ID_empleado...');
    await client.query(`
      ALTER TABLE tickets
      RENAME COLUMN usuario_id TO ID_empleado
    `);

    console.log('Paso 10: Agregar constraint FK en tickets.ID_empleado...');
    await client.query(`
      ALTER TABLE tickets
      ADD CONSTRAINT fk_tickets_empleado
      FOREIGN KEY (ID_empleado) REFERENCES usuarios(ID_usuario) ON DELETE CASCADE
    `);

    console.log('Paso 11: Eliminar columna empresa de usuarios (ya no necesaria)...');
    await client.query(`
      ALTER TABLE usuarios
      DROP COLUMN IF EXISTS empresa
    `);

    await client.query('COMMIT');
    console.log('✅ Migración completada exitosamente');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error en la migración:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(console.error);
