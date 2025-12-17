# Backend - Portal de Tickets

API REST para gestión de tickets/servicios.

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Producción

```bash
npm start
```

## Deploy en Railway

1. Conecta tu repositorio a Railway
2. Railway detectará automáticamente el `package.json`
3. Configura las variables de entorno en el dashboard de Railway
4. El deploy se realizará automáticamente

## Variables de Entorno

Ver `.env.example` para las variables necesarias.

## API Endpoints

- `GET /` - Health check
- `GET /api/tickets` - Obtener todos los tickets
- `POST /api/tickets` - Crear nuevo ticket
- `PUT /api/tickets/:id` - Actualizar ticket
- `DELETE /api/tickets/:id` - Eliminar ticket
