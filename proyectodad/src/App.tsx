import React, { useState } from "react";
import "./App.css";
import logo from "./logo.svg";
import LaboratorioView from "./Components/Laboratorio/LaboratorioView";
import RegisterView from "./Components/Register/Registerview";
import Sidebar from "./Components/Sidebar/Sidebar";

type Page =
  | "Laboratorio"
  | "Mis recetas"
  | "Cocina"
  | "Enciclopedia"
  | "Desafío"
  | "Historial"
  | "Ajustes";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>("Laboratorio");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<"login" | "register">("login");

  const handleLogout = () => {
    setLoggedIn(false);
    setUsername("");
    setPassword("");
    setError("Sesión cerrada correctamente.");
    setViewMode("login");
  };

  const handleLogin = async () => {
    setError("");

    if (!username || !password) {
      setError("Por favor, ingresa el usuario/email y la contraseña.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setLoggedIn(true);
        setCurrentPage("Laboratorio");
        setError("");
        setViewMode("login");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Usuario o contraseña incorrectos.");
      }
    } catch (err) {
      setError(
        "Error de conexión con el servidor. Asegúrate de que el backend esté activo."
      );
    }
  };

  const renderLoginView = () => (
    <div className="login-container">
      <div className="login-card">
        <img src={logo} className="logo" alt="logo" />
        <h1 className="title">
          <span className="cook">Cook</span>
          <span className="lab">Lab</span>
        </h1>
        <p className="subtitle">Laboratorio de sabores</p>

        <h2 className="welcome">¡Bienvenido al laboratorio del sabor!</h2>

        <div className="inputs">
          <input
            type="text"
            placeholder="Usuario o Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <div className="message error">{error}</div>}

        <div className="buttons">
          <button className="btn enter" onClick={handleLogin}>
            Entrar
          </button>

          <button
            className="btn register"
            onClick={() => {
              setViewMode("register");
              setError("");
            }}
          >
            Registrarse
          </button>

          <button className="btn recover">Recuperar contraseña</button>
        </div>

        <div className="icons">
          <span className="icon">🔊</span>
          <span className="icon">❓</span>
          <span className="icon">⚙️</span>
        </div>
      </div>
    </div>
  );

  const renderMainContent = () => (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        onLogout={handleLogout}
        onNavigate={setCurrentPage}
        currentPage={currentPage}
      />
      <main style={{ flexGrow: 1, padding: "20px" }}>
        <LaboratorioView
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onLogout={handleLogout}
        />
      </main>
    </div>
  );

  if (loggedIn) {
    return renderMainContent();
  }

  if (viewMode === "register") {
    return (
      <RegisterView
        onBackToLogin={(msg) => {
          setViewMode("login");
          setError(msg);
        }}
      />
    );
  }

  return renderLoginView();
}

export default App;
