import React, { useState } from "react";
import "./Laboratorio.css";

interface LaboratorioProps {
  onSaveSuccess?: () => void;
}

const LaboratorioView: React.FC<LaboratorioProps> = ({ onSaveSuccess }) => {
  const [title, setTitle] = useState("");
  const [ingrediente1, setIng1] = useState("");
  const [ingrediente2, setIng2] = useState("");
  const [notas, setNotas] = useState("");
  const [time, setTime] = useState("");
  const [complexity, setComplexity] = useState("Media");

  const currentUser = localStorage.getItem("username") || "Chef";

  const handleSave = async () => {
    if (!title || (!ingrediente1 && !ingrediente2)) {
      alert("Necesitas un nombre y al menos un ingrediente.");
      return;
    }

    const fullIngredients = `${ingrediente1}${
      ingrediente2 ? `, ${ingrediente2}` : ""
    }`;

    const newRecipe = {
      title,
      ingredients: fullIngredients,
      description: notas,
      time: time || "30 min",
      author: currentUser,
      complexity,
    };

    try {
      const response = await fetch("http://localhost:3001/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecipe),
      });

      if (response.ok) {
        if (onSaveSuccess) {
          onSaveSuccess();
        } else {
          setTitle("");
          setIng1("");
          setIng2("");
          setNotas("");
          setTime("");
          alert("¡Experimento guardado con éxito!");
        }
      } else {
        alert("Error al guardar en el servidor.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="laboratorio-container">
      <header className="view-header">
        <h2>🧪 Laboratorio de Sabores</h2>
        <p>Mezcla ingredientes y crea tu próxima receta estrella</p>
      </header>

      <div className="experiment-grid">
        <div className="panel mix-panel">
          <h3>⚗️ Zona de Mezcla</h3>

          <div className="mix-inputs">
            <div className="input-wrapper">
              <label className="input-label">Nombre del Experimento</label>
              <input
                type="text"
                placeholder="Ej: Salsa Secreta v1"
                className="lab-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="input-wrapper">
              <label className="input-label">Ingrediente Base</label>
              <input
                type="text"
                placeholder="Ej: Tomate triturado"
                className="lab-input"
                value={ingrediente1}
                onChange={(e) => setIng1(e.target.value)}
              />
            </div>

            <div className="plus-separator">
              <span>+</span>
            </div>

            <div className="input-wrapper">
              <label className="input-label">Ingrediente Secundario</label>
              <input
                type="text"
                placeholder="Ej: Albahaca fresca"
                className="lab-input"
                value={ingrediente2}
                onChange={(e) => setIng2(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* PANEL DERECHO: NOTAS Y DETALLES */}
        <div className="panel notes-panel">
          <h3>📝 Cuaderno de Campo</h3>

          <div className="input-wrapper">
            <label className="input-label">Observaciones y Pasos</label>
            <textarea
              className="notes-area"
              placeholder="Describe el sabor, la textura y el proceso de cocción..."
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
            />
          </div>

          <div className="lab-options">
            <div className="select-group">
              <label className="input-label">Tiempo</label>
              <input
                type="text"
                className="lab-input"
                placeholder="45 min"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            <div className="select-group">
              <label className="input-label">Dificultad</label>
              <select
                className="lab-select"
                value={complexity}
                onChange={(e) => setComplexity(e.target.value)}
              >
                <option value="Baja">🟢 Baja</option>
                <option value="Media">🟡 Media</option>
                <option value="Alta">🔴 Alta</option>
              </select>
            </div>
          </div>

          <div className="lab-actions">
            <button
              className="btn-lab secondary"
              onClick={() => {
                setTitle("");
                setIng1("");
                setIng2("");
                setNotas("");
              }}
            >
              Borrar Todo
            </button>
            <button className="btn-lab primary" onClick={handleSave}>
              Guardar Receta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaboratorioView;
