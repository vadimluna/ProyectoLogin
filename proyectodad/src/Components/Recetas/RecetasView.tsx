import React, { useState, useEffect } from "react";
import "./Recetas.css";

interface Recipe {
  id: number;
  title: string;
  description: string;
  ingredients: string;
  time: string;
  author: string;
  complexity: string;
}

interface RecetasViewProps {
  onNavigateToLab: () => void;
}

const RecetasView: React.FC<RecetasViewProps> = ({ onNavigateToLab }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const currentUser = localStorage.getItem("username") || "Chef";

  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/recipes?username=${currentUser}`
      );
      if (response.ok) {
        const data = await response.json();
        setRecipes(data);
      }
    } catch (error) {
      console.error("Error al cargar recetas", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que quieres borrar esta receta?")) return;

    try {
      const response = await fetch(`http://localhost:3001/api/recipes/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setRecipes(recipes.filter((r) => r.id !== id));
      }
    } catch (error) {
      console.error("Error al borrar", error);
    }
  };

  const handleEditClick = (recipe: Recipe) => {
    setEditingRecipe(recipe);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecipe) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/recipes/${editingRecipe.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingRecipe),
        }
      );

      if (response.ok) {
        const updated = await response.json();
        setRecipes(
          recipes.map((r) => (r.id === updated.recipe.id ? updated.recipe : r))
        );
        setEditingRecipe(null);
      }
    } catch (error) {
      console.error("Error actualizando", error);
    }
  };

  const getComplexityClass = (complexity: string) => {
    if (!complexity) return "media";
    return complexity.toLowerCase();
  };

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="recetas-container">
      <div className="recetas-header-row">
        <h2>Mis recetas guardadas</h2>
        <div className="recetas-toolbar">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar receta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-add-lab" onClick={onNavigateToLab}>
            <span>+</span> Nueva Receta
          </button>
        </div>
      </div>

      <div className="recetas-table-wrapper">
        <table className="recetas-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Ingredientes</th>
              <th>Complejidad</th>
              <th>Tiempo</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecipes.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    textAlign: "center",
                    padding: "30px",
                    color: "var(--text-secondary)",
                  }}
                >
                  {searchTerm
                    ? "No se encontraron resultados"
                    : "No tienes recetas. ¡Crea una nueva!"}
                </td>
              </tr>
            ) : (
              filteredRecipes.map((recipe) => (
                <tr key={recipe.id}>
                  <td>
                    <strong>{recipe.title}</strong>
                  </td>
                  <td className="truncate-cell" title={recipe.ingredients}>
                    {recipe.ingredients}
                  </td>
                  <td>
                    <span
                      className={`badge-complexity ${getComplexityClass(
                        recipe.complexity
                      )}`}
                    >
                      {recipe.complexity}
                    </span>
                  </td>
                  <td>{recipe.time}</td>
                  <td className="actions">
                    <button
                      className="btn-lab edit"
                      onClick={() => handleEditClick(recipe)}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-lab delete"
                      onClick={() => handleDelete(recipe.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editingRecipe && (
        <div className="modal-overlay">
          <div className="recipe-form-card">
            <h3>Editar Receta</h3>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Título</label>
                <input
                  type="text"
                  value={editingRecipe.title}
                  onChange={(e) =>
                    setEditingRecipe({
                      ...editingRecipe,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-row">
                <div className="form-group half">
                  <label>Tiempo</label>
                  <input
                    type="text"
                    value={editingRecipe.time}
                    onChange={(e) =>
                      setEditingRecipe({
                        ...editingRecipe,
                        time: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group half">
                  <label>Complejidad</label>
                  <select
                    value={editingRecipe.complexity}
                    onChange={(e) =>
                      setEditingRecipe({
                        ...editingRecipe,
                        complexity: e.target.value,
                      })
                    }
                    className="lab-select-simple"
                  >
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Ingredientes</label>
                <textarea
                  rows={3}
                  value={editingRecipe.ingredients}
                  onChange={(e) =>
                    setEditingRecipe({
                      ...editingRecipe,
                      ingredients: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setEditingRecipe(null)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecetasView;
