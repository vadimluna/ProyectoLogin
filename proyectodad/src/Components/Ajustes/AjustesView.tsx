import React, { useState } from "react";
import "./Ajustes.css";
import { useTheme } from "../../Context/ThemeContext";

interface AjustesProps {
  username?: string;
  onLogout: () => void;
}

const AjustesView: React.FC<AjustesProps> = ({
  username = "Chef",
  onLogout,
}) => {
  const { isDarkMode, toggleTheme } = useTheme();

  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const validatePasswordRules = (pwd: string) => {
    if (pwd.length < 6) return "Mínimo 6 caracteres.";
    if (!/[A-Z]/.test(pwd)) return "Falta una mayúscula.";
    if (!/[0-9]/.test(pwd)) return "Falta un número.";
    // NUEVA REGLA: SÍMBOLO
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) return "Falta un símbolo.";
    return null;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass || !newPass || !confirmPass) {
      alert("Por favor, rellena todos los campos.");
      return;
    }
    if (newPass !== confirmPass) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    const errorMsg = validatePasswordRules(newPass);
    if (errorMsg) {
      alert(`Contraseña insegura: ${errorMsg}`);
      return;
    }

    const isConfirmed = window.confirm(
      "¿Seguro que quieres cambiar la contraseña?"
    );
    if (!isConfirmed) return;

    try {
      const response = await fetch(
        "http://localhost:3001/api/update-password",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            currentPassword: currentPass,
            newPassword: newPass,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert("¡Contraseña actualizada!");
        setCurrentPass("");
        setNewPass("");
        setConfirmPass("");
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (err) {
      alert("Error de servidor.");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("⚠️ ¿ESTÁS SEGURO?\n\nEsta acción es irreversible."))
      return;
    try {
      const response = await fetch("http://localhost:3001/api/delete-account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      if (response.ok) {
        alert("Cuenta eliminada.");
        onLogout();
      } else {
        alert("Error al eliminar.");
      }
    } catch (err) {
      alert("Error de conexión.");
    }
  };

  return (
    <div className="ajustes-container">
      <header className="ajustes-header centered">
        <h1>Configuración del Chef</h1>
        <p>Personaliza tu experiencia en el laboratorio</p>
      </header>

      <div className="settings-grid">
        <div className="left-column">
          <div className="settings-card profile-card">
            <div className="profile-header">
              <div className="avatar-wrapper">
                <div className="avatar-placeholder-large">
                  {username.charAt(0).toUpperCase()}
                </div>
                <button className="edit-avatar-btn">📷</button>
              </div>
              <div className="profile-info">
                <h4>{username}</h4>
                <span className="badge-role">Chef Ejecutivo</span>
              </div>
            </div>
            <div className="profile-stats">
              <div className="stat">
                <strong>12</strong>
                <span>Recetas</span>
              </div>
              <div className="stat">
                <strong>4.8</strong>
                <span>Rating</span>
              </div>
              <div className="stat">
                <strong>25</strong>
                <span>Seguidores</span>
              </div>
            </div>
          </div>

          <div className="settings-card security-card">
            <h3>🔐 Seguridad de la Cuenta</h3>
            <form className="security-form" onSubmit={handleChangePassword}>
              <div className="form-section">
                <label className="section-title">Datos Personales</label>
                <div className="form-group">
                  <label>Nombre de Usuario</label>
                  <div className="input-with-icon">
                    <span className="icon">👤</span>
                    <input
                      type="text"
                      value={username}
                      className="clean-input locked"
                      readOnly
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Correo Electrónico</label>
                  <div className="input-with-icon">
                    <span className="icon">✉️</span>
                    <input
                      type="email"
                      value={`${username}@cooklab.com`}
                      className="clean-input locked"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="divider"></div>

              <div className="form-section">
                <label className="section-title">Cambiar Contraseña</label>
                <p className="password-hint">
                  Mín 6 chars, mayúscula, número y símbolo.
                </p>
                <div className="form-group">
                  <label>Contraseña Actual</label>
                  <div className="input-with-icon">
                    <span className="icon">🔑</span>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="clean-input password-field"
                      value={currentPass}
                      onChange={(e) => setCurrentPass(e.target.value)}
                    />
                  </div>
                </div>
                <div className="password-row">
                  <div className="form-group half">
                    <label>Nueva Contraseña</label>
                    <input
                      type="password"
                      placeholder="Nueva..."
                      className="clean-input password-field"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                    />
                  </div>
                  <div className="form-group half">
                    <label>Confirmar</label>
                    <input
                      type="password"
                      placeholder="Repetir..."
                      className="clean-input password-field"
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="form-footer">
                <button type="submit" className="btn-save-security">
                  💾 Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="right-column">
          <div className="settings-card">
            <h3>🎨 Preferencias</h3>
            <div className="setting-item">
              <div className="setting-text">
                <h4>Modo Oscuro</h4>
                <p>Cambiar apariencia del laboratorio</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={isDarkMode}
                  onChange={toggleTheme}
                />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="setting-item">
              <div className="setting-text">
                <h4>Notificaciones</h4>
                <p>Alertas de recetas</p>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          <div className="settings-card danger-zone centered-content">
            <h3>⚠️ Zona de Peligro</h3>
            <p>Estas acciones no se pueden deshacer</p>
            <div className="danger-actions">
              <button
                type="button"
                className="btn-danger outline"
                onClick={onLogout}
              >
                Cerrar Sesión
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={handleDeleteAccount}
              >
                Eliminar Cuenta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AjustesView;
