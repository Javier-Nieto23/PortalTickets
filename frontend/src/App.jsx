import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ticketService, authService } from './services/api';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import TicketList from './components/TicketList';
import TicketForm from './components/TicketForm';
import './App.css';

function AppContent() {
  const { user, loading: authLoading, login } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [successMessage, setSuccessMessage] = useState(null);

  // Protección: Verificar autenticación en cada render
  useEffect(() => {
    if (!authLoading && !user) {
      // Si no está cargando y no hay usuario, asegurar que esté en login
      setShowRegister(false);
      setActiveSection('inicio');
    }
  }, [authLoading, user]);

  // Cargar tickets cuando el usuario esté autenticado
  useEffect(() => {
    if (user) {
      cargarTickets();
    } else {
      // Si no hay usuario, limpiar tickets
      setTickets([]);
      setLoading(false);
    }
  }, [user]);

  const cargarTickets = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await ticketService.getAll(user.id);
      setTickets(data);
    } catch (err) {
      setError('Error al cargar los tickets: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearTicket = async (ticketData) => {
    try {
      const response = await ticketService.create(ticketData);
      // Recargar tickets desde la base de datos
      await cargarTickets();
      // Cambiar a la sección de inicio para mostrar el ticket creado
      setActiveSection('inicio');
      // Mostrar mensaje de éxito
      setSuccessMessage('Ticket creado exitosamente');
      setError(null);
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(null), 3000);
      return response;
    } catch (err) {
      throw new Error('Error al crear el ticket: ' + err.message);
    }
  };

  const handleActualizarTicket = async (id, ticketData) => {
    try {
      const response = await ticketService.update(id, ticketData);
      setTickets(tickets.map(t => t.id === id ? response.ticket : t));
    } catch (err) {
      setError('Error al actualizar el ticket: ' + err.message);
      console.error(err);
    }
  };

  const handleEliminarTicket = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este ticket?')) {
      return;
    }

    try {
      await ticketService.delete(id);
      setTickets(tickets.filter(t => t.id !== id));
    } catch (err) {
      setError('Error al eliminar el ticket: ' + err.message);
      console.error(err);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
    } catch (error) {
      throw error;
    }
  };

  const handleRegister = async (userData) => {
    try {
      await authService.register(userData);
      // Después del registro exitoso, iniciar sesión automáticamente
      await login({ email: userData.email, password: userData.password });
      setShowRegister(false);
    } catch (error) {
      throw error;
    }
  };

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading) {
    return (
      <div className="App">
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, mostrar login o registro
  if (!user) {
    if (showRegister) {
      return (
        <Register 
          onRegister={handleRegister}
          onBackToLogin={() => setShowRegister(false)}
        />
      );
    }
    return (
      <Login 
        onLogin={handleLogin}
        onShowRegister={() => setShowRegister(true)}
      />
    );
  }

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'inicio':
        return (
          <>
            {successMessage && (
              <div className="success-banner">
                {successMessage}
                <button onClick={() => setSuccessMessage(null)}>✕</button>
              </div>
            )}
            {error && (
              <div className="error-banner">
                {error}
                <button onClick={() => setError(null)}>✕</button>
              </div>
            )}
            <TicketList
              tickets={tickets}
              loading={loading}
              onDelete={handleEliminarTicket}
              onUpdate={handleActualizarTicket}
            />
          </>
        );
      case 'crear-perfil':
        return <div className="section-placeholder">Sección: Crear Perfil (Próximamente)</div>;
      case 'levantar-ticket':
        return (
          <div className="levantar-ticket-section">
            <TicketForm onTicketCreated={handleCrearTicket} />
          </div>
        );
      case 'activacion-licencia':
        return <div className="section-placeholder">Sección: Activación de Licencia (Próximamente)</div>;
      default:
        return <div>Selecciona una opción del menú</div>;
    }
  };

  // Si hay usuario, mostrar dashboard
  return (
    <Dashboard 
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      <div className="app-content">
        {renderSectionContent()}
      </div>
    </Dashboard>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
