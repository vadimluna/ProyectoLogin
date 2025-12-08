import React, { useState, useEffect } from "react";
import "./App.css";
import LaboratorioView from "./Components/Laboratorio/LaboratorioView";
import RecetasView from "./Components/Recetas/RecetasView";
import RegisterView from "./Components/Register/Registerview";
import Sidebar from "./Components/Sidebar/Sidebar";
import InformeView from "./Informes/InformeView";
import AjustesView from "./Components/Ajustes/AjustesView";
import TopBar from "./TopBar/TopBar";
import EnciclopediaView from "./Enciclopedia/EnciclopediaView";
import { ThemeProvider } from "./Context/ThemeContext";

export type Page =
  | "Laboratorio"
  | "Mis recetas"
  | "Cocina"
  | "Enciclopedia"
  | "Desafío"
  | "Historial"
  | "Ajustes"
  | "Informes";

function AppContent() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>("Laboratorio");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<"login" | "register">("login");

  useEffect(() => {
    const isLogged = localStorage.getItem("isLogged");
    if (isLogged === "true") {
      setLoggedIn(true);
      const storedUser = localStorage.getItem("username");
      if (storedUser) setUsername(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLogged");
    localStorage.removeItem("username");
    setLoggedIn(false);
    setUsername("");
    setPassword("");
    setError("");
    setViewMode("login");
    setCurrentPage("Laboratorio");
  };

  const handleLogin = async () => {
    setError("");
    if (!username || !password) {
      setError("Por favor, ingresa tus credenciales.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        localStorage.setItem("isLogged", "true");
        localStorage.setItem("username", username);
        setLoggedIn(true);
        setError("");
        setViewMode("login");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Credenciales incorrectas.");
      }
    } catch (err) {
      console.warn("Backend no disponible. Iniciando en modo local (offline).");
      localStorage.setItem("isLogged", "true");
      localStorage.setItem("username", username);
      setLoggedIn(true);
      setError("");
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case "Laboratorio":
        return (
          <LaboratorioView
            onSaveSuccess={() => setCurrentPage("Mis recetas")}
          />
        );
      case "Mis recetas":
        return (
          <RecetasView onNavigateToLab={() => setCurrentPage("Laboratorio")} />
        );
      case "Informes":
        return <InformeView currentUser={username || "Chef"} />;
      case "Ajustes":
        return (
          <AjustesView username={username || "Chef"} onLogout={handleLogout} />
        );
      case "Enciclopedia":
        return <EnciclopediaView />;
      default:
        return (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "var(--text-secondary)",
            }}
          >
            <h1>{currentPage}</h1>
            <p>Próximamente...</p>
          </div>
        );
    }
  };

  if (!loggedIn) {
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
    return (
      <div className="login-wrapper">
        <div className="login-box">
          <div className="login-banner">
            <div className="banner-content">
              <h1>CookLab</h1>
              <p>Tu laboratorio de sabores</p>
            </div>
          </div>
          <div className="login-form-section">
            <h2>Bienvenido mi chef!</h2>
            <div className="input-group">
              <span className="input-icon">👤</span>
              <input
                type="text"
                placeholder="Usuario"
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
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>

            <div className="form-options">
              <span
                className="forgot-pass"
                style={{
                  cursor: "pointer",
                  color: "var(--text-secondary)",
                  fontSize: "0.9rem",
                }}
              >
                ¿Olvidaste tu contraseña?
              </span>
            </div>

            {error && <div className="error-msg">{error}</div>}

            <button className="btn-login" onClick={handleLogin}>
              Login
            </button>
            <p className="register-text">
              ¿Nuevo?{" "}
              <span onClick={() => setViewMode("register")}>Crear cuenta</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar
        onLogout={handleLogout}
        onNavigate={setCurrentPage}
        currentPage={currentPage}
        username={username || "Chef"}
      />
      <main className="main-content">
        <TopBar
          username={username || "Chef"}
          onNavigateSettings={() => setCurrentPage("Ajustes")}
          onLogout={handleLogout}
        />
        {renderContent()}
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
