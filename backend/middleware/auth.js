import { UserModel } from '../models/User.js';

// Middleware simple para verificar autenticación
// Este sistema no usa JWT real, simplemente verifica que el usuario exista
export const verificarToken = async (req, res, next) => {
  try {
    // Obtener token del header Authorization o del body
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    // Si no hay token en header, buscar usuario_id en body (para compatibilidad)
    if (!token && !req.body.usuario_id) {
      return res.status(401).json({ 
        mensaje: 'Autenticación requerida. Token no proporcionado.' 
      });
    }

    let usuario;
    
    if (token) {
      // Intentar parsear el token como JSON (contiene info del usuario)
      try {
        const userData = JSON.parse(decodeURIComponent(token));
        usuario = await UserModel.findById(userData.ID_usuario || userData.id);
      } catch {
        // Si falla el parse, asumir que es un email
        usuario = await UserModel.findByEmail(token);
      }
    } else if (req.body.usuario_id) {
      // Usar el usuario_id del body
      usuario = await UserModel.findById(req.body.usuario_id);
    }
    
    if (!usuario) {
      return res.status(401).json({ 
        mensaje: 'Usuario no encontrado. Autenticación inválida.' 
      });
    }

    // Agregar usuario a la request
    req.usuario = {
      ID_usuario: usuario.ID_usuario,
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      rol: usuario.rol,
      ID_Empresa: usuario.ID_Empresa,
      Nombre_Empresa: usuario.Nombre_Empresa,
      rfc: usuario.rfc
    };

    next();
  } catch (error) {
    console.error('Error en verificarToken:', error);
    return res.status(500).json({ 
      mensaje: 'Error al verificar autenticación',
      error: error.message 
    });
  }
};

// Middleware para verificar rol de administrador
export const verificarAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ 
      mensaje: 'Acceso denegado. Se requiere rol de administrador.' 
    });
  }
  next();
};
