"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("./App.css");
const logo_svg_1 = __importDefault(require("./logo.svg"));
const LaboratorioView_1 = __importDefault(require("./Components/LaboratorioView"));
const Registerview_1 = __importDefault(require("./Components/Registerview"));
const Sidebar_1 = __importDefault(require("./Components/Sidebar"));
function App() {
    const [loggedIn, setLoggedIn] = (0, react_1.useState)(false);
    const [currentPage, setCurrentPage] = (0, react_1.useState)("Laboratorio");
    const [username, setUsername] = (0, react_1.useState)("");
    const [password, setPassword] = (0, react_1.useState)("");
    const [error, setError] = (0, react_1.useState)("");
    const [viewMode, setViewMode] = (0, react_1.useState)("login");
    const handleLogin = async () => {
        setError("");
        if (!username || !password) {
            setError("Por favor, ingrese el usuario y la contraseña.");
            return;
        }
        try {
            const response = await fetch("http://localhost:3001/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
            if (response.ok) {
                setLoggedIn(true);
                setCurrentPage("Laboratorio");
                setError("");
                setViewMode("login");
            }
            else {
                const errorData = await response.json();
                setError(errorData.message || "Usuario o contraseña incorrectos.");
            }
        }
        catch (err) {
            setError("Error de conexión con el servidor. Asegúrate de que tu backend está corriendo en http://localhost:3001.");
            console.error("Login error:", err);
        }
    };
    const handleLogout = () => {
        setLoggedIn(false);
        setViewMode("login");
        setUsername("");
        setPassword("");
    };
    const renderLoginView = () => ((0, jsx_runtime_1.jsx)("div", { className: "login-container", children: (0, jsx_runtime_1.jsxs)("div", { className: "login-card", children: [(0, jsx_runtime_1.jsx)("img", { src: logo_svg_1.default, alt: "CookLab logo", className: "logo" }), (0, jsx_runtime_1.jsxs)("h1", { className: "title", children: [(0, jsx_runtime_1.jsx)("span", { className: "cook", children: "Cook" }), (0, jsx_runtime_1.jsx)("span", { className: "lab", children: "Lab" })] }), (0, jsx_runtime_1.jsx)("p", { className: "subtitle", children: "Laboratorio de sabores" }), (0, jsx_runtime_1.jsx)("h2", { className: "welcome", children: "\u00A1Bienvenido al laboratorio del sabor!" }), (0, jsx_runtime_1.jsxs)("div", { className: "inputs", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Usuario", value: username, onChange: (e) => setUsername(e.target.value) }), (0, jsx_runtime_1.jsx)("input", { type: "password", placeholder: "Contrase\u00F1a", value: password, onChange: (e) => setPassword(e.target.value) })] }), error && (0, jsx_runtime_1.jsx)("div", { className: "message error", children: error }), (0, jsx_runtime_1.jsxs)("div", { className: "buttons", children: [(0, jsx_runtime_1.jsx)("button", { className: "btn enter", onClick: handleLogin, children: "Entrar" }), (0, jsx_runtime_1.jsx)("button", { className: "btn register", onClick: () => {
                                setViewMode("register");
                                setError("");
                            }, children: "Registrarse" }), (0, jsx_runtime_1.jsx)("button", { className: "btn recover", children: "Recuperar contrase\u00F1a" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "icons", children: [(0, jsx_runtime_1.jsx)("span", { className: "icon", children: "\uD83D\uDD0A" }), (0, jsx_runtime_1.jsx)("span", { className: "icon", children: "\u2753" }), (0, jsx_runtime_1.jsx)("span", { className: "icon", children: "\u2699\uFE0F" })] })] }) }));
    const renderMainContent = () => ((0, jsx_runtime_1.jsxs)("div", { style: { display: "flex", height: "100vh" }, children: [(0, jsx_runtime_1.jsx)(Sidebar_1.default, { onLogout: handleLogout, onNavigate: setCurrentPage, currentPage: currentPage }), (0, jsx_runtime_1.jsx)("main", { style: { flexGrow: 1, padding: "20px" }, children: (0, jsx_runtime_1.jsx)(LaboratorioView_1.default, { currentPage: currentPage, setCurrentPage: setCurrentPage, onLogout: handleLogout }) })] }));
    if (loggedIn) {
        return renderMainContent();
    }
    if (viewMode === "register") {
        return (0, jsx_runtime_1.jsx)(Registerview_1.default, { onBackToLogin: () => setViewMode("login") });
    }
    return renderLoginView();
}
exports.default = App;
