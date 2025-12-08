import React from "react";
import "./Sidebar.css";

// Añadimos "Informes" al tipo Page aquí también
type Page =
  | "Laboratorio"
  | "Mis recetas"
  | "Cocina"
  | "Enciclopedia"
  | "Desafío"
  | "Historial"
  | "Ajustes"
  | "Informes";

interface SidebarProps {
  onLogout: () => void;
  onNavigate: (page: Page) => void;
  currentPage: Page;
  username?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  onLogout,
  onNavigate,
  currentPage,
  username = "Usuario",
}) => {
  // Añadimos "Informes" a la lista del menú
  const menuItems: Page[] = [
    "Laboratorio",
    "Mis recetas",
    "Cocina",
    "Enciclopedia",
    "Desafío",
    "Historial",
    "Informes",
    "Ajustes",
  ];

  return (
    <div className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <h1 className="brand-title">
          <span className="cook">Cook</span>
          <span className="lab">Lab</span>
        </h1>
        <p className="brand-subtitle">Laboratorio de sabores</p>
      </div>

      {/* Separator */}
      <div className="separator-line"></div>

      {/* Profile */}
      <div className="sidebar-profile">
        <div className="avatar-circle">{username.charAt(0).toUpperCase()}</div>
        <div className="profile-info">
          <h3>{username}</h3>
          <span>Chef Ejecutivo</span>
        </div>
      </div>

      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item}
            className={currentPage === item ? "active" : ""}
            onClick={() => onNavigate(item)}
          >
            {item}
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        <div className="separator-line"></div>
        <button className="logout-btn" onClick={onLogout}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
