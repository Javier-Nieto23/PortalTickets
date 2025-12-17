import { useState } from 'react';
import './Register.css';

function Register({ onRegister, onBackToLogin }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    hasLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecial: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validar contraseña en tiempo real
    if (name === 'password') {
      validatePasswordStrength(value);
    }

    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validatePasswordStrength = (password) => {
    setPasswordStrength({
      hasLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[@$!%*?&]/.test(password)
    });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
      newErrors.password = 'La contraseña no cumple con los requisitos de seguridad';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
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
    setErrors({});

    try {
      const { confirmPassword, ...registerData } = formData;
      await onRegister(registerData);
    } catch (error) {
      setErrors({ submit: error.message || 'Error al registrar usuario' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const allRequirementsMet = Object.values(passwordStrength).every(v => v === true);

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>📋 Crear Cuenta</h1>
          <p>Regístrate para acceder al portal</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Tu nombre"
                className={errors.nombre ? 'error' : ''}
                disabled={isSubmitting}
                autoComplete="given-name"
              />
              {errors.nombre && <span className="error-message">{errors.nombre}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="apellido">Apellido *</label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Tu apellido"
                className={errors.apellido ? 'error' : ''}
                disabled={isSubmitting}
                autoComplete="family-name"
              />
              {errors.apellido && <span className="error-message">{errors.apellido}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              className={errors.email ? 'error' : ''}
              disabled={isSubmitting}
              autoComplete="email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={errors.password ? 'error' : ''}
              disabled={isSubmitting}
              autoComplete="new-password"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
            
            {formData.password && (
              <div className="password-requirements">
                <p className="requirements-title">Requisitos de contraseña:</p>
                <ul>
                  <li className={passwordStrength.hasLength ? 'met' : ''}>
                    {passwordStrength.hasLength ? '✓' : '○'} Mínimo 8 caracteres
                  </li>
                  <li className={passwordStrength.hasUpperCase ? 'met' : ''}>
                    {passwordStrength.hasUpperCase ? '✓' : '○'} Al menos 1 mayúscula
                  </li>
                  <li className={passwordStrength.hasNumber ? 'met' : ''}>
                    {passwordStrength.hasNumber ? '✓' : '○'} Al menos 1 número
                  </li>
                  <li className={passwordStrength.hasSpecial ? 'met' : ''}>
                    {passwordStrength.hasSpecial ? '✓' : '○'} Al menos 1 signo especial (@$!%*?&)
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className={errors.confirmPassword ? 'error' : ''}
              disabled={isSubmitting}
              autoComplete="new-password"
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          {errors.submit && (
            <div className="error-message submit-error">{errors.submit}</div>
          )}

          <button type="submit" disabled={isSubmitting || !allRequirementsMet} className="btn-register">
            {isSubmitting ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="register-footer">
          <p>
            ¿Ya tienes cuenta?{' '}
            <button onClick={onBackToLogin} className="link-button">
              Iniciar Sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
