import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay sesión guardada al cargar
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Validar que los datos del usuario sean válidos
        if (parsedUser && (parsedUser.ID_usuario || parsedUser.id) && parsedUser.email) {
          // Normalizar ID_usuario si viene como 'id'
          if (parsedUser.id && !parsedUser.ID_usuario) {
            parsedUser.ID_usuario = parsedUser.id;
            delete parsedUser.id;
          }
          setUser(parsedUser);
        } else {
          // Si los datos están corruptos, limpiar
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Error al cargar usuario guardado:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Protección adicional: verificar que la sesión no expire
  useEffect(() => {
    if (user) {
      // Guardar timestamp de última actividad
      localStorage.setItem('lastActivity', Date.now().toString());
      
      // Verificar cada 5 minutos si la sesión sigue válida
      const interval = setInterval(() => {
        const lastActivity = localStorage.getItem('lastActivity');
        const savedUser = localStorage.getItem('user');
        
        if (!savedUser || !lastActivity) {
          // Si no hay usuario guardado, cerrar sesión
          setUser(null);
          clearInterval(interval);
        }
      }, 5 * 60 * 1000); // 5 minutos

      return () => clearInterval(interval);
    }
  }, [user]);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const userData = response.user;
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('lastActivity', Date.now().toString());
      return userData;
    } catch (error) {
      throw new Error(error.message || 'Error al iniciar sesión');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('lastActivity');
    // Limpiar cualquier otro dato sensible
    sessionStorage.clear();
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;
