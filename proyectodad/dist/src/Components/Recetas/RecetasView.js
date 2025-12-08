"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("./Recetas.css");
const RecetasView = ({ onNavigateToLab }) => {
    const [recipes, setRecipes] = (0, react_1.useState)([]);
    const [searchTerm, setSearchTerm] = (0, react_1.useState)("");
    const currentUser = localStorage.getItem("username") || "Chef";
    const [editingRecipe, setEditingRecipe] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        fetchRecipes();
    }, []);
    const fetchRecipes = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/recipes?username=${currentUser}`);
            if (response.ok) {
                const data = await response.json();
                setRecipes(data);
            }
        }
        catch (error) {
            console.error("Error al cargar recetas", error);
        }
    };
    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que quieres borrar esta receta?"))
            return;
        try {
            const response = await fetch(`http://localhost:3001/api/recipes/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setRecipes(recipes.filter((r) => r.id !== id));
            }
        }
        catch (error) {
            console.error("Error al borrar", error);
        }
    };
    const handleEditClick = (recipe) => {
        setEditingRecipe(recipe);
    };
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editingRecipe)
            return;
        try {
            const response = await fetch(`http://localhost:3001/api/recipes/${editingRecipe.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingRecipe),
            });
            if (response.ok) {
                const updated = await response.json();
                setRecipes(recipes.map((r) => (r.id === updated.recipe.id ? updated.recipe : r)));
                setEditingRecipe(null);
            }
        }
        catch (error) {
            console.error("Error actualizando", error);
        }
    };
    const getComplexityClass = (complexity) => {
        if (!complexity)
            return "media";
        return complexity.toLowerCase();
    };
    const filteredRecipes = recipes.filter((recipe) => recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.toLowerCase().includes(searchTerm.toLowerCase()));
    return ((0, jsx_runtime_1.jsxs)("div", { className: "recetas-container", children: [(0, jsx_runtime_1.jsxs)("div", { className: "recetas-header-row", children: [(0, jsx_runtime_1.jsx)("h2", { children: "Mis recetas guardadas" }), (0, jsx_runtime_1.jsxs)("div", { className: "recetas-toolbar", children: [(0, jsx_runtime_1.jsxs)("div", { className: "search-bar", children: [(0, jsx_runtime_1.jsx)("span", { className: "search-icon", children: "\uD83D\uDD0D" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Buscar receta...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) })] }), (0, jsx_runtime_1.jsxs)("button", { className: "btn-add-lab", onClick: onNavigateToLab, children: [(0, jsx_runtime_1.jsx)("span", { children: "+" }), " Nueva Receta"] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "recetas-table-wrapper", children: (0, jsx_runtime_1.jsxs)("table", { className: "recetas-table", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { children: "Nombre" }), (0, jsx_runtime_1.jsx)("th", { children: "Ingredientes" }), (0, jsx_runtime_1.jsx)("th", { children: "Complejidad" }), (0, jsx_runtime_1.jsx)("th", { children: "Tiempo" }), (0, jsx_runtime_1.jsx)("th", { children: "Acci\u00F3n" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: filteredRecipes.length === 0 ? ((0, jsx_runtime_1.jsx)("tr", { children: (0, jsx_runtime_1.jsx)("td", { colSpan: 5, style: {
                                        textAlign: "center",
                                        padding: "30px",
                                        color: "var(--text-secondary)",
                                    }, children: searchTerm
                                        ? "No se encontraron resultados"
                                        : "No tienes recetas. ¡Crea una nueva!" }) })) : (filteredRecipes.map((recipe) => ((0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("td", { children: (0, jsx_runtime_1.jsx)("strong", { children: recipe.title }) }), (0, jsx_runtime_1.jsx)("td", { className: "truncate-cell", title: recipe.ingredients, children: recipe.ingredients }), (0, jsx_runtime_1.jsx)("td", { children: (0, jsx_runtime_1.jsx)("span", { className: `badge-complexity ${getComplexityClass(recipe.complexity)}`, children: recipe.complexity }) }), (0, jsx_runtime_1.jsx)("td", { children: recipe.time }), (0, jsx_runtime_1.jsxs)("td", { className: "actions", children: [(0, jsx_runtime_1.jsx)("button", { className: "btn-lab edit", onClick: () => handleEditClick(recipe), children: "\u270F\uFE0F" }), (0, jsx_runtime_1.jsx)("button", { className: "btn-lab delete", onClick: () => handleDelete(recipe.id), children: "\uD83D\uDDD1\uFE0F" })] })] }, recipe.id)))) })] }) }), editingRecipe && ((0, jsx_runtime_1.jsx)("div", { className: "modal-overlay", children: (0, jsx_runtime_1.jsxs)("div", { className: "recipe-form-card", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Editar Receta" }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleUpdate, children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { children: "T\u00EDtulo" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: editingRecipe.title, onChange: (e) => setEditingRecipe({
                                                ...editingRecipe,
                                                title: e.target.value,
                                            }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-row", children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group half", children: [(0, jsx_runtime_1.jsx)("label", { children: "Tiempo" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: editingRecipe.time, onChange: (e) => setEditingRecipe({
                                                        ...editingRecipe,
                                                        time: e.target.value,
                                                    }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group half", children: [(0, jsx_runtime_1.jsx)("label", { children: "Complejidad" }), (0, jsx_runtime_1.jsxs)("select", { value: editingRecipe.complexity, onChange: (e) => setEditingRecipe({
                                                        ...editingRecipe,
                                                        complexity: e.target.value,
                                                    }), className: "lab-select-simple", children: [(0, jsx_runtime_1.jsx)("option", { value: "Baja", children: "Baja" }), (0, jsx_runtime_1.jsx)("option", { value: "Media", children: "Media" }), (0, jsx_runtime_1.jsx)("option", { value: "Alta", children: "Alta" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { children: "Ingredientes" }), (0, jsx_runtime_1.jsx)("textarea", { rows: 3, value: editingRecipe.ingredients, onChange: (e) => setEditingRecipe({
                                                ...editingRecipe,
                                                ingredients: e.target.value,
                                            }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-actions", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", className: "btn-cancel", onClick: () => setEditingRecipe(null), children: "Cancelar" }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "btn-save", children: "Guardar Cambios" })] })] })] }) }))] }));
};
exports.default = RecetasView;
