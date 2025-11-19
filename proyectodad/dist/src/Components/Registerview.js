"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("./RegisterView.css");
const RegisterView = ({ onBackToLogin }) => {
    const [username, setUsername] = (0, react_1.useState)("");
    const [email, setEmail] = (0, react_1.useState)("");
    const [password, setPassword] = (0, react_1.useState)("");
    const [confirmPassword, setConfirmPassword] = (0, react_1.useState)("");
    const [error, setError] = (0, react_1.useState)("");
    const [success, setSuccess] = (0, react_1.useState)("");
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const handleRegister = async () => {
        setError("");
        setSuccess("");
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }
        if (!username || !email || !password) {
            setError("Todos los campos son obligatorios.");
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:3001/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
            });
            if (response.status === 201) {
                setSuccess("¡Registro exitoso! Serás redirigido para iniciar sesión.");
                setUsername("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setTimeout(onBackToLogin, 2500);
            }
            else {
                const errorData = await response.json();
                setError(errorData.message || "Error al registrar. Intenta de nuevo.");
            }
        }
        catch (err) {
            setError("Error de conexión con el servidor. Asegúrate de que tu backend está corriendo en http://localhost:3001.");
            console.error("Registro error:", err);
        }
        setIsLoading(false);
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "register-container", children: (0, jsx_runtime_1.jsxs)("div", { className: "register-card", children: [(0, jsx_runtime_1.jsxs)("h1", { className: "register-title", children: [(0, jsx_runtime_1.jsx)("span", { className: "cook", children: "Cook" }), (0, jsx_runtime_1.jsx)("span", { className: "lab", children: "Lab" })] }), (0, jsx_runtime_1.jsx)("p", { className: "register-subtitle", children: "Crea tu cuenta de laboratorio" }), (0, jsx_runtime_1.jsx)("h2", { className: "register-welcome", children: "\u00DAnete al sabor" }), (0, jsx_runtime_1.jsxs)("div", { className: "register-inputs", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Nombre de Usuario (Ser\u00E1 tu ID)", value: username, onChange: (e) => setUsername(e.target.value), disabled: isLoading }), (0, jsx_runtime_1.jsx)("input", { type: "email", placeholder: "Correo Electr\u00F3nico", value: email, onChange: (e) => setEmail(e.target.value), disabled: isLoading }), (0, jsx_runtime_1.jsx)("input", { type: "password", placeholder: "Contrase\u00F1a", value: password, onChange: (e) => setPassword(e.target.value), disabled: isLoading }), (0, jsx_runtime_1.jsx)("input", { type: "password", placeholder: "Confirmar Contrase\u00F1a", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), disabled: isLoading })] }), (error || success) && ((0, jsx_runtime_1.jsx)("div", { className: error ? "message error" : "message success", children: error || success })), (0, jsx_runtime_1.jsxs)("div", { className: "register-buttons", children: [(0, jsx_runtime_1.jsx)("button", { className: "btn enter", onClick: handleRegister, disabled: isLoading, children: isLoading ? "Registrando..." : "Registrarme" }), (0, jsx_runtime_1.jsx)("button", { className: "btn back-login", onClick: onBackToLogin, disabled: isLoading, children: "Volver a Iniciar Sesi\u00F3n" })] })] }) }));
};
exports.default = RegisterView;
