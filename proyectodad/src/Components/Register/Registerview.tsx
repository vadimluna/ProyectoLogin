import React, { useState } from "react";
import "./RegisterView.css";

interface RegisterViewProps {
  onBackToLogin: (message: string) => void;
}

const RegisterView: React.FC<RegisterViewProps> = ({ onBackToLogin }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (!username || !email || !password) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.status === 201) {
        setSuccess(
          data.message ||
            "¡Registro exitoso! Serás redirigido para iniciar sesión."
        );

        setTimeout(() => {
          onBackToLogin(
            data.message || "¡Registro exitoso! Ya puedes iniciar sesión."
          );
        }, 2000);
      } else {
        setError(data.message || "Error al registrar el usuario.");
      }
    } catch (err) {
      setError(
        "Error de conexión con el servidor. Asegúrate de que el backend esté activo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">
          <span className="cook">Cook</span>
          <span className="lab">Lab</span>
        </h1>
        <p className="register-subtitle">Laboratorio de sabores</p>

        <h2 className="register-welcome">Crea tu cuenta</h2>

        <div className="register-inputs">
          <input
            type="text"
            placeholder="Nombre de Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
          />
          <input
            type="email"
            placeholder="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Contraseña (Mínimo 8 caracteres, mayúscula, símbolo)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Confirmar Contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {(error || success) && (
          <div className={error ? "message error" : "message success"}>
            {error || success}
          </div>
        )}

        <div className="register-buttons">
          <button
            className="btn enter"
            onClick={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? "Registrando..." : "Registrarme"}
          </button>
          <button
            className="btn back-login"
            onClick={() => onBackToLogin("")}
            disabled={isLoading}
          >
            Volver a Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterView;
  