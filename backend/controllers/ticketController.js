import TicketModel from '../models/Ticket.js';

export const ticketController = {
  // GET /api/tickets - Obtener tickets del usuario logueado
  getAll: async (req, res) => {
    try {
      const { usuarioId } = req.query;

      if (!usuarioId) {
        return res.status(400).json({ message: 'ID de usuario requerido' });
      }

      const tickets = await TicketModel.findByUserId(usuarioId);
      res.json(tickets);
    } catch (error) {
      console.error('Error al obtener tickets:', error);
      res.status(500).json({ message: 'Error al obtener tickets', error: error.message });
    }
  },

  // GET /api/tickets/:id - Obtener un ticket por ID
  getById: async (req, res) => {
    try {
      const ticket = await TicketModel.findById(req.params.id);
      
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket no encontrado' });
      }

      res.json(ticket);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el ticket', error: error.message });
    }
  },

  // POST /api/tickets - Crear nuevo ticket
  create: async (req, res) => {
    try {
      const { titulo, descripcion, estado, prioridad, creadoPor, usuarioId, empresa } = req.body;

      // Validaciones
      if (!titulo || titulo.trim() === '') {
        return res.status(400).json({ message: 'El título es requerido' });
      }

      if (!usuarioId) {
        return res.status(400).json({ message: 'ID de usuario requerido' });
      }

      const nuevoTicket = await TicketModel.create({
        titulo,
        descripcion,
        estado,
        prioridad,
        creadoPor,
        usuarioId,
        empresa
      });

      res.status(201).json({
        message: 'Ticket creado exitosamente',
        ticket: nuevoTicket
      });
    } catch (error) {
      console.error('Error al crear ticket:', error);
      res.status(500).json({ message: 'Error al crear ticket', error: error.message });
    }
  },

  // PUT /api/tickets/:id - Actualizar ticket
  update: async (req, res) => {
    try {
      const ticketActualizado = await TicketModel.update(req.params.id, req.body);

      if (!ticketActualizado) {
        return res.status(404).json({ message: 'Ticket no encontrado' });
      }

      res.json({
        message: 'Ticket actualizado exitosamente',
        ticket: ticketActualizado
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar ticket', error: error.message });
    }
  },

  // DELETE /api/tickets/:id - Eliminar ticket
  delete: async (req, res) => {
    try {
      const eliminado = await TicketModel.delete(req.params.id);

      if (!eliminado) {
        return res.status(404).json({ message: 'Ticket no encontrado' });
      }

      res.json({ message: 'Ticket eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar ticket', error: error.message });
    }
  }
};

export default ticketController;
