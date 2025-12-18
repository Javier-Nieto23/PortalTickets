import './TicketCard.css';

function TicketCard({ ticket, onDelete, onUpdate, isAdmin = false }) {
  const handleStatusChange = (newStatus) => {
    onUpdate(ticket.id, { ...ticket, estado: newStatus });
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="ticket-card">
      <div className="ticket-header">
        <span className={`ticket-priority priority-${ticket.prioridad}`}>
          {ticket.prioridad}
        </span>
        <span className={`ticket-status status-${ticket.estado?.replace(' ', '-')}`}>
          {ticket.estado}
        </span>
      </div>

      <h3 className="ticket-title">{ticket.titulo}</h3>
      
      {ticket.descripcion && (
        <p className="ticket-description">{ticket.descripcion}</p>
      )}

      <div className="ticket-metadata">
        {ticket.creado_por && (
          <p className="ticket-creator">
            <span className="creator-icon">👤</span>
            <span>Creado por: <strong>{ticket.creado_por}</strong></span>
          </p>
        )}
        {ticket.empresa && (
          <p className="ticket-empresa">
            <span className="empresa-icon">🏢</span>
            <span>Empresa: <strong>{ticket.empresa}</strong></span>
          </p>
        )}
        {ticket.fecha && (
          <p className="ticket-date">
            <span className="date-icon">📅</span>
            <span>{formatDate(ticket.fecha)}</span>
          </p>
        )}
      </div>

      {isAdmin && (
        <div className="ticket-actions">
          <select
            className="status-select"
            value={ticket.estado}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option value="abierto">Abierto</option>
            <option value="en progreso">En Progreso</option>
            <option value="cerrado">Cerrado</option>
          </select>

          <button
            className="btn-delete"
            onClick={() => onDelete(ticket.id)}
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}

export default TicketCard;
