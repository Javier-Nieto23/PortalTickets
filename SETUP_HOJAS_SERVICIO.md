# Sistema de Hojas de Servicio CAAST

Sistema completo para gestión de hojas de servicio con PostgreSQL y generación de PDF.

## 📋 Requisitos Previos

- Node.js 18+
- PostgreSQL 14+
- npm o yarn

## 🚀 Configuración del Backend

### 1. Instalar PostgreSQL

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS con Homebrew
brew install postgresql@14
```

### 2. Crear Base de Datos

```bash
# Acceder a PostgreSQL
sudo -u postgres psql

# O directamente con el script
psql -U postgres -f backend/database/schema.sql
```

### 3. Configurar Variables de Entorno

```bash
cd backend
cp .env.example .env

# Editar .env con tus credenciales de PostgreSQL
nano .env
```

Variables necesarias:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=caast_servicios
DB_USER=postgres
DB_PASSWORD=tu_password
```

### 4. Instalar Dependencias

```bash
cd backend
npm install
```

Dependencias instaladas:

- express: Framework web
- pg: Cliente PostgreSQL
- pdfkit: Generación de PDF
- bcrypt: Encriptación de contraseñas
- cors: CORS middleware
- dotenv: Variables de entorno

### 5. Iniciar Backend

```bash
npm run dev
```

El servidor estará en `http://localhost:3000`

## 🎨 Configuración del Frontend

### 1. Instalar Dependencias

```bash
cd frontend
npm install
```

### 2. Configurar Variables de Entorno

```bash
cp .env.example .env
```

Contenido de `.env`:

```
VITE_API_URL=http://localhost:3000
```

### 3. Iniciar Frontend

```bash
npm run dev
```

La aplicación estará en `http://localhost:5173`

## 📊 Estructura de la Base de Datos

### Tablas Principales

**usuarios**: Gestión de usuarios del sistema

- id, email, password, nombre, rol

**clientes**: Catálogo de clientes

- id, codigo, razon_social, nombre_contacto, etc.

**hojas_servicio**: Hojas de servicio principales

- numero_solicitud, hoja_censo, hoja_servicio
- información del cliente, fechas, ejecutivos

**servicios_solicitados**: Detalle de servicios por hoja

- tipo_servicio, equipo, tipo_sistema, descripcion

## 🔐 Credenciales de Prueba

```
Email: admin@caast.com
Password: admin123

Email: estefanny.cruz@caast.com
Password: ejecutivo123
```

## 📄 API Endpoints

### Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/logout` - Cerrar sesión

### Hojas de Servicio

- `GET /api/hojas-servicio` - Listar todas
- `GET /api/hojas-servicio/:id` - Obtener por ID
- `POST /api/hojas-servicio` - Crear nueva
- `PUT /api/hojas-servicio/:id` - Actualizar
- `DELETE /api/hojas-servicio/:id` - Eliminar
- `GET /api/hojas-servicio/:id/pdf` - Generar PDF

### Clientes

- `GET /api/clientes` - Listar todos
- `GET /api/clientes/search?q=termino` - Buscar
- `GET /api/clientes/:id` - Obtener por ID
- `POST /api/clientes` - Crear nuevo

## 📦 Formato de Hoja de Servicio

El PDF se genera con el siguiente formato:

- Logo y encabezado CAAST
- Número de solicitud
- Hoja de censo y hoja de servicio
- Información del cliente
- Servicios solicitados en tabla
- Firma automática con fecha y hora

## 🛠️ Próximos Pasos

1. Configurar PostgreSQL localmente
2. Ejecutar schema.sql para crear tablas
3. Configurar .env con credenciales
4. Instalar dependencias con npm install
5. Iniciar backend y frontend
6. Acceder al sistema y crear hojas de servicio

## 📝 Notas

- Los números de solicitud se generan automáticamente desde 5001
- Los PDF se generan en memoria y se descargan directamente
- El sistema soporta múltiples servicios por hoja
- Todas las fechas se guardan en UTC
