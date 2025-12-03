import React, { useState } from "react";
import "./Laboratorio.css";

const LaboratorioView: React.FC = () => {
  const [ingrediente1, setIng1] = useState("");
  const [ingrediente2, setIng2] = useState("");
  const [notas, setNotas] = useState("");

  return (
    <div className="laboratorio-container">
      <header className="view-header">
        <h2>🧪 Laboratorio de Experimentación</h2>
        <p>Mezcla ingredientes y descubre nuevos sabores.</p>
      </header>

      <div className="experiment-grid">
        <div className="panel mix-panel card-shadow">
          <h3>Zona de Mezcla</h3>
          <div className="mix-inputs">
            <input
              type="text"
              placeholder="Ingrediente Principal (ej. Harina)"
              value={ingrediente1}
              onChange={(e) => setIng1(e.target.value)}
              className="lab-input"
            />
            <div className="plus-icon">+</div>
            <input
              type="text"
              placeholder="Ingrediente Secundario (ej. Huevo)"
              value={ingrediente2}
              onChange={(e) => setIng2(e.target.value)}
              className="lab-input"
            />
          </div>

          <div className="lab-actions">
            <button className="btn-lab primary">🧪 Probar Mezcla</button>
            <button className="btn-lab secondary">💾 Guardar</button>
            <button className="btn-lab tertiary">🎲 Aleatorio</button>
          </div>
        </div>

        <div className="panel notes-panel card-shadow">
          <h3>Cuaderno de Campo</h3>
          <textarea
            placeholder="Anota aquí tus observaciones de sabor, textura y olor..."
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            className="notes-area"
          ></textarea>

          <div className="complexity-selector">
            <span>Complejidad:</span>
            <select className="complexity-select">
              <option>Baja</option>
              <option>Media</option>
              <option>Alta</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaboratorioView;
