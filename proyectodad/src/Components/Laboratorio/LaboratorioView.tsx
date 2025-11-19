import React from "react";
import RecetasView from "../Recetas/RecetasView";
import "./Laboratorio.css";

type Page =
  | "Laboratorio"
  | "Mis recetas"
  | "Cocina"
  | "Enciclopedia"
  | "Desafío"
  | "Historial"
  | "Ajustes";

const LaboratorioContent = () => (
  <div className="laboratorio-content">
    <h2>Laboratorio</h2>

    <div className="experiment-panels">
      <div className="ingredient-panel">
        <input
          type="text"
          placeholder="Escribe aqui su ingrediente principal"
          readOnly
        />
        <div className="plus-sign">+</div>
        <input
          type="text"
          placeholder="Escribe aqui su ingrediente secundario"
          readOnly
        />

        <button className="btn-lab primary">Probar nueva mezcla</button>
        <button className="btn-lab secondary">Guardar combinacion</button>
        <button className="btn-lab tertiary">Receta aleatoria</button>
      </div>
      <div className="notes-panel">
        <textarea
          placeholder="Escribe aqui tus notas y observaciones"
          readOnly
        ></textarea>
        <p>Nivel de complejidad: Facil-Medio-Alto</p>
        <input type="text" placeholder="Ponerle otro nombre." readOnly />
      </div>
    </div>
  </div>
);

type LaboratorioViewProps = {
  onLogout: () => void;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
};

function LaboratorioView({ currentPage }: LaboratorioViewProps) {
  const renderContent = () => {
    switch (currentPage) {
      case "Laboratorio":
        return <LaboratorioContent />;
      case "Mis recetas":
        return <RecetasView />;
      default:
        return <LaboratorioContent />;
    }
  };

  return (
    <div className="content-area">
      <div className="header-icons">
        <span>🔊</span>
        <span>❓</span>
        <span>⚙️</span>
        <span>👤</span>
      </div>
      {renderContent()}
    </div>
  );
}

export default LaboratorioView;
