import Empresa from '../models/Empresa.js';

// Obtener todas las empresas
export const obtenerEmpresas = async (req, res) => {
  try {
    const empresas = await Empresa.findAll();
    res.json(empresas);
  } catch (error) {
    console.error('Error al obtener empresas:', error);
    res.status(500).json({ 
      mensaje: 'Error al obtener empresas',
      error: error.message 
    });
  }
};

// Obtener empresa por ID
export const obtenerEmpresaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const empresa = await Empresa.findById(id);
    
    if (!empresa) {
      return res.status(404).json({ mensaje: 'Empresa no encontrada' });
    }

    res.json(empresa);
  } catch (error) {
    console.error('Error al obtener empresa:', error);
    res.status(500).json({ 
      mensaje: 'Error al obtener empresa',
      error: error.message 
    });
  }
};

// Crear nueva empresa
export const crearEmpresa = async (req, res) => {
  try {
    const { Nombre_Empresa, rfc } = req.body;

    if (!Nombre_Empresa) {
      return res.status(400).json({ 
        mensaje: 'El nombre de la empresa es obligatorio' 
      });
    }

    const empresaExistente = await Empresa.findByName(Nombre_Empresa);
    if (empresaExistente) {
      return res.status(400).json({ 
        mensaje: 'Ya existe una empresa con ese nombre' 
      });
    }

    const nuevaEmpresa = await Empresa.create({ Nombre_Empresa, rfc });

    res.status(201).json({ 
      mensaje: 'Empresa creada exitosamente',
      empresa: nuevaEmpresa 
    });
  } catch (error) {
    console.error('Error al crear empresa:', error);
    res.status(500).json({ 
      mensaje: 'Error al crear empresa',
      error: error.message 
    });
  }
};

// Buscar o crear empresa
export const buscarOCrearEmpresa = async (req, res) => {
  try {
    const { Nombre_Empresa, rfc } = req.body;

    if (!Nombre_Empresa) {
      return res.status(400).json({ 
        mensaje: 'El nombre de la empresa es obligatorio' 
      });
    }

    const empresa = await Empresa.findOrCreate(Nombre_Empresa, rfc);

    res.json({ 
      mensaje: empresa ? 'Empresa encontrada' : 'Empresa creada',
      empresa 
    });
  } catch (error) {
    console.error('Error al buscar/crear empresa:', error);
    res.status(500).json({ 
      mensaje: 'Error al buscar/crear empresa',
      error: error.message 
    });
  }
};

// Actualizar empresa
export const actualizarEmpresa = async (req, res) => {
  try {
    const { id } = req.params;
    const { Nombre_Empresa, rfc } = req.body;

    const empresa = await Empresa.findById(id);
    if (!empresa) {
      return res.status(404).json({ mensaje: 'Empresa no encontrada' });
    }

    const empresaActualizada = await Empresa.update(id, { Nombre_Empresa, rfc });

    res.json({ 
      mensaje: 'Empresa actualizada exitosamente',
      empresa: empresaActualizada 
    });
  } catch (error) {
    console.error('Error al actualizar empresa:', error);
    res.status(500).json({ 
      mensaje: 'Error al actualizar empresa',
      error: error.message 
    });
  }
};

// Eliminar empresa
export const eliminarEmpresa = async (req, res) => {
  try {
    const { id } = req.params;
    const empresa = await Empresa.findById(id);
    
    if (!empresa) {
      return res.status(404).json({ mensaje: 'Empresa no encontrada' });
    }

    await Empresa.delete(id);
    res.json({ mensaje: 'Empresa eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar empresa:', error);
    res.status(500).json({ 
      mensaje: 'Error al eliminar empresa',
      error: error.message 
    });
  }
};
