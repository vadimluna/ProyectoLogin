import React from "react";
import "./Recetas.css"; // Asegúrate de importar el CSS correcto

const mockRecipes = [
  {
    id: 1,
    name: "Paella de la Abuela",
    ingredients: "Sal, Pimienta, Harina, Pollo",
    reference: "Familia",
    complexity: "Alta" // Nuevo dato
  },
  {
    id: 2,
    name: "Pasta Carbonara",
    ingredients: "Huevo, Queso, Pasta, Bacon",
    reference: "Libro Italiano",
    complexity: "Media" // Nuevo dato
  },
  {
    id: 3,
    name: "Brownie Express",
    ingredients: "Azúcar, Mantequilla, Chocolate",
    reference: "Web",
    complexity: "Baja" // Nuevo dato
  },
  {
    id: 4,
    name: "Ensalada Detox",
    ingredients: "Tomate, Cebolla, Pepino, Limón",
    reference: "Propia",
    complexity: "Baja" // Nuevo dato
  },
];

const RecetasView: React.FC = () => {
  // Función auxiliar para clase de color según complejidad
  const getComplexityClass = (complexity: string) => {
    return complexity.toLowerCase(); // 'baja', 'media', 'alta'
  };

  return (
    <div className="recetas-container">
      <h2>Mis recetas guardadas</h2>

      <div className="recetas-toolbar">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar receta, ingredientes..."
          />
        </div>
        <button className="btn-lab secondary">
          <span>+</span> Añadir nueva receta
        </button>
      </div>

      <div className="recetas-table-wrapper">
        <table className="recetas-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Ingredientes</th>
              <th>Complejidad</th> {/* Nueva Columna */}
              <th>Referencia</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {mockRecipes.map((recipe) => (
              <tr key={recipe.id}>
                <td>{recipe.name}</td>
                <td>{recipe.ingredients}</td>
                <td>
                  <span className={`badge-complexity ${getComplexityClass(recipe.complexity)}`}>
                    {recipe.complexity}
                  </span>
                </td>
                <td>{recipe.reference}</td>
                <td className="actions">
                  <button className="btn-lab edit">✏️</button>
                  <button className="btn-lab delete">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecetasView;