-- Script para crear usuario administrador manualmente
-- Ejecutar en pgAdmin o psql

-- 1. Verificar/Insertar empresa CAAST
INSERT INTO Empresas (Nombre_Empresa, rfc)
VALUES ('CAAST', 'CAA123456ABC')
ON CONFLICT (Nombre_Empresa) DO NOTHING;

-- 2. Insertar usuario admin
-- Password: admin123 (cifrado con bcrypt, 10 rounds)
INSERT INTO usuarios (
    Nombre_usuario, 
    apellido_usuario, 
    Email, 
    password, 
    nombre, 
    rfc, 
    rol, 
    activo, 
    ID_Empresa
)
VALUES (
    'Admin',
    'Sistema',
    'admin@caast.com',
    '$2b$10$rZ4YhqK4mXK3oF6mYjR.7uFQJ5YfXQ8jZjKqL9qH0gYqvK8FtqJzS',
    'Administrador',
    'ADMIN123456',
    'admin',
    true,
    (SELECT ID_Empresa FROM Empresas WHERE Nombre_Empresa = 'CAAST')
)
ON CONFLICT (Email) DO NOTHING;

-- Verificar que se creó correctamente
SELECT 
    ID_usuario,
    Nombre_usuario,
    Email,
    rol,
    activo,
    ID_Empresa
FROM usuarios 
WHERE Email = 'admin@caast.com';
