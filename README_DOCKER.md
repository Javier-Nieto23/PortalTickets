# Sistema de Hojas de Servicio CAAST

## 🚀 Inicio Rápido con Docker Compose

### 1. Iniciar todo el sistema

```bash
# Desde la raíz del proyecto
docker-compose up -d
```

Esto iniciará:

- ✅ PostgreSQL en puerto 5432
- ✅ Backend API en puerto 3000
- ✅ Base de datos con datos iniciales

### 2. Verificar que todo esté corriendo

```bash
docker-compose ps
```

Deberías ver:

```
caast_postgres   running   0.0.0.0:5432->5432/tcp
caast_backend    running   0.0.0.0:3000->3000/tcp
```

### 3. Ver logs

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver solo logs del backend
docker-compose logs -f backend

# Ver solo logs de PostgreSQL
docker-compose logs -f postgres
```

### 4. Conectar con pgAdmin

En pgAdmin, crea una nueva conexión:

- **Host**: localhost
- **Port**: 5432
- **Database**: caast_servicios
- **Username**: postgres
- **Password**: caast2025

### 5. Probar la API

```bash
# Health check
curl http://localhost:3000

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@caast.com","password":"admin123"}'

# Obtener hojas de servicio
curl http://localhost:3000/api/hojas-servicio

# Obtener clientes
curl http://localhost:3000/api/clientes
```

## 🎨 Iniciar Frontend

El frontend NO está en Docker, se ejecuta localmente:

```bash
cd /home/javier-nieto/Tickets
npm install
npm run dev
```

Accede a: http://localhost:5173

## 🔐 Credenciales de Prueba

```
Email: admin@caast.com
Password: admin123
```

## 🛠️ Comandos Útiles

```bash
# Detener todo
docker-compose down

# Detener y eliminar volúmenes (CUIDADO: borra la BD)
docker-compose down -v

# Reiniciar solo el backend
docker-compose restart backend

# Reconstruir imágenes
docker-compose up -d --build

# Ver estado de la base de datos
docker-compose exec postgres psql -U postgres -d caast_servicios -c "\dt"

# Ejecutar comandos SQL
docker-compose exec postgres psql -U postgres -d caast_servicios

# Acceder al contenedor del backend
docker-compose exec backend sh
```

## 📊 Datos Iniciales

La base de datos se crea automáticamente con:

- 2 usuarios (admin y ejecutivo)
- 3 clientes de ejemplo
- Tablas: usuarios, clientes, hojas_servicio, servicios_solicitados

## 🔄 Reiniciar Base de Datos

Si necesitas reiniciar la BD desde cero:

```bash
docker-compose down -v
docker-compose up -d
```

## 📝 Estructura del Proyecto

```
Tickets/
├── docker-compose.yml       # Orquestación de contenedores
├── backend/
│   ├── Dockerfile          # Imagen del backend
│   ├── .env               # Variables de entorno
│   ├── server.js          # Servidor Express
│   ├── config/
│   │   └── database.js    # Conexión PostgreSQL
│   ├── models/            # Modelos de datos
│   ├── controllers/       # Lógica de negocio
│   ├── routes/           # Endpoints API
│   ├── utils/            # Utilidades (PDF)
│   └── database/
│       └── schema.sql    # Schema inicial
└── src/                  # Frontend React
```

## 🐛 Troubleshooting

**Puerto 5432 ocupado:**

```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "5433:5432"
```

**Backend no conecta a BD:**

```bash
# Ver logs
docker-compose logs postgres

# Verificar que postgres esté listo
docker-compose exec postgres pg_isready
```

**Reinstalar dependencias:**

```bash
docker-compose down
docker-compose up -d --build
```
