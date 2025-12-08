"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("./Enciclopedia.css");
const EnciclopediaView = () => {
    const [items, setItems] = (0, react_1.useState)([]);
    const [searchTerm, setSearchTerm] = (0, react_1.useState)("");
    const [filter, setFilter] = (0, react_1.useState)("Todos");
    const [selectedItem, setSelectedItem] = (0, react_1.useState)(null);
    const [isEditing, setIsEditing] = (0, react_1.useState)(false);
    const [isCreating, setIsCreating] = (0, react_1.useState)(false);
    const [formData, setFormData] = (0, react_1.useState)({});
    (0, react_1.useEffect)(() => {
        fetchItems();
    }, []);
    const fetchItems = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/encyclopedia");
            if (response.ok) {
                const data = await response.json();
                setItems(data.length > 0 ? data : []);
            }
        }
        catch (error) {
            console.error("Error cargando enciclopedia:", error);
        }
    };
    const filteredItems = items.filter((item) => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === "Todos" || item.category === filter;
        return matchesSearch && matchesFilter;
    });
    const handleCreateNew = () => {
        setSelectedItem(null);
        setFormData({
            title: "",
            category: "Ingrediente",
            description: "",
            icon: "❓",
        });
        setIsCreating(true);
        setIsEditing(true);
    };
    const handleDelete = async () => {
        if (!selectedItem)
            return;
        if (!window.confirm("¿Borrar esta entrada de la base de datos?"))
            return;
        try {
            await fetch(`http://localhost:3001/api/encyclopedia/${selectedItem.id}`, {
                method: "DELETE",
            });
            setItems(items.filter((i) => i.id !== selectedItem.id));
            setSelectedItem(null);
            setIsCreating(false);
        }
        catch (err) {
            alert("Error al borrar.");
        }
    };
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (isCreating) {
                const newItemData = { ...formData, icon: formData.icon || "📝" };
                const response = await fetch("http://localhost:3001/api/encyclopedia", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newItemData),
                });
                const result = await response.json();
                if (result.success)
                    setItems([...items, result.item]);
            }
            else if (selectedItem) {
                // EDITAR (PUT)
                const response = await fetch(`http://localhost:3001/api/encyclopedia/${selectedItem.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });
                const result = await response.json();
                if (result.success) {
                    setItems(items.map((i) => (i.id === selectedItem.id ? result.item : i)));
                }
            }
            setSelectedItem(null);
            setIsCreating(false);
            setIsEditing(false);
        }
        catch (err) {
            alert("Error al guardar en el servidor.");
        }
    };
    const handleCardClick = (item) => {
        setSelectedItem(item);
        setIsEditing(false);
        setIsCreating(false);
        setFormData(item);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "enciclopedia-container", children: [(0, jsx_runtime_1.jsxs)("header", { className: "view-header", children: [(0, jsx_runtime_1.jsx)("h2", { children: "\uD83D\uDCDA Enciclopedia del Sabor" }), (0, jsx_runtime_1.jsx)("p", { children: "Base de datos de conocimientos culinarios." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "wiki-toolbar", children: [(0, jsx_runtime_1.jsxs)("div", { className: "search-bar", children: [(0, jsx_runtime_1.jsx)("span", { className: "search-icon", children: "\uD83D\uDD0D" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Buscar t\u00E9rmino, ingrediente...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) })] }), (0, jsx_runtime_1.jsx)("div", { className: "filter-tabs", children: ["Todos", "Ingrediente", "Técnica", "Química", "Teoría"].map((cat) => ((0, jsx_runtime_1.jsx)("button", { className: `tab-btn ${filter === cat ? "active" : ""}`, onClick: () => setFilter(cat), children: cat }, cat))) }), (0, jsx_runtime_1.jsxs)("button", { className: "btn-add-wiki", onClick: handleCreateNew, children: [(0, jsx_runtime_1.jsx)("span", { children: "+" }), " Nueva Entrada"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "wiki-grid", children: filteredItems.map((item) => ((0, jsx_runtime_1.jsxs)("div", { className: "wiki-card", onClick: () => handleCardClick(item), children: [(0, jsx_runtime_1.jsx)("div", { className: "card-icon", children: item.icon }), (0, jsx_runtime_1.jsxs)("div", { className: "card-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "card-top", children: [(0, jsx_runtime_1.jsx)("h4", { children: item.title }), (0, jsx_runtime_1.jsx)("span", { className: `badge-cat ${item.category.toLowerCase()}`, children: item.category })] }), (0, jsx_runtime_1.jsx)("p", { className: "desc-preview", children: item.description })] })] }, item.id))) }), (selectedItem || isCreating) && ((0, jsx_runtime_1.jsx)("div", { className: "wiki-modal-overlay", children: (0, jsx_runtime_1.jsxs)("div", { className: "wiki-modal", children: [(0, jsx_runtime_1.jsx)("button", { className: "close-modal", onClick: () => {
                                setSelectedItem(null);
                                setIsCreating(false);
                            }, children: "\u00D7" }), isEditing || isCreating ? ((0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSave, className: "wiki-form", children: [(0, jsx_runtime_1.jsx)("h3", { children: isCreating ? "Nueva Entrada" : "Editar Entrada" }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { children: "T\u00EDtulo" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: formData.title || "", onChange: (e) => setFormData({ ...formData, title: e.target.value }), required: true })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-row", children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group half", children: [(0, jsx_runtime_1.jsx)("label", { children: "Categor\u00EDa" }), (0, jsx_runtime_1.jsxs)("select", { value: formData.category, onChange: (e) => setFormData({ ...formData, category: e.target.value }), children: [(0, jsx_runtime_1.jsx)("option", { children: "Ingrediente" }), (0, jsx_runtime_1.jsx)("option", { children: "T\u00E9cnica" }), (0, jsx_runtime_1.jsx)("option", { children: "Qu\u00EDmica" }), (0, jsx_runtime_1.jsx)("option", { children: "Teor\u00EDa" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group half", children: [(0, jsx_runtime_1.jsx)("label", { children: "Icono (Emoji)" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: formData.icon || "", onChange: (e) => setFormData({ ...formData, icon: e.target.value }), maxLength: 2 })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { children: "Descripci\u00F3n" }), (0, jsx_runtime_1.jsx)("textarea", { rows: 3, value: formData.description || "", onChange: (e) => setFormData({ ...formData, description: e.target.value }), required: true })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { children: "Mis Notas / Detalles" }), (0, jsx_runtime_1.jsx)("textarea", { rows: 2, placeholder: "A\u00F1ade tus trucos aqu\u00ED...", value: formData.userNotes || "", onChange: (e) => setFormData({ ...formData, userNotes: e.target.value }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "modal-actions", children: [!isCreating && ((0, jsx_runtime_1.jsx)("button", { type: "button", className: "btn-delete", onClick: handleDelete, children: "Borrar" })), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "btn-save", children: "Guardar" })] })] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "wiki-detail", children: [(0, jsx_runtime_1.jsxs)("div", { className: "detail-header", children: [(0, jsx_runtime_1.jsx)("div", { className: "big-icon", children: selectedItem?.icon }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { children: selectedItem?.title }), (0, jsx_runtime_1.jsx)("span", { className: `badge-cat large ${selectedItem?.category.toLowerCase()}`, children: selectedItem?.category })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "detail-body", children: [(0, jsx_runtime_1.jsx)("p", { className: "main-desc", children: selectedItem?.description }), selectedItem?.pairings && ((0, jsx_runtime_1.jsxs)("div", { className: "detail-row", children: [(0, jsx_runtime_1.jsx)("strong", { children: "\uD83E\uDD1D Maridaje:" }), " ", selectedItem.pairings] })), selectedItem?.difficulty && ((0, jsx_runtime_1.jsxs)("div", { className: "detail-row", children: [(0, jsx_runtime_1.jsx)("strong", { children: "\u26A1 Dificultad:" }), " ", selectedItem.difficulty] })), selectedItem?.userNotes && ((0, jsx_runtime_1.jsxs)("div", { className: "user-notes-box", children: [(0, jsx_runtime_1.jsx)("strong", { children: "\uD83D\uDCDD Mis Notas:" }), (0, jsx_runtime_1.jsx)("p", { children: selectedItem.userNotes })] }))] }), (0, jsx_runtime_1.jsx)("div", { className: "modal-actions right", children: (0, jsx_runtime_1.jsx)("button", { className: "btn-edit", onClick: () => {
                                            setIsEditing(true);
                                            setFormData(selectedItem);
                                        }, children: "\u270F\uFE0F Editar / A\u00F1adir Notas" }) })] }))] }) }))] }));
};
exports.default = EnciclopediaView;
