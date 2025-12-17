import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ticketService, authService } from './services/api';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';
import './App.css';

function AppContent() {
  const { user, loading: authLoading, login } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');

  // Cargar tickets cuando el usuario esté autenticado
  useEffect(() => {
    if (user) {
      cargarTickets();
    }
  }, [user]);


  
  const cargarTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ticketService.getAll();
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
      setTickets([...tickets, response.ticket]);
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
      const response = await authService.register(userData);
      // Después de registrar, hacer login automáticamente
      await login({ email: userData.email, password: userData.password });
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
          <p>Cargando...</p>
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

  // Si hay usuario, mostrar dashboard
  return (
    <Dashboard activeSection={activeSection} onSectionChange={setActiveSection}>
      <div className="app-content">
        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        {/* Sección Inicio - Solo mostrar lista de tickets */}
        {activeSection === 'inicio' && (
          <TicketList
            tickets={tickets}
            loading={loading}
            onDelete={handleEliminarTicket}
            onUpdate={handleActualizarTicket}
          />
        )}

        {/* Sección Crear Perfil */}
        {activeSection === 'crear-perfil' && (
          <div className="section-placeholder">
            <h2>Crear Perfil</h2>
            <p>Funcionalidad en desarrollo...</p>
          </div>
        )}

        {/* Sección Crear Hoja de Servicio */}
        {activeSection === 'hoja-servicio' && (
          <div className="section-placeholder">
            <h2>Crear Hoja de Servicio</h2>
            <p>Funcionalidad en desarrollo...</p>
          </div>
        )}

        {/* Sección Activación de Licencia */}
        {activeSection === 'activacion-licencia' && (
          <div className="section-placeholder">
            <h2>Activación de Licencia</h2>
            <p>Funcionalidad en desarrollo...</p>
          </div>
        )}
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

export default App
