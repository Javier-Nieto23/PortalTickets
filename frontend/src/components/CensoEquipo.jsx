import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './CensoEquipo.css';

function CensoEquipo() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    tipo_equipo: 'computadora',
    marca: '',
    modelo: '',
    numero_serie: '',
    Nombre_Empleado: '',
    sistema_operativo: '',
    procesador: '',
    ram: '',
    disco_duro: '',
    observaciones: ''
  });

  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [loading, setLoading] = useState(false);
  const [equipos, setEquipos] = useState([]);
  const [loadingEquipos, setLoadingEquipos] = useState(false);
  const [filtroEquipos, setFiltroEquipos] = useState('');
  const [showModalCenso, setShowModalCenso] = useState(false);
  const [formDataAdmin, setFormDataAdmin] = useState({
    tipo_equipo: 'computadora',
    marca: '',
    modelo: '',
    numero_serie: '',
    Nombre_Empleado: '',
    empresa: '',
    sistema_operativo: '',
    procesador: '',
    ram: '',
    disco_duro: '',
    observaciones: ''
  });

  // Si es admin, cargar todos los equipos
  useEffect(() => {
    if (user?.rol === 'admin') {
      cargarEquipos();
    }
  }, [user]);

  const cargarEquipos = async () => {
    setLoadingEquipos(true);
    try {
      const token = JSON.stringify({ ID_usuario: user.ID_usuario, email: user.email });
      const response = await fetch('http://localhost:3000/api/equipos/todos', {
        headers: {
          'Authorization': `Bearer ${encodeURIComponent(token)}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEquipos(data);
      }
    } catch (error) {
      console.error('Error al cargar equipos:', error);
    } finally {
      setLoadingEquipos(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChangeAdmin = (e) => {
    const { name, value } = e.target;
    setFormDataAdmin(prev => ({
      ...prev,
      [name]: value
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.marca || !formData.modelo || !formData.numero_serie || !formData.Nombre_Empleado) {
      setMensaje({ texto: 'Por favor completa los campos requeridos (Marca, Modelo, Número de Serie y Nombre del Empleado)', tipo: 'error' });
      return;
    }

    setLoading(true);
    setMensaje({ texto: '', tipo: '' });

    try {
      // Crear token con los datos del usuario para autenticación
      const token = JSON.stringify({ ID_usuario: user.ID_usuario, email: user.email });
      const response = await fetch('http://localhost:3000/api/equipos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${encodeURIComponent(token)}`
        },
        body: JSON.stringify({
          ...formData,
          usuario_id: user.ID_usuario
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje({ texto: 'Equipo registrado exitosamente', tipo: 'success' });
        // Limpiar formulario
        setFormData({
          tipo_equipo: 'computadora',
          marca: '',
          modelo: '',
          numero_serie: '',
          Nombre_Empleado: '',
          sistema_operativo: '',
          procesador: '',
          ram: '',
          disco_duro: '',
          observaciones: ''
        });
      } else {
        setMensaje({ texto: data.mensaje || 'Error al registrar equipo', tipo: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje({ texto: 'Error de conexión', tipo: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAdmin = async (e) => {
    e.preventDefault();
    
    if (!formDataAdmin.marca || !formDataAdmin.modelo || !formDataAdmin.numero_serie || !formDataAdmin.Nombre_Empleado || !formDataAdmin.empresa) {
      setMensaje({ texto: 'Por favor completa todos los campos requeridos', tipo: 'error' });
      return;
    }

    setLoading(true);
    setMensaje({ texto: '', tipo: '' });

    try {
      const token = JSON.stringify({ ID_usuario: user.ID_usuario, email: user.email });
      const response = await fetch('http://localhost:3000/api/equipos/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${encodeURIComponent(token)}`
        },
        body: JSON.stringify({
          ...formDataAdmin,
          usuario_id: user.ID_usuario
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje({ texto: 'Equipo registrado exitosamente', tipo: 'success' });
        setShowModalCenso(false);
        setFormDataAdmin({
          tipo_equipo: 'computadora',
          marca: '',
          modelo: '',
          numero_serie: '',
          Nombre_Empleado: '',
          empresa: '',
          sistema_operativo: '',
          procesador: '',
          ram: '',
          disco_duro: '',
          observaciones: ''
        });
        await cargarEquipos();
        setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
      } else {
        setMensaje({ texto: data.mensaje || 'Error al registrar equipo', tipo: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje({ texto: 'Error de conexión', tipo: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Obtener empresas únicas de los equipos existentes
  const empresasUnicas = [...new Set(equipos.map(eq => eq.nombre_empresa).filter(Boolean))].sort();

  // Filtrar equipos según búsqueda
  const equiposFiltrados = equipos.filter(equipo => {
    const searchTerm = filtroEquipos.toLowerCase();
    return (
      (equipo.nombre_empresa || '').toLowerCase().includes(searchTerm) ||
      (equipo.Nombre_Empleado || '').toLowerCase().includes(searchTerm) ||
      (equipo.nombre + ' ' + equipo.apellido).toLowerCase().includes(searchTerm) ||
      (equipo.marca || '').toLowerCase().includes(searchTerm) ||
      (equipo.modelo || '').toLowerCase().includes(searchTerm) ||
      (equipo.numero_serie || '').toLowerCase().includes(searchTerm)
    );
  });

  // Agrupar equipos filtrados por empresa
  const equiposPorEmpresa = equiposFiltrados.reduce((acc, equipo) => {
    const empresa = equipo.nombre_empresa || 'Sin empresa';
    if (!acc[empresa]) {
      acc[empresa] = [];
    }
    acc[empresa].push(equipo);
    return acc;
  }, {});

  // Si es admin, mostrar vista de equipos
  if (user?.rol === 'admin') {
    return (
      <div className="censo-container">
        <div className="censo-header">
          <h2>💻 Equipos Censados</h2>
          <p>Vista de todos los equipos registrados por empresa</p>
          <button 
            className="btn-censar-manual"
            onClick={() => setShowModalCenso(true)}
          >
            ➕ Censar Equipo Manualmente
          </button>
        </div>

        <div className="filtro-equipos">
          <input
            type="text"
            placeholder="🔍 Buscar por empresa, empleado, usuario registrador, marca, modelo o serie..."
            value={filtroEquipos}
            onChange={(e) => setFiltroEquipos(e.target.value)}
            className="search-equipos"
          />
          {filtroEquipos && (
            <button 
              className="btn-clear-filter"
              onClick={() => setFiltroEquipos('')}
              title="Limpiar filtro"
            >
              ✕
            </button>
          )}
        </div>

        {loadingEquipos ? (
          <div className="loading-equipos">
            <div className="spinner"></div>
            <p>Cargando equipos...</p>
          </div>
        ) : (
          <div className="equipos-lista">
            {Object.keys(equiposPorEmpresa).length === 0 ? (
              <div className="empty-state">
                <p>No hay equipos registrados</p>
              </div>
            ) : (
              Object.entries(equiposPorEmpresa).map(([empresa, equiposEmpresa]) => (
                <div key={empresa} className="empresa-section">
                  <div className="empresa-header">
                    <h3>🏢 {empresa}</h3>
                    <span className="equipo-count">{equiposEmpresa.length} equipo(s)</span>
                  </div>
                  
                  <div className="equipos-grid">
                    {equiposEmpresa.map((equipo) => (
                      <div key={equipo.id} className="equipo-card">
                        <div className="equipo-card-header">
                          <span className="equipo-tipo">{equipo.tipo_equipo}</span>
                          <span className="equipo-id">#{equipo.id}</span>
                        </div>

                        <div className="equipo-info">
                          <div className="info-row">
                            <span className="info-label">Marca:</span>
                            <span className="info-value">{equipo.marca}</span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Modelo:</span>
                            <span className="info-value">{equipo.modelo}</span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">No. Serie:</span>
                            <span className="info-value">{equipo.numero_serie}</span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Empleado:</span>
                            <span className="info-value">{equipo.Nombre_Empleado || 'N/A'}</span>
                          </div>
                          {equipo.sistema_operativo && (
                            <div className="info-row">
                              <span className="info-label">SO:</span>
                              <span className="info-value">{equipo.sistema_operativo}</span>
                            </div>
                          )}
                          {equipo.procesador && (
                            <div className="info-row">
                              <span className="info-label">Procesador:</span>
                              <span className="info-value">{equipo.procesador}</span>
                            </div>
                          )}
                          {equipo.ram && (
                            <div className="info-row">
                              <span className="info-label">RAM:</span>
                              <span className="info-value">{equipo.ram}</span>
                            </div>
                          )}
                          {equipo.disco_duro && (
                            <div className="info-row">
                              <span className="info-label">Disco:</span>
                              <span className="info-value">{equipo.disco_duro}</span>
                            </div>
                          )}
                          {equipo.observaciones && (
                            <div className="info-row observaciones">
                              <span className="info-label">Observaciones:</span>
                              <span className="info-value">{equipo.observaciones}</span>
                            </div>
                          )}
                        </div>

                        <div className="equipo-meta">
                          <span className="equipo-usuario">👤 {equipo.nombre} {equipo.apellido}</span>
                          <span className="equipo-fecha">
                            {new Date(equipo.created_at).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal para censar equipo manualmente */}
        {showModalCenso && (
          <div className="modal-overlay" onClick={() => setShowModalCenso(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>➕ Censar Equipo Manualmente</h3>
                <button 
                  className="modal-close"
                  onClick={() => setShowModalCenso(false)}
                >
                  ✕
                </button>
              </div>

              <form className="modal-form" onSubmit={handleSubmitAdmin}>
                {/* Información Básica */}
                <div className="form-section-modal">
                  <h4>Información Básica</h4>
                  <div className="form-grid-modal">
                    <div className="form-group">
                      <label htmlFor="empresa_admin">Empresa *</label>
                      <input
                        type="text"
                        id="empresa_admin"
                        name="empresa"
                        list="empresas-list"
                        value={formDataAdmin.empresa}
                        onChange={handleChangeAdmin}
                        placeholder="Selecciona o escribe el nombre de la empresa"
                        required
                      />
                      <datalist id="empresas-list">
                        {empresasUnicas.map((emp, idx) => (
                          <option key={idx} value={emp} />
                        ))}
                      </datalist>
                    </div>

                    <div className="form-group">
                      <label htmlFor="Nombre_Empleado_admin">Nombre del Empleado *</label>
                      <input
                        type="text"
                        id="Nombre_Empleado_admin"
                        name="Nombre_Empleado"
                        value={formDataAdmin.Nombre_Empleado}
                        onChange={handleChangeAdmin}
                        placeholder="Ej: Juan Pérez"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="tipo_equipo_admin">Tipo de Equipo *</label>
                      <select
                        id="tipo_equipo_admin"
                        name="tipo_equipo"
                        value={formDataAdmin.tipo_equipo}
                        onChange={handleChangeAdmin}
                        required
                      >
                        <option value="computadora">Computadora</option>
                        <option value="laptop">Laptop</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="marca_admin">Marca *</label>
                      <input
                        type="text"
                        id="marca_admin"
                        name="marca"
                        value={formDataAdmin.marca}
                        onChange={handleChangeAdmin}
                        placeholder="Ej: Dell, HP, Lenovo"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="modelo_admin">Modelo *</label>
                      <input
                        type="text"
                        id="modelo_admin"
                        name="modelo"
                        value={formDataAdmin.modelo}
                        onChange={handleChangeAdmin}
                        placeholder="Ej: Latitude 5420"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="numero_serie_admin">Número de Serie *</label>
                      <input
                        type="text"
                        id="numero_serie_admin"
                        name="numero_serie"
                        value={formDataAdmin.numero_serie}
                        onChange={handleChangeAdmin}
                        placeholder="Ej: SN123456789"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Especificaciones Técnicas */}
                <div className="form-section-modal">
                  <h4>Especificaciones Técnicas (Opcional)</h4>
                  <div className="form-grid-modal">
                    <div className="form-group">
                      <label htmlFor="sistema_operativo_admin">Sistema Operativo</label>
                      <input
                        type="text"
                        id="sistema_operativo_admin"
                        name="sistema_operativo"
                        value={formDataAdmin.sistema_operativo}
                        onChange={handleChangeAdmin}
                        placeholder="Ej: Windows 11 Pro"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="procesador_admin">Procesador</label>
                      <input
                        type="text"
                        id="procesador_admin"
                        name="procesador"
                        value={formDataAdmin.procesador}
                        onChange={handleChangeAdmin}
                        placeholder="Ej: Intel Core i7"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="ram_admin">Memoria RAM</label>
                      <input
                        type="text"
                        id="ram_admin"
                        name="ram"
                        value={formDataAdmin.ram}
                        onChange={handleChangeAdmin}
                        placeholder="Ej: 16 GB DDR4"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="disco_duro_admin">Disco Duro</label>
                      <input
                        type="text"
                        id="disco_duro_admin"
                        name="disco_duro"
                        value={formDataAdmin.disco_duro}
                        onChange={handleChangeAdmin}
                        placeholder="Ej: 512 GB SSD"
                      />
                    </div>
                  </div>
                </div>

                {/* Observaciones */}
                <div className="form-section-modal">
                  <div className="form-group">
                    <label htmlFor="observaciones_admin">Observaciones</label>
                    <textarea
                      id="observaciones_admin"
                      name="observaciones"
                      value={formDataAdmin.observaciones}
                      onChange={handleChangeAdmin}
                      rows="3"
                      placeholder="Notas adicionales..."
                    />
                  </div>
                </div>

                {/* Botones */}
                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="btn-cancelar-modal"
                    onClick={() => setShowModalCenso(false)}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn-registrar-modal"
                    disabled={loading}
                  >
                    {loading ? '⏳ Registrando...' : '💾 Registrar Equipo'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Mensaje */}
        {mensaje.texto && (
          <div className={`mensaje-flotante ${mensaje.tipo}`}>
            {mensaje.tipo === 'success' ? '✅' : '⚠️'} {mensaje.texto}
          </div>
        )}
      </div>
    );
  }

  // Vista de formulario para usuarios normales
  return (
    <div className="censo-container">
      <div className="censo-header">
        <h2>📋 Censo de Equipo</h2>
        <p>Registra un nuevo equipo para un empleado de tu empresa</p>
      </div>

      <form className="censo-form" onSubmit={handleSubmit}>
        {/* Información Básica */}
        <div className="form-section">
          <h3>Información Básica</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="tipo_equipo">Tipo de Equipo *</label>
              <select
                id="tipo_equipo"
                name="tipo_equipo"
                value={formData.tipo_equipo}
                onChange={handleChange}
                required
              >
                <option value="computadora">Computadora</option>
                <option value="laptop">Laptop</option>
                
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="marca">Marca *</label>
              <input
                type="text"
                id="marca"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                placeholder="Ej: Dell, HP, Lenovo"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="modelo">Modelo *</label>
              <input
                type="text"
                id="modelo"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                placeholder="Ej: Latitude 5420"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="numero_serie">Número de Serie *</label>
              <input
                type="text"
                id="numero_serie"
                name="numero_serie"
                value={formData.numero_serie}
                onChange={handleChange}
                placeholder="Ej: SN123456789"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="Nombre_Empleado">Nombre del Empleado *</label>
              <input
                type="text"
                id="Nombre_Empleado"
                name="Nombre_Empleado"
                value={formData.Nombre_Empleado}
                onChange={handleChange}
                placeholder="Ej: Juan Pérez / María González"
                required
              />
              <small style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                Nombre del empleado que usará este equipo
              </small>
            </div>
          </div>
        </div>

        {/* Especificaciones Técnicas */}
        <div className="form-section">
          <h3>Especificaciones Técnicas</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="sistema_operativo">Sistema Operativo</label>
              <input
                type="text"
                id="sistema_operativo"
                name="sistema_operativo"
                value={formData.sistema_operativo}
                onChange={handleChange}
                placeholder="Ej: Windows 11 Pro"
              />
            </div>

            <div className="form-group">
              <label htmlFor="procesador">Modelo Procesador</label>
              <input
                type="text"
                id="procesador"
                name="procesador"
                value={formData.procesador}
                onChange={handleChange}
                placeholder="Ej: Intel Core i7-11800H"
              />
            </div>

            <div className="form-group">
              <label htmlFor="ram">Memoria RAM</label>
              <input
                type="text"
                id="ram"
                name="ram"
                value={formData.ram}
                onChange={handleChange}
                placeholder="Ej: 16 GB DDR4"
              />
            </div>

            <div className="form-group">
              <label htmlFor="disco_duro">Espacio de Disco Duro</label>
              <input
                type="text"
                id="disco_duro"
                name="disco_duro"
                value={formData.disco_duro}
                onChange={handleChange}
                placeholder="Ej: 512 GB SSD"
              />
            </div>
          </div>
        </div>

        {/* Observaciones */}
        <div className="form-section">
          <h3>Observaciones</h3>
          <div className="form-group">
            <label htmlFor="observaciones">Notas Adicionales</label>
            <textarea
              id="observaciones"
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              rows="4"
              placeholder="Describe cualquier detalle relevante sobre el equipo..."
            />
          </div>
        </div>

        {/* Mensaje */}
        {mensaje.texto && (
          <div className={`mensaje-censo ${mensaje.tipo}`}>
            {mensaje.tipo === 'success' ? '✅' : '⚠️'} {mensaje.texto}
          </div>
        )}

        {/* Usuario que registra */}
        <div className="usuario-asignado">
          <span className="label-asignado">👤 Registrado por:</span>
          <span className="nombre-asignado">{user?.nombre} {user?.apellido} ({user?.nombre_empresa})</span>
        </div>

        {/* Botones */}
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-cancelar"
            onClick={() => {
              setFormData({
                tipo_equipo: 'computadora',
                marca: '',
                modelo: '',
                numero_serie: '',
                sistema_operativo: '',
                procesador: '',
                ram: '',
                disco_duro: '',
                
                observaciones: ''
              });
              setMensaje({ texto: '', tipo: '' });
            }}
          >
            Limpiar Formulario
          </button>
          <button 
            type="submit" 
            className="btn-registrar"
            disabled={loading}
          >
            {loading ? '⏳ Registrando...' : '💾 Registrar Equipo'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CensoEquipo;
