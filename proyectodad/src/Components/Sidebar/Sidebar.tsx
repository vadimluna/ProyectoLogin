import React from "react";
import "./Sidebar.css";
import logo from "./logo.svg";

type Page =
  | "Laboratorio"
  | "Mis recetas"
  | "Cocina"
  | "Enciclopedia"
  | "Desafío"
  | "Historial"
  | "Ajustes";

interface SidebarProps {
  onLogout: () => void;
  onNavigate: (page: Page) => void;
  currentPage: Page;
}

const Sidebar: React.FC<SidebarProps> = ({
  onLogout,
  onNavigate,
  currentPage,
}) => {
  const menuItems: Page[] = [
    "Laboratorio",
    "Cocina",
    "Mis recetas",
    "Enciclopedia",
    "Desafío",
    "Historial",
    "Ajustes",
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img alt="CookLab logo" />
        <h1 className="sidebar-title">
          <span className="cook">Cook</span>
          <span className="lab">Lab</span>
        </h1>
        <p>Laboratorio de sabores</p>
      </div>

      <div className="sidebar-divider"></div>

      <div className="sidebar-menu">
        <ul>
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
      </div>

      <div className="sidebar-logout">
        <button onClick={onLogout}>Salir</button>
      </div>
    </div>
  );
};

export default Sidebar;
