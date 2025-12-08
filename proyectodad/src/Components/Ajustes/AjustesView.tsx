import React from "react";
import "./Ajustes.css";

const AjustesView: React.FC = () => {
  return (
    <div className="ajustes-container">
      <header className="ajustes-header">
        <h2>⚙️ Configuración del Chef</h2>
        <p>Personaliza tu experiencia en el laboratorio</p>
      </header>

      <div className="settings-grid">
        {/* --- TARJETA DE PERFIL --- */}
        <div className="settings-card profile-card">
          <h3>👤 Tu Perfil</h3>
          <div className="profile-header">
            <div className="avatar-wrapper">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png"
                alt="Avatar"
                className="avatar-img"
              />
              <button className="edit-avatar-btn">📷</button>
            </div>
            <div className="profile-info">
              <h4>Chef Maestro</h4>
              <span className="badge-role">Premium User</span>
            </div>
          </div>

          <div className="form-group">
            <label>Nombre Completo</label>
            <div className="input-with-icon">
              <span>🖊️</span>
              <input
                type="text"
                defaultValue="Vadim Luna"
                placeholder="Tu nombre"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Correo Electrónico</label>
            <div className="input-with-icon">
              <span>✉️</span>
              <input
                type="email"
                defaultValue="chef@cooklab.com"
                placeholder="Tu correo"
              />
            </div>
          </div>

          <button className="btn-save">💾 Guardar Cambios</button>
        </div>

        {/* --- COLUMNA DERECHA --- */}
        <div className="right-column">
          {/* TARJETA PREFERENCIAS */}
          <div className="settings-card">
            <h3>🎨 Apariencia y Preferencias</h3>

            <div className="setting-item">
              <div className="setting-text">
                <h4>Modo Oscuro</h4>
                <p>Descansa tus ojos con colores oscuros</p>
              </div>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-text">
                <h4>Animaciones Suaves</h4>
                <p>Activar efectos de transición en la app</p>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          {/* TARJETA NOTIFICACIONES */}
          <div className="settings-card">
            <h3>🔔 Notificaciones</h3>

            <div className="setting-item">
              <div className="setting-text">
                <h4>Nuevas Recetas</h4>
                <p>Avísame cuando haya recetas nuevas</p>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-text">
                <h4>Recordatorios de Cocina</h4>
                <p>Alertas para tus tiempos de cocción</p>
              </div>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          {/* TARJETA ZONA PELIGRO */}
          <div className="settings-card danger-zone">
            <h3>⚠️ Zona de Peligro</h3>
            <p>Estas acciones no se pueden deshacer.</p>
            <button className="btn-danger">Cerrar Sesión</button>
            <button className="btn-danger outline">Eliminar Cuenta</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AjustesView;
