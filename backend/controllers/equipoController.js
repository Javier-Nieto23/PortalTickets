import { Equipo } from '../models/Equipo.js';

// Crear nuevo equipo
export const crearEquipo = async (req, res) => {
  try {
    const { usuario_id, tipo_equipo, marca, modelo, numero_serie, Nombre_Empleado, sistema_operativo, procesador, ram, disco_duro, observaciones } = req.body;

    // Validar campos requeridos
    if (!usuario_id || !tipo_equipo || !marca || !modelo || !numero_serie || !Nombre_Empleado) {
      return res.status(400).json({ 
        mensaje: 'Los campos Usuario, Tipo de Equipo, Marca, Modelo, Número de Serie y Nombre del Empleado son obligatorios' 
      });
    }

    // Verificar que el número de serie no exista
    const existe = await Equipo.existsByNumeroSerie(numero_serie);
    if (existe) {
      return res.status(400).json({ 
        mensaje: 'Ya existe un equipo con ese número de serie' 
      });
    }

    const nuevoEquipo = await Equipo.create({
      usuario_id,
      tipo_equipo,
      marca,
      modelo,
      numero_serie,
      Nombre_Empleado,
      sistema_operativo,
      procesador,
      ram,
      disco_duro,
      observaciones
    });

    res.status(201).json({ 
      mensaje: 'Equipo registrado exitosamente',
      equipo: nuevoEquipo 
    });
  } catch (error) {
    console.error('Error al crear equipo:', error);
    res.status(500).json({ 
      mensaje: 'Error al registrar el equipo',
      error: error.message 
    });
  }
};

// Obtener equipos del usuario autenticado
export const obtenerMisEquipos = async (req, res) => {
  try {
    const usuario_id = req.usuario.ID_usuario;
    const equipos = await Equipo.findByUsuarioId(usuario_id);
    res.json(equipos);
  } catch (error) {
    console.error('Error al obtener equipos:', error);
    res.status(500).json({ 
      mensaje: 'Error al obtener equipos',
      error: error.message 
    });
  }
};

// Obtener todos los equipos (admin)
export const obtenerTodosLosEquipos = async (req, res) => {
  try {
    const equipos = await Equipo.findAll();
    res.json(equipos);
  } catch (error) {
    console.error('Error al obtener equipos:', error);
    res.status(500).json({ 
      mensaje: 'Error al obtener equipos',
      error: error.message 
    });
  }
};

// Obtener equipo por ID
export const obtenerEquipoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const equipo = await Equipo.findById(id);
    
    if (!equipo) {
      return res.status(404).json({ mensaje: 'Equipo no encontrado' });
    }

    // Verificar que el usuario tenga permiso (admin o dueño del equipo)
    if (req.usuario.rol !== 'admin' && equipo.usuario_id !== req.usuario.ID_usuario) {
      return res.status(403).json({ mensaje: 'No tienes permiso para ver este equipo' });
    }

    res.json(equipo);
  } catch (error) {
    console.error('Error al obtener equipo:', error);
    res.status(500).json({ 
      mensaje: 'Error al obtener equipo',
      error: error.message 
    });
  }
};

// Actualizar equipo
export const actualizarEquipo = async (req, res) => {
  try {
    const { id } = req.params;
    const equipo = await Equipo.findById(id);
    
    if (!equipo) {
      return res.status(404).json({ mensaje: 'Equipo no encontrado' });
    }

    // Verificar permisos
    if (req.usuario.rol !== 'admin' && equipo.usuario_id !== req.usuario.ID_usuario) {
      return res.status(403).json({ mensaje: 'No tienes permiso para modificar este equipo' });
    }

    // Si se está cambiando el número de serie, verificar que no exista
    if (req.body.numero_serie && req.body.numero_serie !== equipo.numero_serie) {
      const existe = await Equipo.existsByNumeroSerie(req.body.numero_serie, id);
      if (existe) {
        return res.status(400).json({ 
          mensaje: 'Ya existe un equipo con ese número de serie' 
        });
      }
    }

    const equipoActualizado = await Equipo.update(id, {
      tipo_equipo: req.body.tipo_equipo || equipo.tipo_equipo,
      marca: req.body.marca || equipo.marca,
      modelo: req.body.modelo || equipo.modelo,
      numero_serie: req.body.numero_serie || equipo.numero_serie,
      Nombre_Empleado: req.body.Nombre_Empleado || equipo.Nombre_Empleado,
      sistema_operativo: req.body.sistema_operativo,
      procesador: req.body.procesador,
      ram: req.body.ram,
      disco_duro: req.body.disco_duro,
      observaciones: req.body.observaciones
    });

    res.json({ 
      mensaje: 'Equipo actualizado exitosamente',
      equipo: equipoActualizado 
    });
  } catch (error) {
    console.error('Error al actualizar equipo:', error);
    res.status(500).json({ 
      mensaje: 'Error al actualizar equipo',
      error: error.message 
    });
  }
};

// Crear equipo manualmente (admin) con empresa personalizada
export const crearEquipoManual = async (req, res) => {
  try {
    const { usuario_id, tipo_equipo, marca, modelo, numero_serie, Nombre_Empleado, empresa, sistema_operativo, procesador, ram, disco_duro, observaciones } = req.body;

    // Validar campos requeridos
    if (!usuario_id || !tipo_equipo || !marca || !modelo || !numero_serie || !Nombre_Empleado || !empresa) {
      return res.status(400).json({ 
        mensaje: 'Los campos Usuario, Tipo de Equipo, Marca, Modelo, Número de Serie, Nombre del Empleado y Empresa son obligatorios' 
      });
    }

    // Verificar que el número de serie no exista
    const existe = await Equipo.existsByNumeroSerie(numero_serie);
    if (existe) {
      return res.status(400).json({ 
        mensaje: 'Ya existe un equipo con ese número de serie' 
      });
    }

    const nuevoEquipo = await Equipo.createManual({
      usuario_id,
      tipo_equipo,
      marca,
      modelo,
      numero_serie,
      Nombre_Empleado,
      empresa,
      sistema_operativo,
      procesador,
      ram,
      disco_duro,
      observaciones
    });

    res.status(201).json({ 
      mensaje: 'Equipo registrado exitosamente',
      equipo: nuevoEquipo 
    });
  } catch (error) {
    console.error('Error al crear equipo manual:', error);
    res.status(500).json({ 
      mensaje: 'Error al registrar el equipo',
      error: error.message 
    });
  }
};

// Eliminar equipo
export const eliminarEquipo = async (req, res) => {
  try {
    const { id } = req.params;
    const equipo = await Equipo.findById(id);
    
    if (!equipo) {
      return res.status(404).json({ mensaje: 'Equipo no encontrado' });
    }

    // Verificar permisos
    if (req.usuario.rol !== 'admin' && equipo.usuario_id !== req.usuario.ID_usuario) {
      return res.status(403).json({ mensaje: 'No tienes permiso para eliminar este equipo' });
    }

    await Equipo.delete(id);
    res.json({ mensaje: 'Equipo eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar equipo:', error);
    res.status(500).json({ 
      mensaje: 'Error al eliminar equipo',
      error: error.message 
    });
  }
};
