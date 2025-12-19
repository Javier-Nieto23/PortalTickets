import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcrypt';

// Conexión a PostgreSQL (base postgres para crear la nueva DB)
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Nieto023',
  port: 5432,
});

async function createDatabase() {
  const client = await pool.connect();
  try {
    console.log('=== CREANDO NUEVA BASE DE DATOS ===\n');

    // Eliminar base de datos si existe
    console.log('1. Eliminando base de datos anterior si existe...');
    await client.query('DROP DATABASE IF EXISTS caast_servicios');
    console.log('   ✅ Base de datos eliminada\n');

    // Crear nueva base de datos
    console.log('2. Creando nueva base de datos...');
    await client.query('CREATE DATABASE caast_servicios');
    console.log('   ✅ Base de datos creada\n');

    client.release();
    
    // Conectar a la nueva base de datos
    const newPool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'caast_servicios',
      password: 'Nieto023',
      port: 5432,
    });

    const newClient = await newPool.connect();

    console.log('3. Creando tabla Empresas...');
    await newClient.query(`
      CREATE TABLE Empresas (
        ID_Empresa SERIAL PRIMARY KEY,
        Nombre_Empresa VARCHAR(255) NOT NULL UNIQUE,
        rfc VARCHAR(13)
      )
    `);
    console.log('   ✅ Tabla Empresas creada\n');

    console.log('4. Creando tabla Usuarios...');
    await newClient.query(`
      CREATE TABLE usuarios (
        ID_usuario SERIAL PRIMARY KEY,
        Nombre_usuario VARCHAR(100) NOT NULL,
        apellido_usuario VARCHAR(100),
        Email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        nombre VARCHAR(100),
        rfc VARCHAR(13),
        rol VARCHAR(50) DEFAULT 'usuario',
        activo BOOLEAN DEFAULT true,
        ID_Empresa INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_usuarios_empresa FOREIGN KEY (ID_Empresa) REFERENCES Empresas(ID_Empresa) ON DELETE SET NULL
      )
    `);
    console.log('   ✅ Tabla Usuarios creada\n');

    console.log('5. Creando tabla Equipos...');
    await newClient.query(`
      CREATE TABLE equipos (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER NOT NULL,
        Nombre_Empleado VARCHAR(100),
        tipo_equipo VARCHAR(50),
        marca VARCHAR(100),
        modelo VARCHAR(100),
        numero_serie VARCHAR(100) UNIQUE,
        sistema_operativo VARCHAR(100),
        procesador VARCHAR(100),
        ram VARCHAR(50),
        disco_duro VARCHAR(50),
        observaciones TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_equipos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(ID_usuario) ON DELETE CASCADE
      )
    `);
    console.log('   ✅ Tabla Equipos creada\n');

    console.log('6. Creando tabla Tickets...');
    await newClient.query(`
      CREATE TABLE tickets (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        descripcion TEXT,
        estado VARCHAR(50) DEFAULT 'abierto',
        prioridad VARCHAR(50) DEFAULT 'media',
        ID_empleado INTEGER,
        ID_Empresa INTEGER,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_tickets_empleado FOREIGN KEY (ID_empleado) REFERENCES usuarios(ID_usuario) ON DELETE SET NULL,
        CONSTRAINT fk_tickets_empresa FOREIGN KEY (ID_Empresa) REFERENCES Empresas(ID_Empresa) ON DELETE SET NULL
      )
    `);
    console.log('   ✅ Tabla Tickets creada\n');

    console.log('7. Insertando empresa de prueba...');
    const empresaResult = await newClient.query(`
      INSERT INTO Empresas (Nombre_Empresa, rfc)
      VALUES ('CAAST', 'CAA123456ABC')
      RETURNING ID_Empresa
    `);
    const empresaId = empresaResult.rows[0].id_empresa;
    console.log('   ✅ Empresa CAAST creada con ID:', empresaId, '\n');

    console.log('8. Insertando usuario administrador...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminResult = await newClient.query(`
      INSERT INTO usuarios (Nombre_usuario, apellido_usuario, Email, password, nombre, rfc, rol, activo, ID_Empresa)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING ID_usuario, Nombre_usuario, Email, rol
    `, ['Admin', 'Sistema', 'admin@caast.com', hashedPassword, 'Administrador', 'ADMIN123456', 'admin', true, empresaId]);

    const admin = adminResult.rows[0];
    console.log('   ✅ Usuario administrador creado:\n');
    console.log('   📧 Email: admin@caast.com');
    console.log('   🔑 Password: admin123');
    console.log('   👤 Nombre: Admin Sistema');
    console.log('   🎭 Rol: admin');
    console.log('   🏢 Empresa: CAAST');
    console.log('   🆔 ID_usuario:', admin.id_usuario, '\n');

    console.log('=== BASE DE DATOS CREADA EXITOSAMENTE ===\n');
    console.log('📝 DATOS DE ACCESO ADMIN:');
    console.log('   Email: admin@caast.com');
    console.log('   Password: admin123\n');

    newClient.release();
    await newPool.end();
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

createDatabase().catch(console.error);
