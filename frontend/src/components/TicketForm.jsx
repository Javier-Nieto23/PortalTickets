import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './TicketForm.css';

function TicketForm({ onTicketCreated }) {
  const { user } = useAuth();
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    descripcion: '',
    prioridad: 'media',
    estado: 'abierto'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const servicios = [
    { id: 'soporte-tecnico', nombre: 'Soporte Técnico', icon: '🔧', color: '#FF6B35' },
    { id: 'problemas-red', nombre: 'Problemas de Red', icon: '🌐', color: '#F7931E' },
    { id: 'apartado-c', nombre: 'Apartado C', icon: '📦', color: '#FF8C42' },
    { id: 'accesos-permisos', nombre: 'Accesos y Permisos', icon: '🔐', color: '#FFA07A' },
    { id: 'instalacion-seer', nombre: 'Instalación Seer Tráfico', icon: '🚦', color: '#FF7F50' },
    { id: 'reactivacion-licencia', nombre: 'Reactivación de Licencia', icon: '🔑', color: '#FF9966' },
    { id: 'otros', nombre: 'Otros', icon: '📋', color: '#FFB347' }
  ];

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
    if (!selectedService) {
      newErrors.servicio = 'Debes seleccionar un servicio';
    }
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
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
        titulo: selectedService.nombre,
        descripcion: formData.descripcion,
        prioridad: formData.prioridad,
        estado: formData.estado,
        ID_empleado: user?.ID_usuario || null,
        ID_Empresa: user?.ID_Empresa || null
      };
      
      console.log('Datos del ticket:', ticketDataConUsuario); // Debug
      
      await onTicketCreated(ticketDataConUsuario);
      // Limpiar formulario
      setSelectedService(null);
      setFormData({
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
      
      {!selectedService ? (
        <div className="services-selection">
          <h3>Selecciona el tipo de servicio</h3>
          <div className="services-grid">
            {servicios.map((servicio) => (
              <div
                key={servicio.id}
                className="service-card"
                onClick={() => setSelectedService(servicio)}
                style={{ borderColor: servicio.color }}
              >
                <div className="service-icon" style={{ color: servicio.color }}>
                  {servicio.icon}
                </div>
                <h4>{servicio.nombre}</h4>
              </div>
            ))}
          </div>
          {errors.servicio && <span className="error-message">{errors.servicio}</span>}
        </div>
      ) : (
        <div className="ticket-form-wrapper">
          <div className="selected-service-header">
            <div className="selected-service-info">
              <span className="service-icon-large" style={{ color: selectedService.color }}>
                {selectedService.icon}
              </span>
              <div>
                <h3>{selectedService.nombre}</h3>
                {user && (
                  <p className="user-info-text">
                    Ticket creado por: <strong>{user.nombre ? `${user.nombre} ${user.apellido || ''}` : user.email}</strong>
                    {user.nombre_empresa && <> | Empresa: <strong>{user.nombre_empresa}</strong></>}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              className="btn-back"
              onClick={() => {
                setSelectedService(null);
                setFormData({ descripcion: '', prioridad: 'media', estado: 'abierto' });
                setErrors({});
              }}
            >
              ← Cambiar servicio
            </button>
          </div>

          <form onSubmit={handleSubmit} className="ticket-form">
            <div className="form-group">
              <label htmlFor="descripcion">Descripción del problema *</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Describe detalladamente el problema..."
                rows="6"
                disabled={isSubmitting}
                className={errors.descripcion ? 'error' : ''}
              />
              {errors.descripcion && <span className="error-message">{errors.descripcion}</span>}
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
      )}
    </div>
  );
}

export default TicketForm;
