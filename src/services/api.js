// Servicio centralizado para todas las llamadas a la API

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Función helper para manejar respuestas
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(error.message || 'Error en la petición');
  }
  return response.json();
};

// ===== TICKETS =====
export const ticketService = {
  // Obtener todos los tickets
  getAll: async () => {
    const response = await fetch(`${API_URL}/api/tickets`);
    return handleResponse(response);
  },

  // Obtener un ticket por ID
  getById: async (id) => {
    const response = await fetch(`${API_URL}/api/tickets/${id}`);
    return handleResponse(response);
  },

  // Crear un nuevo ticket
  create: async (ticketData) => {
    const response = await fetch(`${API_URL}/api/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticketData),
    });
    return handleResponse(response);
  },

  // Actualizar un ticket
  update: async (id, ticketData) => {
    const response = await fetch(`${API_URL}/api/tickets/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticketData),
    });
    return handleResponse(response);
  },

  // Eliminar un ticket
  delete: async (id) => {
    const response = await fetch(`${API_URL}/api/tickets/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  // Filtrar tickets por estado
  filterByStatus: async (estado) => {
    const response = await fetch(`${API_URL}/api/tickets?estado=${estado}`);
    return handleResponse(response);
  },

  // Filtrar tickets por prioridad
  filterByPriority: async (prioridad) => {
    const response = await fetch(`${API_URL}/api/tickets?prioridad=${prioridad}`);
    return handleResponse(response);
  },
};

// ===== AUTENTICACIÓN =====
export const authService = {
  login: async (credentials) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  register: async (userData) => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  logout: async () => {
    const response = await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
    });
    return handleResponse(response);
  },
};

// Mantener userService por compatibilidad
export const userService = authService;

export default {
  tickets: ticketService,
  auth: authService,
  users: userService,
};
