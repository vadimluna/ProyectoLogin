"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("./RegisterView.css");
const RegisterView = ({ onBackToLogin }) => {
    const [username, setUsername] = (0, react_1.useState)("");
    const [password, setPassword] = (0, react_1.useState)("");
    const [confirmPassword, setConfirmPassword] = (0, react_1.useState)("");
    const [email, setEmail] = (0, react_1.useState)("");
    const [error, setError] = (0, react_1.useState)("");
    const validatePasswordRules = (pwd) => {
        if (pwd.length < 6)
            return "Mínimo 6 caracteres.";
        if (!/[A-Z]/.test(pwd))
            return "Falta una mayúscula.";
        if (!/[0-9]/.test(pwd))
            return "Falta un número.";
        // NUEVA REGLA: SÍMBOLO
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd))
            return "Falta un símbolo (!@#$...).";
        return null;
    };
    const handleRegister = async () => {
        setError("");
        if (!username || !password || !confirmPassword || !email) {
            setError("Por favor, rellena todos los campos.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }
        const ruleError = validatePasswordRules(password);
        if (ruleError) {
            setError(`Contraseña insegura: ${ruleError}`);
            return;
        }
        try {
            const response = await fetch("http://localhost:3001/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, email }),
            });
            const data = await response.json();
            if (response.ok) {
                onBackToLogin("¡Cuenta creada con éxito! Por favor, inicia sesión.");
            }
            else {
                setError(data.message || "Error al registrarse.");
            }
        }
        catch (err) {
            setError("Error de conexión con el servidor.");
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "register-wrapper", children: (0, jsx_runtime_1.jsxs)("div", { className: "register-box", children: [(0, jsx_runtime_1.jsx)("div", { className: "register-banner", children: (0, jsx_runtime_1.jsxs)("div", { className: "banner-content", children: [(0, jsx_runtime_1.jsx)("h1", { children: "CookLab" }), (0, jsx_runtime_1.jsx)("p", { children: "\u00DAnete al laboratorio" }), (0, jsx_runtime_1.jsx)("div", { className: "banner-icon", children: "\uD83D\uDC68\u200D\uD83C\uDF73" })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "register-form-section", children: [(0, jsx_runtime_1.jsx)("h2", { children: "Crear Cuenta" }), (0, jsx_runtime_1.jsx)("p", { className: "subtitle", children: "Empieza tu viaje culinario hoy" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-group", children: [(0, jsx_runtime_1.jsx)("span", { className: "input-icon", children: "\u2709\uFE0F" }), (0, jsx_runtime_1.jsx)("input", { type: "email", placeholder: "Correo Electr\u00F3nico", value: email, onChange: (e) => setEmail(e.target.value) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "input-group", children: [(0, jsx_runtime_1.jsx)("span", { className: "input-icon", children: "\uD83D\uDC64" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Nombre de Usuario", value: username, onChange: (e) => setUsername(e.target.value) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "input-group", children: [(0, jsx_runtime_1.jsx)("span", { className: "input-icon", children: "\uD83D\uDD12" }), (0, jsx_runtime_1.jsx)("input", { type: "password", placeholder: "Contrase\u00F1a", value: password, onChange: (e) => setPassword(e.target.value) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "input-group", children: [(0, jsx_runtime_1.jsx)("span", { className: "input-icon", children: "\uD83D\uDD10" }), (0, jsx_runtime_1.jsx)("input", { type: "password", placeholder: "Confirmar Contrase\u00F1a", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), onKeyDown: (e) => e.key === "Enter" && handleRegister() })] }), (0, jsx_runtime_1.jsx)("p", { style: {
                                fontSize: "0.75rem",
                                color: "var(--text-secondary)",
                                marginTop: "-15px",
                                marginBottom: "20px",
                                textAlign: "left",
                                paddingLeft: "10px",
                                opacity: 0.8,
                            }, children: "\u2139\uFE0F M\u00EDn. 6 chars, 1 may\u00FAs, 1 num y 1 s\u00EDmbolo." }), error && (0, jsx_runtime_1.jsx)("div", { className: "error-msg", children: error }), (0, jsx_runtime_1.jsx)("button", { className: "btn-register", onClick: handleRegister, children: "Registrarse" }), (0, jsx_runtime_1.jsxs)("p", { className: "login-link", children: ["\u00BFYa tienes cuenta?", " ", (0, jsx_runtime_1.jsx)("span", { onClick: () => onBackToLogin(""), children: "Inicia Sesi\u00F3n" })] })] })] }) }));
};
exports.default = RegisterView;
