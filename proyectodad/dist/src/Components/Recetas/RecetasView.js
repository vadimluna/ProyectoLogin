"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("../Laboratorio/Laboratorio.css");
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
const RecetasView = () => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "recetas-container", children: [(0, jsx_runtime_1.jsx)("h2", { children: "Mis recetas guardadas" }), (0, jsx_runtime_1.jsxs)("div", { className: "recetas-toolbar", children: [(0, jsx_runtime_1.jsxs)("div", { className: "search-bar", children: [(0, jsx_runtime_1.jsx)("span", { className: "search-icon", children: "\uD83D\uDD0D" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Buscar la receta, ingredientes y etc." })] }), (0, jsx_runtime_1.jsx)("button", { className: "btn-lab secondary", children: "+ A\u00F1adir una nueva receta" })] }), (0, jsx_runtime_1.jsx)("div", { className: "recetas-table-wrapper", children: (0, jsx_runtime_1.jsxs)("table", { className: "recetas-table", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { children: "Nombre" }), (0, jsx_runtime_1.jsx)("th", { children: "Ingredientes" }), (0, jsx_runtime_1.jsx)("th", { children: "Referencia" }), (0, jsx_runtime_1.jsx)("th", { children: "Acci\u00F3n" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: mockRecipes.map((recipe) => ((0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("td", { children: recipe.name }), (0, jsx_runtime_1.jsx)("td", { children: recipe.ingredients }), (0, jsx_runtime_1.jsx)("td", { children: recipe.reference }), (0, jsx_runtime_1.jsxs)("td", { className: "actions", children: [(0, jsx_runtime_1.jsx)("button", { className: "btn-lab edit", children: "editar" }), (0, jsx_runtime_1.jsx)("button", { className: "btn-lab delete", children: "borrar" })] })] }, recipe.id))) })] }) })] }));
};
exports.default = RecetasView;
