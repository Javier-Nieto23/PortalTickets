import { Equipo } from '../models/Equipo.js';
import Empresa from '../models/Empresa.js';
import { UserModel } from '../models/User.js';

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
    const { empresa, rfcEmpresa } = req.body;
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

    let usuario_id = equipo.usuario_id;

    // Si se está cambiando la empresa (solo admin) y se proporcionó una empresa diferente
    if (empresa && empresa.trim() !== '' && req.usuario.rol === 'admin') {
      // Solo procesar si la empresa cambió
      const empresaActual = equipo.Nombre_Empresa || '';
      const empresaNueva = empresa.trim();
      
      if (empresaActual !== empresaNueva) {
        console.log(`Cambiando empresa de "${empresaActual}" a "${empresaNueva}"`);
        
        // Buscar o crear la empresa
        const empresaDB = await Empresa.findOrCreate(empresaNueva, rfcEmpresa);
        console.log('Empresa DB:', empresaDB);
        console.log('ID_Empresa de empresaDB:', empresaDB.ID_Empresa, 'o id_empresa:', empresaDB.id_empresa);
        
        // Buscar o crear un usuario cliente para esa empresa (usar id en minúsculas o mayúsculas)
        const idEmpresa = empresaDB.ID_Empresa || empresaDB.id_empresa;
        console.log('Pasando ID_Empresa a findOrCreateCliente:', idEmpresa);
        
        const clienteUsuario = await UserModel.findOrCreateCliente(idEmpresa, empresaNueva);
        console.log('Cliente creado/encontrado:', clienteUsuario);
        
        // Actualizar el usuario_id al nuevo cliente (puede estar en minúsculas o mayúsculas)
        usuario_id = clienteUsuario.ID_usuario || clienteUsuario.id_usuario;
        console.log('usuario_id asignado:', usuario_id);
      } else {
        console.log('Empresa no cambió, manteniendo usuario_id:', usuario_id);
      }
    }

    // Asegurar que usuario_id nunca sea null o undefined
    if (!usuario_id) {
      console.error('ERROR: usuario_id es null o undefined');
      console.error('equipo.usuario_id original:', equipo.usuario_id);
      console.error('empresa recibida:', empresa);
      return res.status(400).json({ 
        mensaje: 'Error: No se pudo determinar el usuario asociado al equipo' 
      });
    }

    const equipoActualizado = await Equipo.update(id, {
      usuario_id: usuario_id,
      tipo_equipo: req.body.tipo_equipo || equipo.tipo_equipo,
      marca: req.body.marca || equipo.marca,
      modelo: req.body.modelo || equipo.modelo,
      numero_serie: req.body.numero_serie || equipo.numero_serie,
      Nombre_Empleado: req.body.Nombre_Empleado || equipo.Nombre_Empleado,
      sistema_operativo: req.body.sistema_operativo !== undefined ? req.body.sistema_operativo : equipo.sistema_operativo,
      procesador: req.body.procesador !== undefined ? req.body.procesador : equipo.procesador,
      ram: req.body.ram !== undefined ? req.body.ram : equipo.ram,
      disco_duro: req.body.disco_duro !== undefined ? req.body.disco_duro : equipo.disco_duro,
      observaciones: req.body.observaciones !== undefined ? req.body.observaciones : equipo.observaciones
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
    const { tipo_equipo, marca, modelo, numero_serie, Nombre_Empleado, empresa, rfcEmpresa, sistema_operativo, procesador, ram, disco_duro, observaciones } = req.body;

    // Validar campos requeridos
    if (!tipo_equipo || !marca || !modelo || !numero_serie || !Nombre_Empleado || !empresa) {
      return res.status(400).json({ 
        mensaje: 'Los campos Tipo de Equipo, Marca, Modelo, Número de Serie, Nombre del Empleado y Empresa son obligatorios' 
      });
    }

    // Verificar que el número de serie no exista
    const existe = await Equipo.existsByNumeroSerie(numero_serie);
    if (existe) {
      return res.status(400).json({ 
        mensaje: 'Ya existe un equipo con ese número de serie' 
      });
    }

    // 1. Buscar o crear la empresa
    const empresaDB = await Empresa.findOrCreate(empresa, rfcEmpresa);
    console.log('Empresa DB (manual):', empresaDB);
    
    // 2. Buscar o crear un usuario cliente para esa empresa (manejar mayúsculas/minúsculas)
    const idEmpresa = empresaDB.ID_Empresa || empresaDB.id_empresa;
    console.log('ID_Empresa para cliente (manual):', idEmpresa);
    
    const clienteUsuario = await UserModel.findOrCreateCliente(idEmpresa, empresa);
    console.log('Cliente creado (manual):', clienteUsuario);
    
    // 3. Crear el equipo asociado al cliente (manejar mayúsculas/minúsculas)
    const idUsuario = clienteUsuario.ID_usuario || clienteUsuario.id_usuario;
    console.log('ID_usuario para equipo (manual):', idUsuario);
    
    if (!idUsuario) {
      console.error('ERROR: No se pudo obtener ID de usuario');
      return res.status(500).json({ 
        mensaje: 'Error al crear usuario cliente para la empresa' 
      });
    }
    
    const nuevoEquipo = await Equipo.create({
      usuario_id: idUsuario,
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
      mensaje: 'Equipo y empresa registrados exitosamente',
      equipo: nuevoEquipo,
      empresa: empresaDB,
      cliente: { ID_usuario: clienteUsuario.ID_usuario }
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
