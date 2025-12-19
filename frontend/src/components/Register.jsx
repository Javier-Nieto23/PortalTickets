import { useState } from 'react';
import './Register.css';

function Register({ onRegister, onBackToLogin }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    rfc: '',
    nombreEmpresa: '',
    rfcEmpresa: '',
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
    hasSpecialChar: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validar fortaleza de contraseña en tiempo real
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
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[@$!%*?&]/.test(password)
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

    if (!formData.rfc.trim()) {
      newErrors.rfc = 'El RFC es requerido';
    } else if (formData.rfc.length !== 12 && formData.rfc.length !== 13) {
      newErrors.rfc = 'El RFC debe tener 12 o 13 caracteres';
    }

    if (!formData.nombreEmpresa.trim()) {
      newErrors.nombreEmpresa = 'El nombre de la empresa es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (!passwordStrength.hasLength || !passwordStrength.hasUpperCase || 
               !passwordStrength.hasNumber || !passwordStrength.hasSpecialChar) {
      newErrors.password = 'La contraseña no cumple todos los requisitos';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
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
      setErrors({ submit: error.message || 'Error al registrarse' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const allRequirementsMet = Object.values(passwordStrength).every(Boolean);

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>Crear Cuenta</h1>
          <p>Únete al Portal CAAST</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              disabled={isSubmitting}
              className={errors.nombre ? 'error' : ''}
            />
            {errors.nombre && <span className="error-message">{errors.nombre}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="apellido">Apellido</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              disabled={isSubmitting}
              className={errors.apellido ? 'error' : ''}
            />
            {errors.apellido && <span className="error-message">{errors.apellido}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="rfc">RFC</label>
            <input
              type="text"
              id="rfc"
              name="rfc"
              value={formData.rfc}
              onChange={handleChange}
              disabled={isSubmitting}
              className={errors.rfc ? 'error' : ''}
              maxLength="13"
              placeholder="XAXX010101000"
              style={{ textTransform: 'uppercase' }}
              required
            />
            {errors.rfc && <span className="error-message">{errors.rfc}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="nombreEmpresa">Nombre Empresa</label>
            <input
              type="text"
              id="nombreEmpresa"
              name="nombreEmpresa"
              value={formData.nombreEmpresa}
              onChange={handleChange}
              disabled={isSubmitting}
              className={errors.nombreEmpresa ? 'error' : ''}
              placeholder="Ej: CAAST Tecnología"
              required
            />
            {errors.nombreEmpresa && <span className="error-message">{errors.nombreEmpresa}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="rfcEmpresa">RFC Empresa (Opcional)</label>
            <input
              type="text"
              id="rfcEmpresa"
              name="rfcEmpresa"
              value={formData.rfcEmpresa}
              onChange={handleChange}
              disabled={isSubmitting}
              className={errors.rfcEmpresa ? 'error' : ''}
              maxLength="13"
              placeholder="RFC de la empresa"
              style={{ textTransform: 'uppercase' }}
            />
            {errors.rfcEmpresa && <span className="error-message">{errors.rfcEmpresa}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
            
            <div className="password-requirements">
              <p className="requirements-title">La contraseña debe tener:</p>
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
                <li className={passwordStrength.hasSpecialChar ? 'met' : ''}>
                  {passwordStrength.hasSpecialChar ? '✓' : '○'} Al menos 1 signo (@$!%*?&)
                </li>
              </ul>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isSubmitting}
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          {errors.submit && (
            <div className="submit-error">
              <span className="error-message">{errors.submit}</span>
            </div>
          )}

          <button 
            type="submit" 
            className="btn-register"
            disabled={isSubmitting || !allRequirementsMet}
          >
            {isSubmitting ? 'Registrando...' : 'Registrarse'}
          </button>

          <button 
            type="button" 
            className="btn-back"
            onClick={onBackToLogin}
            disabled={isSubmitting}
          >
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
