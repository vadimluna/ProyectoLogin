"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./Sidebar.css");
const Sidebar = ({ onLogout, onNavigate, currentPage, username = "Usuario", }) => {
    const menuItems = [
        "Laboratorio",
        "Mis recetas",
        "Cocina",
        "Enciclopedia",
        "Desafío",
        "Historial",
        "Ajustes",
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "sidebar", children: [(0, jsx_runtime_1.jsxs)("div", { className: "sidebar-brand", children: [(0, jsx_runtime_1.jsxs)("h1", { className: "brand-title", children: [(0, jsx_runtime_1.jsx)("span", { className: "cook", children: "Cook" }), (0, jsx_runtime_1.jsx)("span", { className: "lab", children: "Lab" })] }), (0, jsx_runtime_1.jsx)("p", { className: "brand-subtitle", children: "Laboratorio de sabores" })] }), (0, jsx_runtime_1.jsx)("div", { className: "separator-line" }), (0, jsx_runtime_1.jsxs)("div", { className: "sidebar-profile", children: [(0, jsx_runtime_1.jsx)("div", { className: "avatar-circle", children: username.charAt(0).toUpperCase() }), (0, jsx_runtime_1.jsxs)("div", { className: "profile-info", children: [(0, jsx_runtime_1.jsx)("h3", { children: username }), (0, jsx_runtime_1.jsx)("span", { children: "Chef Ejecutivo" })] })] }), (0, jsx_runtime_1.jsx)("ul", { className: "sidebar-menu", children: menuItems.map((item) => ((0, jsx_runtime_1.jsx)("li", { className: currentPage === item ? "active" : "", onClick: () => onNavigate(item), children: item }, item))) }), (0, jsx_runtime_1.jsxs)("div", { className: "sidebar-footer", children: [(0, jsx_runtime_1.jsx)("div", { className: "separator-line" }), (0, jsx_runtime_1.jsx)("button", { className: "logout-btn", onClick: onLogout, children: "Cerrar Sesi\u00F3n" })] })] }));
};
exports.default = Sidebar;
