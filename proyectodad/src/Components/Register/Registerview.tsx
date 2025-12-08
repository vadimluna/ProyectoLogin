import React, { useState } from "react";
import "./RegisterView.css";

interface RegisterProps {
  onBackToLogin: (msg: string) => void;
}

const RegisterView: React.FC<RegisterProps> = ({ onBackToLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validatePasswordRules = (pwd: string) => {
    if (pwd.length < 6) return "Mínimo 6 caracteres.";
    if (!/[A-Z]/.test(pwd)) return "Falta una mayúscula.";
    if (!/[0-9]/.test(pwd)) return "Falta un número.";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd))
      return "Falta un símbolo (!@#$...).";
    return null;
  };

  const handleRegister = async () => {
    setError("");

    if (!username || !password || !confirmPassword || !email) {
      setError("Por favor, rellena todos los campos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const ruleError = validatePasswordRules(password);
    if (ruleError) {
      setError(`Contraseña insegura: ${ruleError}`);
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await response.json();

      if (response.ok) {
        onBackToLogin("¡Cuenta creada con éxito! Por favor, inicia sesión.");
      } else {
        setError(data.message || "Error al registrarse.");
      }
    } catch (err) {
      setError("Error de conexión con el servidor.");
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-box">
        <div className="register-banner">
          <div className="banner-content">
            <h1>CookLab</h1>
            <p>Únete al laboratorio</p>
            <div className="banner-icon">👨‍🍳</div>
          </div>
        </div>

        <div className="register-form-section">
          <h2>Crear Cuenta</h2>
          <p className="subtitle">Empieza tu viaje culinario hoy</p>

          <div className="input-group">
            <span className="input-icon">✉️</span>
            <input
              type="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <span className="input-icon">👤</span>
            <input
              type="text"
              placeholder="Nombre de Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <span className="input-icon">🔒</span>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="input-group">
            <span className="input-icon">🔐</span>
            <input
              type="password"
              placeholder="Confirmar Contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
            />
          </div>

          <p
            style={{
              fontSize: "0.75rem",
              color: "var(--text-secondary)",
              marginTop: "-15px",
              marginBottom: "20px",
              textAlign: "left",
              paddingLeft: "10px",
              opacity: 0.8,
            }}
          >
            ℹ️ Mín. 6 chars, 1 mayús, 1 num y 1 símbolo.
          </p>

          {error && <div className="error-msg">{error}</div>}

          <button className="btn-register" onClick={handleRegister}>
            Registrarse
          </button>

          <p className="login-link">
            ¿Ya tienes cuenta?{" "}
            <span onClick={() => onBackToLogin("")}>Inicia Sesión</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterView;
