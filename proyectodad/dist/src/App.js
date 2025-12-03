"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("./App.css");
const LaboratorioView_1 = __importDefault(require("./Components/Laboratorio/LaboratorioView"));
const RecetasView_1 = __importDefault(require("./Components/Recetas/RecetasView"));
const Registerview_1 = __importDefault(require("./Components/Register/Registerview"));
const Sidebar_1 = __importDefault(require("./Components/Sidebar/Sidebar"));
function App() {
    const [loggedIn, setLoggedIn] = (0, react_1.useState)(false);
    const [currentPage, setCurrentPage] = (0, react_1.useState)("Laboratorio");
    const [username, setUsername] = (0, react_1.useState)("");
    const [password, setPassword] = (0, react_1.useState)("");
    const [error, setError] = (0, react_1.useState)("");
    const [viewMode, setViewMode] = (0, react_1.useState)("login");
    (0, react_1.useEffect)(() => {
        const isLogged = localStorage.getItem("isLogged");
        if (isLogged === "true") {
            setLoggedIn(true);
        }
    }, []);
    const handleLogout = () => {
        localStorage.removeItem("isLogged");
        setLoggedIn(false);
        setUsername("");
        setPassword("");
        setError("");
        setViewMode("login");
        setCurrentPage("Laboratorio");
    };
    const handleLogin = async () => {
        setError("");
        if (!username || !password) {
            setError("Por favor, ingresa tus credenciales.");
            return;
        }
        try {
            const response = await fetch("http://localhost:3001/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            if (response.ok) {
                localStorage.setItem("isLogged", "true");
                setLoggedIn(true);
                setError("");
                setViewMode("login");
            }
            else {
                const errorData = await response.json();
                setError(errorData.message || "Credenciales incorrectas.");
            }
        }
        catch (err) {
            setError("Error: No se pudo conectar con el servidor.");
        }
    };
    const renderContent = () => {
        switch (currentPage) {
            case "Laboratorio":
                return (0, jsx_runtime_1.jsx)(LaboratorioView_1.default, {});
            case "Mis recetas":
                return (0, jsx_runtime_1.jsx)(RecetasView_1.default, {});
            default:
                return ((0, jsx_runtime_1.jsxs)("div", { style: { padding: "40px", textAlign: "center", color: "#555" }, children: [(0, jsx_runtime_1.jsx)("h1", { children: currentPage }), (0, jsx_runtime_1.jsx)("p", { children: "Pr\u00F3ximamente..." })] }));
        }
    };
    const renderLoginView = () => ((0, jsx_runtime_1.jsx)("div", { className: "login-wrapper", children: (0, jsx_runtime_1.jsxs)("div", { className: "login-box", children: [(0, jsx_runtime_1.jsx)("div", { className: "login-banner", children: (0, jsx_runtime_1.jsxs)("div", { className: "banner-content", children: [(0, jsx_runtime_1.jsx)("h1", { children: "CookLab" }), (0, jsx_runtime_1.jsx)("p", { children: "Tu laboratorio de sabores" })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "login-form-section", children: [(0, jsx_runtime_1.jsx)("h2", { children: "Bienvenido mi chef!" }), (0, jsx_runtime_1.jsx)("p", { className: "login-subtitle", children: "Por favor inicia sesi\u00F3n en tu cuenta" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-group", children: [(0, jsx_runtime_1.jsx)("span", { className: "input-icon", children: "\uD83D\uDC64" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Usuario/Correo electr\u00F3nico", value: username, onChange: (e) => setUsername(e.target.value), autoComplete: "off" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "input-group", children: [(0, jsx_runtime_1.jsx)("span", { className: "input-icon", children: "\uD83D\uDD12" }), (0, jsx_runtime_1.jsx)("input", { type: "password", placeholder: "Contrese\u00F1a", value: password, onChange: (e) => setPassword(e.target.value), onKeyDown: (e) => e.key === "Enter" && handleLogin(), autoComplete: "new-password" })] }), (0, jsx_runtime_1.jsx)("div", { className: "form-options", children: (0, jsx_runtime_1.jsx)("span", { className: "forgot-pass", children: "\u00BFOlvidaste tu contrase\u00F1a?" }) }), error && (0, jsx_runtime_1.jsx)("div", { className: "error-msg", children: error }), (0, jsx_runtime_1.jsx)("button", { className: "btn-login", onClick: handleLogin, children: "Login" }), (0, jsx_runtime_1.jsxs)("p", { className: "register-text", children: ["\u00BFNuevo aqu\u00ED?", " ", (0, jsx_runtime_1.jsx)("span", { onClick: () => setViewMode("register"), children: "Crear cuenta" })] })] })] }) }));
    if (loggedIn) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "app-layout", children: [(0, jsx_runtime_1.jsx)(Sidebar_1.default, { onLogout: handleLogout, onNavigate: setCurrentPage, currentPage: currentPage, username: username || "Chef" }), (0, jsx_runtime_1.jsx)("main", { className: "main-content", children: renderContent() })] }));
    }
    if (viewMode === "register") {
        return ((0, jsx_runtime_1.jsx)(Registerview_1.default, { onBackToLogin: (msg) => {
                setViewMode("login");
                setError(msg);
            } }));
    }
    return renderLoginView();
}
exports.default = App;
