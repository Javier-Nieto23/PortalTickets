import { useState } from 'react';
import TicketCard from './TicketCard';
import './TicketList.css';

function TicketList({ tickets, onDelete, onUpdate, loading, userRole }) {
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroPrioridad, setFiltroPrioridad] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  const ticketsFiltrados = tickets.filter(ticket => {
    const matchEstado = filtroEstado === 'todos' || ticket.estado === filtroEstado;
    const matchPrioridad = filtroPrioridad === 'todos' || ticket.prioridad === filtroPrioridad;
    const matchBusqueda = ticket.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                         (ticket.descripcion && ticket.descripcion.toLowerCase().includes(busqueda.toLowerCase()));
    
    return matchEstado && matchPrioridad && matchBusqueda;
  });

  return (
    <div className="ticket-list-container">
      <div className="list-header">
        <h2>Tickets ({ticketsFiltrados.length})</h2>
        
        <div className="filters">
          <input
            type="text"
            placeholder="Buscar tickets..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="search-input"
          />

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="filter-select"
          >
            <option value="todos">Todos los estados</option>
            <option value="abierto">Abierto</option>
            <option value="en progreso">En Progreso</option>
            <option value="cerrado">Cerrado</option>
          </select>

          <select
            value={filtroPrioridad}
            onChange={(e) => setFiltroPrioridad(e.target.value)}
            className="filter-select"
          >
            <option value="todos">Todas las prioridades</option>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando tickets...</p>
        </div>
      ) : ticketsFiltrados.length === 0 ? (
        <div className="empty-state">
          <p>No se encontraron tickets</p>
          {(busqueda || filtroEstado !== 'todos' || filtroPrioridad !== 'todos') && (
            <button
              onClick={() => {
                setBusqueda('');
                setFiltroEstado('todos');
                setFiltroPrioridad('todos');
              }}
              className="btn-clear-filters"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="tickets-grid">
          {ticketsFiltrados.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onDelete={onDelete}
              onUpdate={onUpdate}
              isAdmin={userRole === 'admin'}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TicketList;
