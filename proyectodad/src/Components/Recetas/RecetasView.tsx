import React from "react";
import "../Laboratorio/Laboratorio.css";

const mockRecipes = [
  {
    id: 1,
    name: "Receta de Prueba 1",
    ingredients: "Sal, Pimienta, Harina, Pollo",
    reference: "Familia: Paella de la Abuela",
  },
  {
    id: 2,
    name: "Receta de Prueba 2",
    ingredients: "Huevo, Queso, Pasta, Bacon",
    reference: "Libro: Recetas Italianas",
  },
  {
    id: 3,
    name: "Receta de Prueba 3",
    ingredients: "Azúcar, Mantequilla, Chocolate, Leche",
    reference: "Web: postresfaciles.com",
  },
  {
    id: 4,
    name: "Receta de Prueba 4",
    ingredients: "Tomate, Cebolla, Pepino, Limón",
    reference: "Propia: Ensalada Detox",
  },
];

const RecetasView: React.FC = () => {
  return (
    <div className="recetas-container">
      <h2>Mis recetas guardadas</h2>

      <div className="recetas-toolbar">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar la receta, ingredientes y etc."
          />
        </div>
        <button className="btn-lab secondary">+ Añadir una nueva receta</button>
      </div>

      <div className="recetas-table-wrapper">
        <table className="recetas-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Ingredientes</th>
              <th>Referencia</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {mockRecipes.map((recipe) => (
              <tr key={recipe.id}>
                <td>{recipe.name}</td>
                <td>{recipe.ingredients}</td>
                <td>{recipe.reference}</td>
                <td className="actions">
                  <button className="btn-lab edit">editar</button>
                  <button className="btn-lab delete">borrar</button>
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
