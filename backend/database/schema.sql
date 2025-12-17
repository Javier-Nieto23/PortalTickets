-- Crear base de datos
CREATE DATABASE caast_servicios;

-- Conectar a la base de datos
\c caast_servicios;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    rfc VARCHAR(13),
    nombre_empresa VARCHAR(255),
    rol VARCHAR(50) DEFAULT 'usuario',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de tickets
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(50) DEFAULT 'abierto',
    prioridad VARCHAR(50) DEFAULT 'media',
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    creado_por VARCHAR(255) NOT NULL,
    asignado_a VARCHAR(255),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para tickets
CREATE INDEX idx_tickets_usuario ON tickets(usuario_id);
CREATE INDEX idx_tickets_estado ON tickets(estado);
CREATE INDEX idx_tickets_fecha ON tickets(fecha);

-- Tabla de clientes
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    razon_social VARCHAR(255) NOT NULL,
    nombre_contacto VARCHAR(255),
    telefono VARCHAR(50),
    email VARCHAR(255),
    direccion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de hojas de servicio
CREATE TABLE hojas_servicio (
    id SERIAL PRIMARY KEY,
    numero_solicitud INTEGER UNIQUE NOT NULL,
    hoja_censo INTEGER,
    hoja_servicio INTEGER,
    cotizacion INTEGER DEFAULT 0,
    pedido INTEGER DEFAULT 0,
    
    -- Información del cliente
    cliente_id INTEGER REFERENCES clientes(id),
    razon_social VARCHAR(255) NOT NULL,
    nombre_contacto VARCHAR(255),
    codigo_cliente VARCHAR(50),
    
    -- Información de la solicitud
    fecha_solicitud DATE NOT NULL DEFAULT CURRENT_DATE,
    proveedor_asignado VARCHAR(255) DEFAULT 'CAAST',
    ejecutivo_asignado VARCHAR(255),
    
    -- Estado y seguimiento
    estado VARCHAR(50) DEFAULT 'pendiente',
    
    -- Auditoría
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES usuarios(id)
);

-- Tabla de servicios solicitados (detalle de cada hoja)
CREATE TABLE servicios_solicitados (
    id SERIAL PRIMARY KEY,
    hoja_servicio_id INTEGER REFERENCES hojas_servicio(id) ON DELETE CASCADE,
    tipo_servicio VARCHAR(100) NOT NULL,
    equipo VARCHAR(100),
    tipo_sistema VARCHAR(100),
    descripcion TEXT NOT NULL,
    orden INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_hojas_servicio_numero ON hojas_servicio(numero_solicitud);
CREATE INDEX idx_hojas_servicio_cliente ON hojas_servicio(cliente_id);
CREATE INDEX idx_hojas_servicio_fecha ON hojas_servicio(fecha_solicitud);
CREATE INDEX idx_servicios_hoja ON servicios_solicitados(hoja_servicio_id);

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para updated_at
CREATE TRIGGER update_hojas_servicio_updated_at BEFORE UPDATE
    ON hojas_servicio FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE
    ON tickets FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Secuencia para números de solicitud
CREATE SEQUENCE numero_solicitud_seq START 5001;

-- Insertar datos de ejemplo
INSERT INTO usuarios (email, password, nombre, rol) VALUES
('admin@caast.com', 'admin123', 'Administrador CAAST', 'admin'),
('estefanny.cruz@caast.com', 'ejecutivo123', 'Estefanny Cruz', 'ejecutivo');

INSERT INTO clientes (codigo, razon_social, nombre_contacto) VALUES
('GCO140206', 'GRUPO COMWOR S.A. DE C.V.', 'JORGE VALLEJO'),
('CLI001', 'Empresa Demo S.A.', 'Juan Pérez'),
('CLI002', 'Servicios TI México', 'María González');
