import { HojaServicioModel } from '../models/HojaServicio.js';
import { generarPDFHojaServicio } from '../utils/pdfGenerator.js';

export const hojaServicioController = {
  // GET /api/hojas-servicio - Obtener todas las hojas
  getAll: async (req, res) => {
    try {
      const { estado, fecha_desde, fecha_hasta } = req.query;
      const hojas = await HojaServicioModel.findAll({ 
        estado, 
        fecha_desde, 
        fecha_hasta 
      });
      res.json(hojas);
    } catch (error) {
      console.error('Error al obtener hojas:', error);
      res.status(500).json({ 
        message: 'Error al obtener hojas de servicio', 
        error: error.message 
      });
    }
  },

  // GET /api/hojas-servicio/:id - Obtener una hoja por ID
  getById: async (req, res) => {
    try {
      const hoja = await HojaServicioModel.findById(req.params.id);
      
      if (!hoja) {
        return res.status(404).json({ message: 'Hoja de servicio no encontrada' });
      }

      res.json(hoja);
    } catch (error) {
      console.error('Error al obtener hoja:', error);
      res.status(500).json({ 
        message: 'Error al obtener hoja de servicio', 
        error: error.message 
      });
    }
  },

  // GET /api/hojas-servicio/numero/:numero - Obtener por número de solicitud
  getByNumero: async (req, res) => {
    try {
      const hoja = await HojaServicioModel.findByNumero(req.params.numero);
      
      if (!hoja) {
        return res.status(404).json({ message: 'Hoja de servicio no encontrada' });
      }

      res.json(hoja);
    } catch (error) {
      console.error('Error al obtener hoja:', error);
      res.status(500).json({ 
        message: 'Error al obtener hoja de servicio', 
        error: error.message 
      });
    }
  },

  // POST /api/hojas-servicio - Crear nueva hoja
  create: async (req, res) => {
    try {
      const { hoja, servicios } = req.body;

      // Validaciones
      if (!hoja.razon_social) {
        return res.status(400).json({ message: 'La razón social es requerida' });
      }

      if (!servicios || servicios.length === 0) {
        return res.status(400).json({ message: 'Debe agregar al menos un servicio' });
      }

      // Crear hoja de servicio
      const nuevaHoja = await HojaServicioModel.create(hoja, servicios);

      res.status(201).json({
        message: 'Hoja de servicio creada exitosamente',
        hoja: nuevaHoja
      });
    } catch (error) {
      console.error('Error al crear hoja:', error);
      res.status(500).json({ 
        message: 'Error al crear hoja de servicio', 
        error: error.message 
      });
    }
  },

  // PUT /api/hojas-servicio/:id - Actualizar hoja
  update: async (req, res) => {
    try {
      const hojaActualizada = await HojaServicioModel.update(
        req.params.id, 
        req.body
      );

      if (!hojaActualizada) {
        return res.status(404).json({ message: 'Hoja de servicio no encontrada' });
      }

      res.json({
        message: 'Hoja de servicio actualizada exitosamente',
        hoja: hojaActualizada
      });
    } catch (error) {
      console.error('Error al actualizar hoja:', error);
      res.status(500).json({ 
        message: 'Error al actualizar hoja de servicio', 
        error: error.message 
      });
    }
  },

  // DELETE /api/hojas-servicio/:id - Eliminar hoja
  delete: async (req, res) => {
    try {
      const eliminado = await HojaServicioModel.delete(req.params.id);

      if (!eliminado) {
        return res.status(404).json({ message: 'Hoja de servicio no encontrada' });
      }

      res.json({ message: 'Hoja de servicio eliminada exitosamente' });
    } catch (error) {
      console.error('Error al eliminar hoja:', error);
      res.status(500).json({ 
        message: 'Error al eliminar hoja de servicio', 
        error: error.message 
      });
    }
  },

  // GET /api/hojas-servicio/:id/pdf - Generar PDF
  generarPDF: async (req, res) => {
    try {
      const hoja = await HojaServicioModel.findById(req.params.id);
      
      if (!hoja) {
        return res.status(404).json({ message: 'Hoja de servicio no encontrada' });
      }

      // Generar PDF
      const pdfBuffer = await generarPDFHojaServicio(hoja);

      // Configurar headers para descarga
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition', 
        `attachment; filename="SolicitudServicio_${hoja.numero_solicitud}.pdf"`
      );
      
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      res.status(500).json({ 
        message: 'Error al generar PDF', 
        error: error.message 
      });
    }
  }
};
