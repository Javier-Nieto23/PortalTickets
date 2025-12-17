import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './TicketForm.css';

function TicketForm({ onTicketCreated }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    prioridad: 'media',
    estado: 'abierto'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El motivo es requerido';
    }
    if (formData.titulo.length > 100) {
      newErrors.titulo = 'El motivo no puede exceder 100 caracteres';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Agregar información del usuario que crea el ticket
      console.log('Usuario actual:', user); // Debug
      
      let nombreCompleto = 'Usuario desconocido';
      
      if (user) {
        if (user.nombre && user.apellido) {
          nombreCompleto = `${user.nombre} ${user.apellido}`.trim();
        } else if (user.nombre) {
          nombreCompleto = user.nombre;
        } else if (user.email) {
          nombreCompleto = user.email;
        }
      }
      
      const ticketDataConUsuario = {
        ...formData,
        creadoPor: nombreCompleto,
        usuarioId: user?.id || null,
        empresa: user?.nombre_empresa || 'Sin empresa'
      };
      
      console.log('Datos del ticket:', ticketDataConUsuario); // Debug
      
      await onTicketCreated(ticketDataConUsuario);
      // Limpiar formulario
      setFormData({
        titulo: '',
        descripcion: '',
        prioridad: 'media',
        estado: 'abierto'
      });
      setErrors({});
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ticket-form-container">
      <h2>Levantar Ticket de Servicio</h2>
      {user && (user.nombre || user.email) && (
        <div className="user-info-banner">
          <span className="info-icon">ℹ️</span>
          <span>Este ticket será creado por: <strong>{user.nombre ? `${user.nombre} ${user.apellido || ''}` : user.email}</strong></span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="ticket-form">
        <div className="form-group">
          <label htmlFor="titulo">Motivo *</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            placeholder="Motivo del ticket"
            className={errors.titulo ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.titulo && <span className="error-message">{errors.titulo}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Descripción del problema"
            rows="4"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="prioridad">Prioridad</label>
          <select
            id="prioridad"
            name="prioridad"
            value={formData.prioridad}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </div>

        {errors.submit && (
          <div className="error-message submit-error">{errors.submit}</div>
        )}

        <button type="submit" disabled={isSubmitting} className="btn-submit">
          {isSubmitting ? 'Creando...' : 'Crear Ticket'}
        </button>
      </form>
    </div>
  );
}

export default TicketForm;
