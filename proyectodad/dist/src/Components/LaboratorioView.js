"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const RecetasView_1 = __importDefault(require("./RecetasView"));
require("./Laboratorio.css");
const LaboratorioContent = () => ((0, jsx_runtime_1.jsxs)("div", { className: "laboratorio-content", children: [(0, jsx_runtime_1.jsx)("h2", { children: "Laboratorio" }), (0, jsx_runtime_1.jsxs)("div", { className: "experiment-panels", children: [(0, jsx_runtime_1.jsxs)("div", { className: "ingredient-panel", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Escribe aqui su ingrediente principal", readOnly: true }), (0, jsx_runtime_1.jsx)("div", { className: "plus-sign", children: "+" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Escribe aqui su ingrediente secundario", readOnly: true }), (0, jsx_runtime_1.jsx)("button", { className: "btn-lab primary", children: "Probar nueva mezcla" }), (0, jsx_runtime_1.jsx)("button", { className: "btn-lab secondary", children: "Guardar combinacion" }), (0, jsx_runtime_1.jsx)("button", { className: "btn-lab tertiary", children: "Receta aleatoria" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "notes-panel", children: [(0, jsx_runtime_1.jsx)("textarea", { placeholder: "Escribe aqui tus notas y observaciones", readOnly: true }), (0, jsx_runtime_1.jsx)("p", { children: "Nivel de complejidad: Facil-Medio-Alto" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Ponerle otro nombre.", readOnly: true })] })] })] }));
function LaboratorioView({ onLogout, currentPage, setCurrentPage, }) {
    const renderContent = () => {
        switch (currentPage) {
            case "Laboratorio":
                return (0, jsx_runtime_1.jsx)(LaboratorioContent, {});
            case "Mis recetas":
                return (0, jsx_runtime_1.jsx)(RecetasView_1.default, {});
            default:
                return (0, jsx_runtime_1.jsx)(LaboratorioContent, {});
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "main-layout", children: (0, jsx_runtime_1.jsxs)("div", { className: "content-area", children: [(0, jsx_runtime_1.jsxs)("div", { className: "header-icons", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83D\uDD0A" }), (0, jsx_runtime_1.jsx)("span", { children: "\u2753" }), (0, jsx_runtime_1.jsx)("span", { children: "\u2699\uFE0F" }), (0, jsx_runtime_1.jsx)("span", { children: "\uD83D\uDC64" })] }), renderContent()] }) }));
}
exports.default = LaboratorioView;
