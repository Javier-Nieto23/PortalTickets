import { ClienteModel } from '../models/Cliente.js';

export const clienteController = {
  // GET /api/clientes - Obtener todos los clientes
  getAll: async (req, res) => {
    try {
      const clientes = await ClienteModel.findAll();
      res.json(clientes);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      res.status(500).json({ 
        message: 'Error al obtener clientes', 
        error: error.message 
      });
    }
  },

  // GET /api/clientes/search?q=termino - Buscar clientes
  search: async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q || q.length < 2) {
        return res.json([]);
      }

      const clientes = await ClienteModel.search(q);
      res.json(clientes);
    } catch (error) {
      console.error('Error al buscar clientes:', error);
      res.status(500).json({ 
        message: 'Error al buscar clientes', 
        error: error.message 
      });
    }
  },

  // GET /api/clientes/:id - Obtener cliente por ID
  getById: async (req, res) => {
    try {
      const cliente = await ClienteModel.findById(req.params.id);
      
      if (!cliente) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }

      res.json(cliente);
    } catch (error) {
      console.error('Error al obtener cliente:', error);
      res.status(500).json({ 
        message: 'Error al obtener cliente', 
        error: error.message 
      });
    }
  },

  // POST /api/clientes - Crear cliente
  create: async (req, res) => {
    try {
      const { codigo, razon_social } = req.body;

      if (!codigo || !razon_social) {
        return res.status(400).json({ 
          message: 'Código y razón social son requeridos' 
        });
      }

      const nuevoCliente = await ClienteModel.create(req.body);

      res.status(201).json({
        message: 'Cliente creado exitosamente',
        cliente: nuevoCliente
      });
    } catch (error) {
      console.error('Error al crear cliente:', error);
      res.status(500).json({ 
        message: 'Error al crear cliente', 
        error: error.message 
      });
    }
  }
};
