import React, { useState, useEffect } from "react";
import "./Enciclopedia.css";

interface WikiItem {
  id: number;
  title: string;
  category: string;
  description: string;
  pairings?: string;
  difficulty?: string;
  icon: string;
  userNotes?: string;
}

const EnciclopediaView: React.FC = () => {
  const [items, setItems] = useState<WikiItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("Todos");

  const [selectedItem, setSelectedItem] = useState<WikiItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<WikiItem>>({});

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/encyclopedia");
      if (response.ok) {
        const data = await response.json();

        setItems(data.length > 0 ? data : []);
      }
    } catch (error) {
      console.error("Error cargando enciclopedia:", error);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    if (!selectedItem) return;
    if (!window.confirm("¿Borrar esta entrada de la base de datos?")) return;

    try {
      await fetch(`http://localhost:3001/api/encyclopedia/${selectedItem.id}`, {
        method: "DELETE",
      });
      setItems(items.filter((i) => i.id !== selectedItem.id));
      setSelectedItem(null);
      setIsCreating(false);
    } catch (err) {
      alert("Error al borrar.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
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
        if (result.success) setItems([...items, result.item]);
      } else if (selectedItem) {
        // EDITAR (PUT)
        const response = await fetch(
          `http://localhost:3001/api/encyclopedia/${selectedItem.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );
        const result = await response.json();
        if (result.success) {
          setItems(
            items.map((i) => (i.id === selectedItem.id ? result.item : i))
          );
        }
      }
      setSelectedItem(null);
      setIsCreating(false);
      setIsEditing(false);
    } catch (err) {
      alert("Error al guardar en el servidor.");
    }
  };

  const handleCardClick = (item: WikiItem) => {
    setSelectedItem(item);
    setIsEditing(false);
    setIsCreating(false);
    setFormData(item);
  };

  return (
    <div className="enciclopedia-container">
      <header className="view-header">
        <h2>📚 Enciclopedia del Sabor</h2>
        <p>Base de datos de conocimientos culinarios.</p>
      </header>

      <div className="wiki-toolbar">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar término, ingrediente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          {["Todos", "Ingrediente", "Técnica", "Química", "Teoría"].map(
            (cat) => (
              <button
                key={cat}
                className={`tab-btn ${filter === cat ? "active" : ""}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            )
          )}
        </div>

        <button className="btn-add-wiki" onClick={handleCreateNew}>
          <span>+</span> Nueva Entrada
        </button>
      </div>

      <div className="wiki-grid">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="wiki-card"
            onClick={() => handleCardClick(item)}
          >
            <div className="card-icon">{item.icon}</div>
            <div className="card-content">
              <div className="card-top">
                <h4>{item.title}</h4>
                <span className={`badge-cat ${item.category.toLowerCase()}`}>
                  {item.category}
                </span>
              </div>
              <p className="desc-preview">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {(selectedItem || isCreating) && (
        <div className="wiki-modal-overlay">
          <div className="wiki-modal">
            <button
              className="close-modal"
              onClick={() => {
                setSelectedItem(null);
                setIsCreating(false);
              }}
            >
              ×
            </button>

            {isEditing || isCreating ? (
              <form onSubmit={handleSave} className="wiki-form">
                <h3>{isCreating ? "Nueva Entrada" : "Editar Entrada"}</h3>
                <div className="form-group">
                  <label>Título</label>
                  <input
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group half">
                    <label>Categoría</label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    >
                      <option>Ingrediente</option>
                      <option>Técnica</option>
                      <option>Química</option>
                      <option>Teoría</option>
                    </select>
                  </div>
                  <div className="form-group half">
                    <label>Icono (Emoji)</label>
                    <input
                      type="text"
                      value={formData.icon || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, icon: e.target.value })
                      }
                      maxLength={2}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Descripción</label>
                  <textarea
                    rows={3}
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Mis Notas / Detalles</label>
                  <textarea
                    rows={2}
                    placeholder="Añade tus trucos aquí..."
                    value={formData.userNotes || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, userNotes: e.target.value })
                    }
                  />
                </div>
                <div className="modal-actions">
                  {!isCreating && (
                    <button
                      type="button"
                      className="btn-delete"
                      onClick={handleDelete}
                    >
                      Borrar
                    </button>
                  )}
                  <button type="submit" className="btn-save">
                    Guardar
                  </button>
                </div>
              </form>
            ) : (
              <div className="wiki-detail">
                <div className="detail-header">
                  <div className="big-icon">{selectedItem?.icon}</div>
                  <div>
                    <h2>{selectedItem?.title}</h2>
                    <span
                      className={`badge-cat large ${selectedItem?.category.toLowerCase()}`}
                    >
                      {selectedItem?.category}
                    </span>
                  </div>
                </div>
                <div className="detail-body">
                  <p className="main-desc">{selectedItem?.description}</p>
                  {selectedItem?.pairings && (
                    <div className="detail-row">
                      <strong>🤝 Maridaje:</strong> {selectedItem.pairings}
                    </div>
                  )}
                  {selectedItem?.difficulty && (
                    <div className="detail-row">
                      <strong>⚡ Dificultad:</strong> {selectedItem.difficulty}
                    </div>
                  )}
                  {selectedItem?.userNotes && (
                    <div className="user-notes-box">
                      <strong>📝 Mis Notas:</strong>
                      <p>{selectedItem.userNotes}</p>
                    </div>
                  )}
                </div>
                <div className="modal-actions right">
                  <button
                    className="btn-edit"
                    onClick={() => {
                      setIsEditing(true);
                      setFormData(selectedItem!);
                    }}
                  >
                    ✏️ Editar / Añadir Notas
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnciclopediaView;
