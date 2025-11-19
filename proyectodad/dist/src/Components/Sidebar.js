"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./Sidebar.css");
const logo_svg_1 = __importDefault(require("../logo.svg"));
const Sidebar = ({ onLogout, onNavigate, currentPage, }) => {
    const menuItems = [
        "Laboratorio",
        "Cocina",
        "Mis recetas",
        "Enciclopedia",
        "Desafío",
        "Historial",
        "Ajustes",
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "sidebar", children: [(0, jsx_runtime_1.jsxs)("div", { className: "sidebar-logo", children: [(0, jsx_runtime_1.jsx)("img", { src: logo_svg_1.default, alt: "CookLab logo" }), (0, jsx_runtime_1.jsxs)("h1", { className: "sidebar-title", children: [(0, jsx_runtime_1.jsx)("span", { className: "cook", children: "Cook" }), (0, jsx_runtime_1.jsx)("span", { className: "lab", children: "Lab" })] }), (0, jsx_runtime_1.jsx)("p", { children: "Laboratorio de sabores" })] }), (0, jsx_runtime_1.jsx)("div", { className: "sidebar-divider" }), (0, jsx_runtime_1.jsx)("div", { className: "sidebar-menu", children: (0, jsx_runtime_1.jsxs)("ul", { children: [menuItems.map((item) => ((0, jsx_runtime_1.jsx)("li", { className: item === currentPage ? "active" : "", onClick: () => onNavigate(item), children: item }, item))), (0, jsx_runtime_1.jsxs)("li", { className: "logout", onClick: onLogout, children: [" ", "Salir"] })] }) })] }));
};
exports.default = Sidebar;
