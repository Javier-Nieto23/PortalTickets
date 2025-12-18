import { useAuth } from '../context/AuthContext';
import './UserProfile.css';

function UserProfile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          <p>No hay información de usuario disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <span className="avatar-icon">👤</span>
        </div>
        <h2>Perfil de Usuario</h2>
      </div>

      <div className="profile-card">
        <div className="profile-section">
          <h3>Información Personal</h3>
          <div className="profile-grid">
            <div className="profile-field">
              <label>Nombre Completo</label>
              <div className="field-value">
                <span className="field-icon">👤</span>
                <span>{user.nombre} {user.apellido}</span>
              </div>
            </div>

            <div className="profile-field">
              <label>Correo Electrónico</label>
              <div className="field-value">
                <span className="field-icon">📧</span>
                <span>{user.email}</span>
              </div>
            </div>

            <div className="profile-field">
              <label>Rol</label>
              <div className="field-value">
                <span className="field-icon">🎭</span>
                <span className="role-badge">{user.rol || 'usuario'}</span>
              </div>
            </div>

            <div className="profile-field">
              <label>Estado</label>
              <div className="field-value">
                <span className="field-icon">✓</span>
                <span className={`status-badge ${user.activo ? 'active' : 'inactive'}`}>
                  {user.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Información de Empresa</h3>
          <div className="profile-grid">
            <div className="profile-field">
              <label>Nombre de Empresa</label>
              <div className="field-value">
                <span className="field-icon">🏢</span>
                <span>{user.Nombre_Empresa || 'No especificado'}</span>
              </div>
            </div>

            <div className="profile-field">
              <label>RFC</label>
              <div className="field-value">
                <span className="field-icon">📄</span>
                <span>{user.rfc || 'No especificado'}</span>
              </div>
            </div>
          </div>
        </div>

        {user.created_at && (
          <div className="profile-section">
            <h3>Información de Cuenta</h3>
            <div className="profile-grid">
              <div className="profile-field">
                <label>Fecha de Registro</label>
                <div className="field-value">
                  <span className="field-icon">📅</span>
                  <span>{new Date(user.created_at).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
