"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const jspdf_1 = require("jspdf");
require("./InformeView.css");
const InformeView = ({ currentUser = "Invitado", }) => {
    const [savedReports, setSavedReports] = (0, react_1.useState)([]);
    // Estados de vista: formulario, vista previa individual, vista previa global
    const [viewState, setViewState] = (0, react_1.useState)("form");
    const [statusMsg, setStatusMsg] = (0, react_1.useState)("");
    const [formData, setFormData] = (0, react_1.useState)({
        id: "",
        titulo: "",
        autor: currentUser,
        departamento: "Cocina",
        fechaIncidencia: new Date().toISOString().split("T")[0],
        prioridad: "Normal",
        contenido: "",
        observaciones: "",
    });
    // --- 1. CARGA INICIAL DE DATOS ---
    (0, react_1.useEffect)(() => {
        fetchReports();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);
    const fetchReports = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/reports?username=${currentUser}`);
            if (response.ok) {
                const data = await response.json();
                setSavedReports(data);
            }
        }
        catch (error) {
            console.error("Error BD");
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    // --- NAVEGACIÓN Y LIMPIEZA ---
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
    // --- 2. GUARDAR (CREA NUEVO REGISTRO SIEMPRE) ---
    const handleSaveToDB = async () => {
        if (!formData.titulo) {
            setStatusMsg("⚠️ El título es obligatorio.");
            return;
        }
        // Al eliminar el ID, forzamos al backend a crear uno nuevo
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
            }
            else {
                setStatusMsg("❌ Error al guardar.");
            }
        }
        catch (error) {
            setStatusMsg("❌ Error de conexión (Backend apagado).");
        }
    };
    // Borrar informe
    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm("¿Eliminar este informe del historial?"))
            return;
        try {
            await fetch(`http://localhost:3001/api/reports/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: currentUser }),
            });
            fetchReports();
        }
        catch (err) {
            console.error(err);
        }
    };
    // Cargar para editar (copia los datos al formulario)
    const loadReport = (report) => {
        setFormData(report);
        setViewState("form");
        setStatusMsg(`📂 Cargado (Modo Edición): ${report.titulo}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    // --- 3. GENERADOR PDF ---
    const generatePDFPage = (doc, data, isFirstPage) => {
        if (!isFirstPage)
            doc.addPage();
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
        const addLine = (label, value) => {
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
        if (data.prioridad === "Alta")
            doc.setTextColor(231, 76, 60);
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
        doc.text(`Generado el ${new Date().toLocaleString()} | Usuario: ${currentUser}`, 20, pageHeight - 10);
    };
    const handleDownloadSingle = () => {
        const doc = new jspdf_1.jsPDF();
        generatePDFPage(doc, formData, true);
        doc.save(`${formData.titulo || "Informe"}.pdf`);
        setStatusMsg("📄 PDF descargado.");
    };
    const handleDownloadAll = () => {
        if (savedReports.length === 0)
            return;
        const doc = new jspdf_1.jsPDF();
        savedReports.forEach((report, index) => {
            generatePDFPage(doc, report, index === 0);
        });
        doc.save(`Historial_Completo_${currentUser}.pdf`);
        setStatusMsg("📚 Historial completo descargado.");
    };
    // --- VISTA PREVIA PAPEL (COMPONENTE UI) ---
    const PaperPreview = ({ data }) => ((0, jsx_runtime_1.jsxs)("div", { className: "inf-paper-preview", children: [(0, jsx_runtime_1.jsxs)("div", { className: "paper-header", children: [(0, jsx_runtime_1.jsx)("h3", { children: "INFORME OFICIAL - COOKLAB" }), (0, jsx_runtime_1.jsx)("div", { className: "paper-line" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "paper-meta-grid", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "T\u00EDtulo:" }), " ", data.titulo] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Autor:" }), " ", data.autor] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Depto:" }), " ", data.departamento] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Fecha:" }), " ", data.fechaIncidencia] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Prioridad:" }), " ", (0, jsx_runtime_1.jsx)("span", { className: data.prioridad === "Alta" ? "text-red" : "", children: data.prioridad })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "paper-section-title", children: "DETALLE" }), (0, jsx_runtime_1.jsx)("div", { className: "paper-content", children: data.contenido || "..." }), data.observaciones && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "paper-section-title", children: "OBSERVACIONES" }), (0, jsx_runtime_1.jsx)("div", { className: "paper-obs", children: data.observaciones })] }))] }));
    return ((0, jsx_runtime_1.jsxs)("div", { className: "inf-container", children: [(0, jsx_runtime_1.jsxs)("div", { className: "inf-header", children: [(0, jsx_runtime_1.jsx)("h2", { children: "Gesti\u00F3n de Informes" }), (0, jsx_runtime_1.jsxs)("p", { children: ["Usuario: ", (0, jsx_runtime_1.jsx)("strong", { children: currentUser })] })] }), statusMsg && (0, jsx_runtime_1.jsx)("div", { className: "inf-status-bar", children: statusMsg }), viewState === "form" && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "inf-card fade-in", children: [(0, jsx_runtime_1.jsxs)("div", { className: "inf-toolbar", children: [(0, jsx_runtime_1.jsx)("button", { onClick: handleNew, className: "inf-btn-secondary", children: "Limpiar" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleSaveToDB, className: "inf-btn-save", children: "\uD83D\uDCBE Guardar Nuevo" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "inf-grid", children: [(0, jsx_runtime_1.jsxs)("div", { className: "inf-input-group inf-full-width", children: [(0, jsx_runtime_1.jsx)("label", { children: "T\u00EDtulo" }), (0, jsx_runtime_1.jsx)("input", { type: "text", name: "titulo", value: formData.titulo, onChange: handleChange, placeholder: "Ej: Reporte..." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "inf-input-group", children: [(0, jsx_runtime_1.jsx)("label", { children: "Departamento" }), (0, jsx_runtime_1.jsxs)("select", { name: "departamento", value: formData.departamento, onChange: handleChange, children: [(0, jsx_runtime_1.jsx)("option", { children: "Cocina" }), (0, jsx_runtime_1.jsx)("option", { children: "Pasteler\u00EDa" }), (0, jsx_runtime_1.jsx)("option", { children: "Log\u00EDstica" }), (0, jsx_runtime_1.jsx)("option", { children: "Direcci\u00F3n" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "inf-input-group", children: [(0, jsx_runtime_1.jsx)("label", { children: "Fecha" }), (0, jsx_runtime_1.jsx)("input", { type: "date", name: "fechaIncidencia", value: formData.fechaIncidencia, onChange: handleChange })] }), (0, jsx_runtime_1.jsxs)("div", { className: "inf-input-group", children: [(0, jsx_runtime_1.jsx)("label", { children: "Prioridad" }), (0, jsx_runtime_1.jsxs)("select", { name: "prioridad", value: formData.prioridad, onChange: handleChange, children: [(0, jsx_runtime_1.jsx)("option", { children: "Baja" }), (0, jsx_runtime_1.jsx)("option", { children: "Normal" }), (0, jsx_runtime_1.jsx)("option", { children: "Alta" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "inf-input-group inf-full-width", children: [(0, jsx_runtime_1.jsx)("label", { children: "Contenido" }), (0, jsx_runtime_1.jsx)("textarea", { name: "contenido", value: formData.contenido, onChange: handleChange, placeholder: "Detalles..." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "inf-input-group inf-full-width", children: [(0, jsx_runtime_1.jsx)("label", { children: "Observaciones" }), (0, jsx_runtime_1.jsx)("input", { type: "text", name: "observaciones", value: formData.observaciones, onChange: handleChange })] })] }), (0, jsx_runtime_1.jsx)("button", { className: "inf-btn-primary", onClick: goToPreviewSingle, children: "\uD83D\uDC41\uFE0F Ver Vista Previa Actual" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "inf-history-section", children: [(0, jsx_runtime_1.jsxs)("div", { className: "history-header", children: [(0, jsx_runtime_1.jsxs)("h3", { children: ["\uD83D\uDCC2 Historial (", savedReports.length, ")"] }), savedReports.length > 0 && ((0, jsx_runtime_1.jsx)("button", { onClick: goToPreviewAll, className: "inf-btn-download-all", children: "\uD83D\uDCDA Vista Previa y Descargar TODO" }))] }), (0, jsx_runtime_1.jsx)("div", { className: "inf-history-grid", children: savedReports.map((rep) => ((0, jsx_runtime_1.jsxs)("div", { className: "inf-history-card", onClick: () => loadReport(rep), children: [(0, jsx_runtime_1.jsxs)("div", { className: "card-top", children: [(0, jsx_runtime_1.jsx)("h4", { children: rep.titulo }), (0, jsx_runtime_1.jsx)("button", { onClick: (e) => handleDelete(rep.id, e), className: "btn-delete", title: "Eliminar", children: "\u00D7" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "card-meta", children: [(0, jsx_runtime_1.jsx)("span", { children: rep.fechaIncidencia }), (0, jsx_runtime_1.jsx)("span", { className: `tag ${rep.prioridad.toLowerCase()}`, children: rep.prioridad })] })] }, rep.id))) })] })] })), viewState === "previewSingle" && ((0, jsx_runtime_1.jsxs)("div", { className: "inf-preview-container fade-in", children: [(0, jsx_runtime_1.jsxs)("div", { className: "inf-actions-bar sticky-top", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setViewState("form"), className: "inf-btn-secondary", children: "\u270F\uFE0F Seguir Editando" }), (0, jsx_runtime_1.jsxs)("div", { className: "right-actions", children: [(0, jsx_runtime_1.jsx)("button", { onClick: handleSaveToDB, className: "inf-btn-save", children: "\uD83D\uDCBE Guardar Nuevo" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleDownloadSingle, className: "inf-btn-download", children: "\u2705 Descargar PDF" })] })] }), (0, jsx_runtime_1.jsx)(PaperPreview, { data: formData })] })), viewState === "previewAll" && ((0, jsx_runtime_1.jsxs)("div", { className: "inf-preview-container fade-in", children: [(0, jsx_runtime_1.jsxs)("div", { className: "inf-actions-bar sticky-top", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setViewState("form"), className: "inf-btn-secondary", children: "\uD83D\uDD19 Volver" }), (0, jsx_runtime_1.jsxs)("div", { style: { textAlign: "center", fontWeight: "bold", color: "#555" }, children: ["Vista Previa Historial Completo (", savedReports.length, ")"] }), (0, jsx_runtime_1.jsx)("button", { onClick: handleDownloadAll, className: "inf-btn-download-all", children: "\uD83D\uDCE5 Descargar PDF Unificado" })] }), (0, jsx_runtime_1.jsx)("div", { className: "inf-scroll-preview", children: savedReports.map((rep, index) => ((0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: "40px" }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "page-indicator", children: ["Informe ", index + 1, " de ", savedReports.length] }), (0, jsx_runtime_1.jsx)(PaperPreview, { data: rep })] }, rep.id))) })] }))] }));
};
exports.default = InformeView;
