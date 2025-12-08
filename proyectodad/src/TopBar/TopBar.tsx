import React, { useState, useEffect, useRef } from "react";
import "./TopBar.css";

interface TopBarProps {
  username?: string;
  onNavigateSettings?: () => void;
  onLogout?: () => void; 
}

const TopBar: React.FC<TopBarProps> = ({
  username = "Chef",
  onNavigateSettings,
  onLogout,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [volume, setVolume] = useState(50);

  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (menuName: string) => {
    if (activeMenu === menuName) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menuName);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="topbar-container" ref={menuRef}>
      <div className="topbar-item">
        <button
          className={`icon-btn ${activeMenu === "volume" ? "active" : ""}`}
          onClick={() => toggleMenu("volume")}
          title="Volumen"
        >
          {volume === 0 ? "🔇" : volume > 50 ? "🔊" : "🔉"}
        </button>

        {activeMenu === "volume" && (
          <div className="dropdown-panel volume-panel-centered">
            <div className="volume-track">
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="vertical-slider"
              />
            </div>
            <div className="volume-footer">
              <span>{volume}%</span>
            </div>
          </div>
        )}
      </div>

      <div className="topbar-item">
        <button
          className={`icon-btn ${activeMenu === "help" ? "active" : ""}`}
          onClick={() => toggleMenu("help")}
          title="Ayuda"
        >
          ❓
        </button>

        {activeMenu === "help" && (
          <div className="dropdown-panel help-panel">
            <div className="help-header">
              <h4>¿Necesitas ayuda?</h4>
              <p>Estamos aquí para asistirte, Chef.</p>
            </div>

            <div className="help-search">
              <span>🔍</span>
              <input type="text" placeholder="Buscar temas..." />
            </div>

            <ul className="help-links">
              <li>📄 Guía de inicio rápido</li>
              <li>🧪 Calibrar instrumentos</li>
              <li>⚠️ Reportar un bug</li>
            </ul>

            <button className="help-contact-btn">Chat con Soporte</button>
          </div>
        )}
      </div>

      <div className="topbar-item">
        <button
          className={`icon-btn ${activeMenu === "settings" ? "active" : ""}`}
          onClick={() => toggleMenu("settings")}
          title="Ajustes"
        >
          ⚙️
        </button>

        {activeMenu === "settings" && (
          <div className="dropdown-panel settings-panel">
            <h4>Ajustes Rápidos</h4>
            <div className="quick-row">
              <span>Modo Zen</span>
              <label className="switch-mini">
                <input type="checkbox" />
                <span className="slider-mini"></span>
              </label>
            </div>
            <div className="quick-row">
              <span>Notificaciones</span>
              <label className="switch-mini">
                <input type="checkbox" defaultChecked />
                <span className="slider-mini"></span>
              </label>
            </div>
            <div className="panel-footer" onClick={onNavigateSettings}>
              Ir a configuración completa →
            </div>
          </div>
        )}
      </div>
      <div className="topbar-item">
        <button
          className={`profile-pill ${activeMenu === "profile" ? "active" : ""}`}
          onClick={() => toggleMenu("profile")}
        >
          <span className="profile-name">{username}</span>
          <div className="profile-avatar-small">
            {username.charAt(0).toUpperCase()}
          </div>
        </button>

        {activeMenu === "profile" && (
          <div className="dropdown-panel profile-dropdown">
            <div className="profile-dropdown-header">
              <div className="big-avatar">
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="header-text">
                <h5>{username}</h5>
                <span>Chef Ejecutivo</span>
              </div>
            </div>
            <div className="dropdown-divider"></div>
            <ul className="profile-menu-list">
              <li>👤 Mi Perfil</li>
              <li>🏆 Mis Logros</li>
              <li>⭐ Favoritos</li>
            </ul>
            <div className="dropdown-divider"></div>
            <button className="logout-item-btn" onClick={onLogout}>
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
