# Portal de Tickets

Sistema de gestión de tickets/servicios con backend y frontend separados.

## Estructura del Proyecto

```
Tickets/
├── backend/          # API REST con Node.js y Express
│   ├── server.js
│   ├── package.json
│   └── README.md
│
└── frontend/         # Cliente React con Vite
    ├── src/
    ├── package.json
    └── README.md
```

## Instalación y Desarrollo

### Backend

```bash
cd backend
npm install
npm run dev
```

El servidor correrá en `http://localhost:3000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

La aplicación correrá en `http://localhost:5173`

## Deploy

### Backend en Railway

1. Crea una cuenta en [Railway](https://railway.app)
2. Conecta tu repositorio de GitHub
3. Selecciona la carpeta `backend` como root directory
4. Railway detectará automáticamente el `package.json`
5. Configura las variables de entorno si es necesario
6. Deploy automático en cada push

### Frontend en Vercel

1. Crea una cuenta en [Vercel](https://vercel.com)
2. Conecta tu repositorio de GitHub
3. Configura el proyecto:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Agrega la variable de entorno:
   - `VITE_API_URL`: URL de tu backend en Railway (ej: `https://tu-backend.railway.app`)
5. Deploy automático en cada push

## Variables de Entorno

### Backend

Ver `backend/.env.example`

### Frontend

Ver `frontend/.env.example`

## Características

- ✅ Crear tickets con título, descripción y prioridad
- ✅ Visualizar lista de tickets activos
- ✅ Eliminar tickets
- ✅ Actualizar estado de tickets
- ✅ Interfaz responsive
- ✅ API REST completa
- ✅ Listo para deploy en Railway y Vercel

## Tecnologías

**Backend:**

- Node.js
- Express
- CORS
- dotenv

**Frontend:**

- React 18
- Vite
- CSS moderno
- Fetch API

## Próximos Pasos

1. Agregar base de datos (MongoDB, PostgreSQL, etc.)
2. Implementar autenticación
3. Agregar más campos a los tickets (asignado a, fechas, etc.)
4. Implementar filtros y búsqueda
5. Agregar notificaciones en tiempo real
