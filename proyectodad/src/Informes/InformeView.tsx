import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "./InformeView.css";

interface InformeViewProps {
  currentUser?: string;
}

interface ReportData {
  id: string;
  titulo: string;
  autor: string;
  departamento: string;
  fechaIncidencia: string;
  prioridad: string;
  contenido: string;
  observaciones: string;
}

const InformeView: React.FC<InformeViewProps> = ({
  currentUser = "Invitado",
}) => {
  const [savedReports, setSavedReports] = useState<ReportData[]>([]);

  const [viewState, setViewState] = useState<
    "form" | "previewSingle" | "previewAll"
  >("form");
  const [statusMsg, setStatusMsg] = useState("");

  const [formData, setFormData] = useState<ReportData>({
    id: "",
    titulo: "",
    autor: currentUser,
    departamento: "Cocina",
    fechaIncidencia: new Date().toISOString().split("T")[0],
    prioridad: "Normal",
    contenido: "",
    observaciones: "",
  });

  useEffect(() => {
    fetchReports();
  }, [currentUser]);

  const fetchReports = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/reports?username=${currentUser}`
      );
      if (response.ok) {
        const data = await response.json();
        setSavedReports(data);
      }
    } catch (error) {
      console.error("Error BD");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNew = () => {
    setFormData({
      id: "",
      titulo: "",
      autor: currentUser,
      departamento: "Cocina",
      fechaIncidencia: new Date().toISOString().split("T")[0],
      prioridad: "Normal",
      contenido: "",
      observaciones: "",
    });
    setViewState("form");
    setStatusMsg("✨ Formulario limpio.");
  };

  const goToPreviewSingle = () => {
    if (!formData.titulo) {
      setStatusMsg("⚠️ Escribe un título primero.");
      return;
    }
    setStatusMsg("");
    setViewState("previewSingle");
  };

  const goToPreviewAll = () => {
    if (savedReports.length === 0) {
      setStatusMsg("⚠️ No hay informes guardados para descargar.");
      return;
    }
    setStatusMsg("");
    setViewState("previewAll");
  };

  const handleSaveToDB = async () => {
    if (!formData.titulo) {
      setStatusMsg("⚠️ El título es obligatorio.");
      return;
    }

    const reportAsNew = { ...formData, id: "" };

    try {
      const response = await fetch("http://localhost:3001/api/save-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: currentUser,
          report: reportAsNew,
        }),
      });

      if (response.ok) {
        setStatusMsg("✅ Informe guardado como NUEVA entrada en el historial.");
        fetchReports(); // Refrescamos historial
      } else {
        setStatusMsg("❌ Error al guardar.");
      }
    } catch (error) {
      setStatusMsg("❌ Error de conexión (Backend apagado).");
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("¿Eliminar este informe del historial?")) return;
    try {
      await fetch(`http://localhost:3001/api/reports/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: currentUser }),
      });
      fetchReports();
    } catch (err) {
      console.error(err);
    }
  };

  const loadReport = (report: ReportData) => {
    setFormData(report);
    setViewState("form");
    setStatusMsg(`📂 Cargado (Modo Edición): ${report.titulo}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const generatePDFPage = (
    doc: jsPDF,
    data: ReportData,
    isFirstPage: boolean
  ) => {
    if (!isFirstPage) doc.addPage();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(44, 62, 80);
    doc.text("INFORME OFICIAL - COOKLAB", 105, 20, { align: "center" });
    doc.setLineWidth(0.5);
    doc.setDrawColor(200);
    doc.line(20, 25, 190, 25);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(0);
    let y = 40;

    const addLine = (label: string, value: string) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 20, y);
      doc.setFont("helvetica", "normal");
      doc.text(value, 60, y);
      y += 8;
    };

    addLine("Ref ID:", data.id || "Nuevo");
    addLine("Título:", data.titulo);
    addLine("Autor:", data.autor);
    addLine("Departamento:", data.departamento);
    addLine("Fecha:", data.fechaIncidencia);

    doc.setFont("helvetica", "bold");
    doc.text("Prioridad:", 20, y);
    if (data.prioridad === "Alta") doc.setTextColor(231, 76, 60);
    doc.text(data.prioridad, 60, y);
    doc.setTextColor(0);
    y += 15;

    doc.setFillColor(245, 245, 245);
    doc.rect(20, y - 5, 170, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.text("DETALLE DEL INFORME", 22, y);
    y += 10;

    doc.setFont("helvetica", "normal");
    const splitContent = doc.splitTextToSize(data.contenido, 170);
    doc.text(splitContent, 20, y);
    y += splitContent.length * 5 + 10;

    if (data.observaciones) {
      doc.setFont("helvetica", "bold");
      doc.text("OBSERVACIONES", 20, y);
      y += 6;
      doc.setFont("helvetica", "italic");
      doc.text(doc.splitTextToSize(data.observaciones, 170), 20, y);
    }

    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text(
      `Generado el ${new Date().toLocaleString()} | Usuario: ${currentUser}`,
      20,
      pageHeight - 10
    );
  };

  const handleDownloadSingle = () => {
    const doc = new jsPDF();
    generatePDFPage(doc, formData, true);
    doc.save(`${formData.titulo || "Informe"}.pdf`);
    setStatusMsg("📄 PDF descargado.");
  };

  const handleDownloadAll = () => {
    if (savedReports.length === 0) return;
    const doc = new jsPDF();
    savedReports.forEach((report, index) => {
      generatePDFPage(doc, report, index === 0);
    });
    doc.save(`Historial_Completo_${currentUser}.pdf`);
    setStatusMsg("📚 Historial completo descargado.");
  };

  const PaperPreview = ({ data }: { data: ReportData }) => (
    <div className="inf-paper-preview">
      <div className="paper-header">
        <h3>INFORME OFICIAL - COOKLAB</h3>
        <div className="paper-line"></div>
      </div>
      <div className="paper-meta-grid">
        <div>
          <strong>Título:</strong> {data.titulo}
        </div>
        <div>
          <strong>Autor:</strong> {data.autor}
        </div>
        <div>
          <strong>Depto:</strong> {data.departamento}
        </div>
        <div>
          <strong>Fecha:</strong> {data.fechaIncidencia}
        </div>
        <div>
          <strong>Prioridad:</strong>{" "}
          <span className={data.prioridad === "Alta" ? "text-red" : ""}>
            {data.prioridad}
          </span>
        </div>
      </div>
      <div className="paper-section-title">DETALLE</div>
      <div className="paper-content">{data.contenido || "..."}</div>
      {data.observaciones && (
        <>
          <div className="paper-section-title">OBSERVACIONES</div>
          <div className="paper-obs">{data.observaciones}</div>
        </>
      )}
    </div>
  );

  return (
    <div className="inf-container">
      <div className="inf-header">
        <h2>Gestión de Informes</h2>
        <p>
          Usuario: <strong>{currentUser}</strong>
        </p>
      </div>

      {statusMsg && <div className="inf-status-bar">{statusMsg}</div>}

      {viewState === "form" && (
        <>
          <div className="inf-card fade-in">
            <div className="inf-toolbar">
              <button onClick={handleNew} className="inf-btn-secondary">
                Limpiar
              </button>
              <button onClick={handleSaveToDB} className="inf-btn-save">
                💾 Guardar Nuevo
              </button>
            </div>

            <div className="inf-grid">
              <div className="inf-input-group inf-full-width">
                <label>Título</label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  placeholder="Ej: Reporte..."
                />
              </div>
              <div className="inf-input-group">
                <label>Departamento</label>
                <select
                  name="departamento"
                  value={formData.departamento}
                  onChange={handleChange}
                >
                  <option>Cocina</option>
                  <option>Pastelería</option>
                  <option>Logística</option>
                  <option>Dirección</option>
                </select>
              </div>
              <div className="inf-input-group">
                <label>Fecha</label>
                <input
                  type="date"
                  name="fechaIncidencia"
                  value={formData.fechaIncidencia}
                  onChange={handleChange}
                />
              </div>
              <div className="inf-input-group">
                <label>Prioridad</label>
                <select
                  name="prioridad"
                  value={formData.prioridad}
                  onChange={handleChange}
                >
                  <option>Baja</option>
                  <option>Normal</option>
                  <option>Alta</option>
                </select>
              </div>
              <div className="inf-input-group inf-full-width">
                <label>Contenido</label>
                <textarea
                  name="contenido"
                  value={formData.contenido}
                  onChange={handleChange}
                  placeholder="Detalles..."
                />
              </div>
              <div className="inf-input-group inf-full-width">
                <label>Observaciones</label>
                <input
                  type="text"
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button className="inf-btn-primary" onClick={goToPreviewSingle}>
              👁️ Ver Vista Previa Actual
            </button>
          </div>

          <div className="inf-history-section">
            <div className="history-header">
              <h3>📂 Historial ({savedReports.length})</h3>
              {savedReports.length > 0 && (
                <button
                  onClick={goToPreviewAll}
                  className="inf-btn-download-all"
                >
                  📚 Vista Previa y Descargar TODO
                </button>
              )}
            </div>

            <div className="inf-history-grid">
              {savedReports.map((rep) => (
                <div
                  key={rep.id}
                  className="inf-history-card"
                  onClick={() => loadReport(rep)}
                >
                  <div className="card-top">
                    <h4>{rep.titulo}</h4>
                    <button
                      onClick={(e) => handleDelete(rep.id, e)}
                      className="btn-delete"
                      title="Eliminar"
                    >
                      ×
                    </button>
                  </div>
                  <div className="card-meta">
                    <span>{rep.fechaIncidencia}</span>
                    <span className={`tag ${rep.prioridad.toLowerCase()}`}>
                      {rep.prioridad}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {viewState === "previewSingle" && (
        <div className="inf-preview-container fade-in">
          <div className="inf-actions-bar sticky-top">
            <button
              onClick={() => setViewState("form")}
              className="inf-btn-secondary"
            >
              ✏️ Seguir Editando
            </button>
            <div className="right-actions">
              <button onClick={handleSaveToDB} className="inf-btn-save">
                💾 Guardar Nuevo
              </button>
              <button
                onClick={handleDownloadSingle}
                className="inf-btn-download"
              >
                ✅ Descargar PDF
              </button>
            </div>
          </div>
          <PaperPreview data={formData} />
        </div>
      )}
      {viewState === "previewAll" && (
        <div className="inf-preview-container fade-in">
          <div className="inf-actions-bar sticky-top">
            <button
              onClick={() => setViewState("form")}
              className="inf-btn-secondary"
            >
              🔙 Volver
            </button>
            <div
              style={{ textAlign: "center", fontWeight: "bold", color: "#555" }}
            >
              Vista Previa Historial Completo ({savedReports.length})
            </div>
            <button
              onClick={handleDownloadAll}
              className="inf-btn-download-all"
            >
              📥 Descargar PDF Unificado
            </button>
          </div>

          <div className="inf-scroll-preview">
            {savedReports.map((rep, index) => (
              <div key={rep.id} style={{ marginBottom: "40px" }}>
                <div className="page-indicator">
                  Informe {index + 1} de {savedReports.length}
                </div>
                <PaperPreview data={rep} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InformeView;
