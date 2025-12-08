"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("./Ajustes.css");
const ThemeContext_1 = require("../../Context/ThemeContext");
const AjustesView = ({ username = "Chef", onLogout, }) => {
    const { isDarkMode, toggleTheme } = (0, ThemeContext_1.useTheme)();
    const [currentPass, setCurrentPass] = (0, react_1.useState)("");
    const [newPass, setNewPass] = (0, react_1.useState)("");
    const [confirmPass, setConfirmPass] = (0, react_1.useState)("");
    const validatePasswordRules = (pwd) => {
        if (pwd.length < 6)
            return "Mínimo 6 caracteres.";
        if (!/[A-Z]/.test(pwd))
            return "Falta una mayúscula.";
        if (!/[0-9]/.test(pwd))
            return "Falta un número.";
        // NUEVA REGLA: SÍMBOLO
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd))
            return "Falta un símbolo.";
        return null;
    };
    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!currentPass || !newPass || !confirmPass) {
            alert("Por favor, rellena todos los campos.");
            return;
        }
        if (newPass !== confirmPass) {
            alert("Las contraseñas no coinciden.");
            return;
        }
        const errorMsg = validatePasswordRules(newPass);
        if (errorMsg) {
            alert(`Contraseña insegura: ${errorMsg}`);
            return;
        }
        const isConfirmed = window.confirm("¿Seguro que quieres cambiar la contraseña?");
        if (!isConfirmed)
            return;
        try {
            const response = await fetch("http://localhost:3001/api/update-password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    currentPassword: currentPass,
                    newPassword: newPass,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                alert("¡Contraseña actualizada!");
                setCurrentPass("");
                setNewPass("");
                setConfirmPass("");
            }
            else {
                alert(`Error: ${data.message}`);
            }
        }
        catch (err) {
            alert("Error de servidor.");
        }
    };
    // ... (El resto del componente es igual, incluyendo handleDeleteAccount)
    const handleDeleteAccount = async () => {
        if (!window.confirm("⚠️ ¿ESTÁS SEGURO?\n\nEsta acción es irreversible."))
            return;
        try {
            const response = await fetch("http://localhost:3001/api/delete-account", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username }),
            });
            if (response.ok) {
                alert("Cuenta eliminada.");
                onLogout();
            }
            else {
                alert("Error al eliminar.");
            }
        }
        catch (err) {
            alert("Error de conexión.");
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "ajustes-container", children: [(0, jsx_runtime_1.jsxs)("header", { className: "ajustes-header centered", children: [(0, jsx_runtime_1.jsx)("h1", { children: "Configuraci\u00F3n del Chef" }), (0, jsx_runtime_1.jsx)("p", { children: "Personaliza tu experiencia en el laboratorio" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "settings-grid", children: [(0, jsx_runtime_1.jsxs)("div", { className: "left-column", children: [(0, jsx_runtime_1.jsxs)("div", { className: "settings-card profile-card", children: [(0, jsx_runtime_1.jsxs)("div", { className: "profile-header", children: [(0, jsx_runtime_1.jsxs)("div", { className: "avatar-wrapper", children: [(0, jsx_runtime_1.jsx)("div", { className: "avatar-placeholder-large", children: username.charAt(0).toUpperCase() }), (0, jsx_runtime_1.jsx)("button", { className: "edit-avatar-btn", children: "\uD83D\uDCF7" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "profile-info", children: [(0, jsx_runtime_1.jsx)("h4", { children: username }), (0, jsx_runtime_1.jsx)("span", { className: "badge-role", children: "Chef Ejecutivo" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "profile-stats", children: [(0, jsx_runtime_1.jsxs)("div", { className: "stat", children: [(0, jsx_runtime_1.jsx)("strong", { children: "12" }), (0, jsx_runtime_1.jsx)("span", { children: "Recetas" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "stat", children: [(0, jsx_runtime_1.jsx)("strong", { children: "4.8" }), (0, jsx_runtime_1.jsx)("span", { children: "Rating" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "stat", children: [(0, jsx_runtime_1.jsx)("strong", { children: "25" }), (0, jsx_runtime_1.jsx)("span", { children: "Seguidores" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "settings-card security-card", children: [(0, jsx_runtime_1.jsx)("h3", { children: "\uD83D\uDD10 Seguridad de la Cuenta" }), (0, jsx_runtime_1.jsxs)("form", { className: "security-form", onSubmit: handleChangePassword, children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-section", children: [(0, jsx_runtime_1.jsx)("label", { className: "section-title", children: "Datos Personales" }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { children: "Nombre de Usuario" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-with-icon", children: [(0, jsx_runtime_1.jsx)("span", { className: "icon", children: "\uD83D\uDC64" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: username, className: "clean-input locked", readOnly: true })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { children: "Correo Electr\u00F3nico" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-with-icon", children: [(0, jsx_runtime_1.jsx)("span", { className: "icon", children: "\u2709\uFE0F" }), (0, jsx_runtime_1.jsx)("input", { type: "email", value: `${username}@cooklab.com`, className: "clean-input locked", readOnly: true })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "divider" }), (0, jsx_runtime_1.jsxs)("div", { className: "form-section", children: [(0, jsx_runtime_1.jsx)("label", { className: "section-title", children: "Cambiar Contrase\u00F1a" }), (0, jsx_runtime_1.jsx)("p", { className: "password-hint", children: "M\u00EDn 6 chars, may\u00FAscula, n\u00FAmero y s\u00EDmbolo." }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { children: "Contrase\u00F1a Actual" }), (0, jsx_runtime_1.jsxs)("div", { className: "input-with-icon", children: [(0, jsx_runtime_1.jsx)("span", { className: "icon", children: "\uD83D\uDD11" }), (0, jsx_runtime_1.jsx)("input", { type: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", className: "clean-input password-field", value: currentPass, onChange: (e) => setCurrentPass(e.target.value) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "password-row", children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group half", children: [(0, jsx_runtime_1.jsx)("label", { children: "Nueva Contrase\u00F1a" }), (0, jsx_runtime_1.jsx)("input", { type: "password", placeholder: "Nueva...", className: "clean-input password-field", value: newPass, onChange: (e) => setNewPass(e.target.value) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group half", children: [(0, jsx_runtime_1.jsx)("label", { children: "Confirmar" }), (0, jsx_runtime_1.jsx)("input", { type: "password", placeholder: "Repetir...", className: "clean-input password-field", value: confirmPass, onChange: (e) => setConfirmPass(e.target.value) })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "form-footer", children: (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "btn-save-security", children: "\uD83D\uDCBE Guardar Cambios" }) })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "right-column", children: [(0, jsx_runtime_1.jsxs)("div", { className: "settings-card", children: [(0, jsx_runtime_1.jsx)("h3", { children: "\uD83C\uDFA8 Preferencias" }), (0, jsx_runtime_1.jsxs)("div", { className: "setting-item", children: [(0, jsx_runtime_1.jsxs)("div", { className: "setting-text", children: [(0, jsx_runtime_1.jsx)("h4", { children: "Modo Oscuro" }), (0, jsx_runtime_1.jsx)("p", { children: "Cambiar apariencia del laboratorio" })] }), (0, jsx_runtime_1.jsxs)("label", { className: "switch", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: isDarkMode, onChange: toggleTheme }), (0, jsx_runtime_1.jsx)("span", { className: "slider round" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "setting-item", children: [(0, jsx_runtime_1.jsxs)("div", { className: "setting-text", children: [(0, jsx_runtime_1.jsx)("h4", { children: "Notificaciones" }), (0, jsx_runtime_1.jsx)("p", { children: "Alertas de recetas" })] }), (0, jsx_runtime_1.jsxs)("label", { className: "switch", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", defaultChecked: true }), (0, jsx_runtime_1.jsx)("span", { className: "slider round" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "settings-card danger-zone centered-content", children: [(0, jsx_runtime_1.jsx)("h3", { children: "\u26A0\uFE0F Zona de Peligro" }), (0, jsx_runtime_1.jsx)("p", { children: "Estas acciones no se pueden deshacer" }), (0, jsx_runtime_1.jsxs)("div", { className: "danger-actions", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", className: "btn-danger outline", onClick: onLogout, children: "Cerrar Sesi\u00F3n" }), (0, jsx_runtime_1.jsx)("button", { type: "button", className: "btn-danger", onClick: handleDeleteAccount, children: "Eliminar Cuenta" })] })] })] })] })] }));
};
exports.default = AjustesView;
