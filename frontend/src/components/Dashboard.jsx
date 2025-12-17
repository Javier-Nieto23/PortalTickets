import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

function Dashboard({ children, activeSection, onSectionChange }) {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const sidebarRef = useRef(null);
  const toggleButtonRef = useRef(null);

  // Cerrar sidebar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  const menuItems = [
    { id: 'inicio', label: 'Inicio', icon: '🏠' },
    { id: 'crear-perfil', label: 'Crear Perfil', icon: '👤' },
    { id: 'levantar-ticket', label: 'Levantar Ticket', icon: '🎫' },
    { id: 'activacion-licencia', label: 'Activación de Licencia', icon: '🔑' },
  ];

  return (
    <div className="dashboard">
      {/* Barra superior */}
      <nav className="dashboard-nav">
        <div className="nav-content">
          <button 
            ref={toggleButtonRef}
            className="menu-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>
          
          <div className="nav-brand">
            <h2>Portal CAAST</h2>
          </div>
          
          <div className="nav-user">
            <div className="user-info">
              <span className="user-name">
                {user?.nombre ? `${user.nombre} ${user.apellido || ''}` : user?.email}
              </span>
              <span className="user-role">{user?.rol || 'usuario'}</span>
            </div>
            <button onClick={logout} className="btn-logout">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-body">
        {/* Overlay para cerrar sidebar */}
        {isSidebarOpen && (
          <div 
            className="sidebar-overlay"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Barra lateral */}
        <aside ref={sidebarRef} className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header">
            <h3>Menú</h3>
          </div>

          <nav className="sidebar-menu">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`menu-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => onSectionChange(item.id)}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <p className="version">v1.0.0</p>
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="dashboard-content">
          <div className="content-header">
            <h1>{menuItems.find(item => item.id === activeSection)?.label || 'Inicio'}</h1>
          </div>
          
          <div className="content-body">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
