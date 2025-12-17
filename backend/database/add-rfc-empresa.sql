-- Agregar columnas RFC y nombre_empresa a la tabla usuarios
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS rfc VARCHAR(13);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS nombre_empresa VARCHAR(255);

-- Crear índice para RFC (opcional, para búsquedas más rápidas)
CREATE INDEX IF NOT EXISTS idx_usuarios_rfc ON usuarios(rfc);
