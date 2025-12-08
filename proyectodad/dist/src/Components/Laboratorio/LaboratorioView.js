"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("./Laboratorio.css");
const LaboratorioView = ({ onSaveSuccess }) => {
    const [title, setTitle] = (0, react_1.useState)("");
    const [ingrediente1, setIng1] = (0, react_1.useState)("");
    const [ingrediente2, setIng2] = (0, react_1.useState)("");
    const [notas, setNotas] = (0, react_1.useState)("");
    const [time, setTime] = (0, react_1.useState)("");
    const [complexity, setComplexity] = (0, react_1.useState)("Media");
    const currentUser = localStorage.getItem("username") || "Chef";
    const handleSave = async () => {
        if (!title || (!ingrediente1 && !ingrediente2)) {
            alert("Necesitas un nombre y al menos un ingrediente.");
            return;
        }
        const fullIngredients = `${ingrediente1}${ingrediente2 ? `, ${ingrediente2}` : ""}`;
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
                }
                else {
                    // Reset fields if used standalone
                    setTitle("");
                    setIng1("");
                    setIng2("");
                    setNotas("");
                    setTime("");
                    alert("¡Experimento guardado con éxito!");
                }
            }
            else {
                alert("Error al guardar en el servidor.");
            }
        }
        catch (err) {
            console.error(err);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "laboratorio-container", children: [(0, jsx_runtime_1.jsxs)("header", { className: "view-header", children: [(0, jsx_runtime_1.jsx)("h2", { children: "\uD83E\uDDEA Laboratorio de Sabores" }), (0, jsx_runtime_1.jsx)("p", { children: "Mezcla ingredientes y crea tu pr\u00F3xima receta estrella" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "experiment-grid", children: [(0, jsx_runtime_1.jsxs)("div", { className: "panel mix-panel", children: [(0, jsx_runtime_1.jsx)("h3", { children: "\u2697\uFE0F Zona de Mezcla" }), (0, jsx_runtime_1.jsxs)("div", { className: "mix-inputs", children: [(0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)("label", { className: "input-label", children: "Nombre del Experimento" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Ej: Salsa Secreta v1", className: "lab-input", value: title, onChange: (e) => setTitle(e.target.value) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)("label", { className: "input-label", children: "Ingrediente Base" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Ej: Tomate triturado", className: "lab-input", value: ingrediente1, onChange: (e) => setIng1(e.target.value) })] }), (0, jsx_runtime_1.jsx)("div", { className: "plus-separator", children: (0, jsx_runtime_1.jsx)("span", { children: "+" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)("label", { className: "input-label", children: "Ingrediente Secundario" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Ej: Albahaca fresca", className: "lab-input", value: ingrediente2, onChange: (e) => setIng2(e.target.value) })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "panel notes-panel", children: [(0, jsx_runtime_1.jsx)("h3", { children: "\uD83D\uDCDD Cuaderno de Campo" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-wrapper", children: [(0, jsx_runtime_1.jsx)("label", { className: "input-label", children: "Observaciones y Pasos" }), (0, jsx_runtime_1.jsx)("textarea", { className: "notes-area", placeholder: "Describe el sabor, la textura y el proceso de cocci\u00F3n...", value: notas, onChange: (e) => setNotas(e.target.value) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "lab-options", children: [(0, jsx_runtime_1.jsxs)("div", { className: "select-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "input-label", children: "Tiempo" }), (0, jsx_runtime_1.jsx)("input", { type: "text", className: "lab-input", placeholder: "45 min", value: time, onChange: (e) => setTime(e.target.value) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "select-group", children: [(0, jsx_runtime_1.jsx)("label", { className: "input-label", children: "Dificultad" }), (0, jsx_runtime_1.jsxs)("select", { className: "lab-select", value: complexity, onChange: (e) => setComplexity(e.target.value), children: [(0, jsx_runtime_1.jsx)("option", { value: "Baja", children: "\uD83D\uDFE2 Baja" }), (0, jsx_runtime_1.jsx)("option", { value: "Media", children: "\uD83D\uDFE1 Media" }), (0, jsx_runtime_1.jsx)("option", { value: "Alta", children: "\uD83D\uDD34 Alta" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "lab-actions", children: [(0, jsx_runtime_1.jsx)("button", { className: "btn-lab secondary", onClick: () => {
                                            setTitle("");
                                            setIng1("");
                                            setIng2("");
                                            setNotas("");
                                        }, children: "Borrar Todo" }), (0, jsx_runtime_1.jsx)("button", { className: "btn-lab primary", onClick: handleSave, children: "Guardar Receta" })] })] })] })] }));
};
exports.default = LaboratorioView;
