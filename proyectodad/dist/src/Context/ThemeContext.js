"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTheme = exports.ThemeProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ThemeContext = (0, react_1.createContext)(undefined);
const ThemeProvider = ({ children, }) => {
    const [isDarkMode, setIsDarkMode] = (0, react_1.useState)(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme === "dark";
    });
    (0, react_1.useEffect)(() => {
        if (isDarkMode) {
            document.documentElement.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
        }
        else {
            document.documentElement.setAttribute("data-theme", "light");
            localStorage.setItem("theme", "light");
        }
    }, [isDarkMode]);
    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev);
    };
    return ((0, jsx_runtime_1.jsx)(ThemeContext.Provider, { value: { isDarkMode, toggleTheme }, children: children }));
};
exports.ThemeProvider = ThemeProvider;
const useTheme = () => {
    const context = (0, react_1.useContext)(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
exports.useTheme = useTheme;
