import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import "../styles/DashboardInvestigador.css";

ChartJS.register(
  CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend
);

import API_URL from "../api";
const API = `${API_URL}/api`;

function authHeader() {
  return { Authorization: `Bearer ${localStorage.getItem("token")}` };
}

const MODELOS = [
  { value: "cnn",          label: "CNN (Convolutional Neural Network)" },
  { value: "resnet",       label: "ResNet-50"                          },
  { value: "mobilenet",    label: "MobileNetV2"                        },
  { value: "vgg",          label: "VGG-16"                             },
  { value: "efficientnet", label: "EfficientNet-B0"                    },
];

const FORM_INICIAL = {
  id_dataset: "", modelo: "cnn", epochs: 10,
  batch_size: 32, learning_rate: 0.001, modo: "local",
};

function DashboardInvestigador({ seccion }) {

  const [stats,      setStats]      = useState([]);
  const [datasets,   setDatasets]   = useState([]);
  const [form,       setForm]       = useState(FORM_INICIAL);
  const [entrenando, setEntrenando] = useState(false);
  const [jobId,      setJobId]      = useState(null);
  const [logs,       setLogs]       = useState([]);
  const [progreso,   setProgreso]   = useState(0);
  const [modelos,    setModelos]    = useState([]);
  const logsRef = useRef(null);

  useEffect(() => { fetchStats(); fetchDatasets(); fetchModelos(); }, []);
  useEffect(() => {
    if (logsRef.current)
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
  }, [logs]);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/investigador/stats`, { headers: authHeader() });
      setStats(res.data);
    } catch (e) { console.log(e); }
  };

  const fetchDatasets = async () => {
    try {
      const res = await axios.get(`${API}/datasets`, { headers: authHeader() });
      setDatasets(res.data);
      if (res.data.length > 0)
        setForm((f) => ({ ...f, id_dataset: res.data[0].id_dataset }));
    } catch (e) { console.log(e); }
  };

  const fetchModelos = async () => {
    try {
      const res = await axios.get(`${API}/models`, { headers: authHeader() });
      setModelos(res.data);
    } catch (e) { console.log(e); }
  };

  const lanzarEntrenamiento = async () => {
    if (!form.id_dataset) { alert("Selecciona un dataset"); return; }
    setEntrenando(true); setLogs([]); setProgreso(0);
    const addLog = (msg) =>
      setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    try {
      addLog(`Iniciando — modelo: ${form.modelo}, modo: ${form.modo}`);
      addLog(`Dataset ID: ${form.id_dataset} | Epochs: ${form.epochs} | Batch: ${form.batch_size} | LR: ${form.learning_rate}`);
      const res = await axios.post(`${API}/models/train`, form, { headers: authHeader() });
      setJobId(res.data.job_id ?? null);
      addLog("Solicitud enviada al servidor.");
      let p = 0;
      const intervalo = setInterval(() => {
        p += Math.floor(Math.random() * 8) + 3;
        if (p >= 95) { clearInterval(intervalo); p = 95; }
        setProgreso(p);
        addLog(`Época ${Math.ceil((p / 100) * form.epochs)}/${form.epochs}...`);
      }, 1200);
      if (res.data.metricas) {
        clearInterval(intervalo);
        setProgreso(100);
        addLog("¡Entrenamiento completado!");
        fetchStats(); fetchModelos();
      }
    } catch (e) {
      addLog(`Error: ${e.response?.data?.error ?? e.message}`);
    } finally { setEntrenando(false); }
  };

  const cancelarEntrenamiento = () => {
    setEntrenando(false); setProgreso(0);
    setLogs((p) => [...p, `[${new Date().toLocaleTimeString()}] ⚠️ Cancelado.`]);
  };

  const epochs    = stats.map((_, i) => `Época ${i + 1}`);
  const lossTrain = stats.map((d) => Number(d.loss_train));
  const lossVal   = stats.map((d) => Number(d.loss_val));
  const accuracy  = stats.map((d) => Number(d.accuracy));
  const precision = stats.map((d) => Number(d.precision_));
  const recall    = stats.map((d) => Number(d.recall));
  const f1        = stats.map((d) => Number(d.f1_score));
  const chartOpts = { responsive: true, plugins: { legend: { position: "top" } } };
  const avg = (arr) => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(3) : "—";

  return (
    <div className="di-wrapper">

      {/* ══ INICIO ══ */}
      {seccion === "inicio" && (
        <div className="di-section">
          <h2 className="di-title">Dashboard del Investigador 🔬</h2>
          <div className="di-cards">
            <div className="di-card di-card-green"><p className="di-card-num">{avg(accuracy)}</p><p className="di-card-label">Accuracy promedio</p></div>
            <div className="di-card di-card-blue"><p className="di-card-num">{avg(lossTrain)}</p><p className="di-card-label">Loss Train promedio</p></div>
            <div className="di-card di-card-teal"><p className="di-card-num">{avg(lossVal)}</p><p className="di-card-label">Loss Val promedio</p></div>
            <div className="di-card di-card-sand"><p className="di-card-num">{avg(f1)}</p><p className="di-card-label">F1-Score promedio</p></div>
          </div>
          <div className="di-charts">
            <div className="di-chart-box">
              <h3>Loss — entrenamiento vs validación</h3>
              <Line options={chartOpts} data={{ labels: epochs, datasets: [
                { label: "Loss Train", data: lossTrain, borderColor: "#1f4d3a", tension: 0.3 },
                { label: "Loss Val",   data: lossVal,   borderColor: "#006699", tension: 0.3 },
              ]}} />
            </div>
            <div className="di-chart-box">
              <h3>Accuracy por época</h3>
              <Line options={chartOpts} data={{ labels: epochs, datasets: [
                { label: "Accuracy", data: accuracy, borderColor: "#79c8c0", backgroundColor: "rgba(121,200,192,0.1)", fill: true, tension: 0.3 },
              ]}} />
            </div>
            <div className="di-chart-box di-chart-full">
              <h3>Precision / Recall / F1-Score por época</h3>
              <Bar options={chartOpts} data={{ labels: epochs, datasets: [
                { label: "Precision", data: precision, backgroundColor: "#1f4d3a" },
                { label: "Recall",    data: recall,    backgroundColor: "#006699" },
                { label: "F1-Score",  data: f1,        backgroundColor: "#79c8c0" },
              ]}} />
            </div>
          </div>
        </div>
      )}

      {/* ══ MODELOS ══ */}
      {seccion === "modelos" && (
        <div className="di-section">
          <h2 className="di-title">Entrenamiento de modelos</h2>
          <div className="di-train-layout">
            <div className="di-form-box">
              <h3>⚙️ Configurar hiperparámetros</h3>
              <div className="di-field">
                <label>Dataset</label>
                <select className="di-select" value={form.id_dataset} onChange={(e) => setForm({ ...form, id_dataset: e.target.value })} disabled={entrenando}>
                  {datasets.length === 0 ? <option>— Sin datasets —</option>
                    : datasets.map((d) => <option key={d.id_dataset} value={d.id_dataset}>{d.nombre}</option>)}
                </select>
              </div>
              <div className="di-field">
                <label>Arquitectura del modelo</label>
                <select className="di-select" value={form.modelo} onChange={(e) => setForm({ ...form, modelo: e.target.value })} disabled={entrenando}>
                  {MODELOS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
              <div className="di-field">
                <label>Modo de cómputo</label>
                <div className="di-radio-group">
                  {["local", "distribuido"].map((modo) => (
                    <label key={modo} className={`di-radio-btn ${form.modo === modo ? "active" : ""}`}>
                      <input type="radio" name="modo" value={modo} checked={form.modo === modo}
                        onChange={(e) => setForm({ ...form, modo: e.target.value })} disabled={entrenando} style={{ display: "none" }} />
                      {modo === "local" ? "🖥 Local" : "🌐 Distribuido"}
                    </label>
                  ))}
                </div>
              </div>
              <div className="di-fields-row">
                <div className="di-field">
                  <label>Epochs</label>
                  <input type="number" min={1} max={500} className="di-input" value={form.epochs}
                    onChange={(e) => setForm({ ...form, epochs: Number(e.target.value) })} disabled={entrenando} />
                </div>
                <div className="di-field">
                  <label>Batch Size</label>
                  <select className="di-select" value={form.batch_size} onChange={(e) => setForm({ ...form, batch_size: Number(e.target.value) })} disabled={entrenando}>
                    {[8, 16, 32, 64, 128].map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="di-field">
                  <label>Learning Rate</label>
                  <select className="di-select" value={form.learning_rate} onChange={(e) => setForm({ ...form, learning_rate: Number(e.target.value) })} disabled={entrenando}>
                    {[0.1, 0.01, 0.001, 0.0001].map((lr) => <option key={lr} value={lr}>{lr}</option>)}
                  </select>
                </div>
              </div>
              <div className="di-config-summary">
                <span>🧠 {MODELOS.find(m => m.value === form.modelo)?.label}</span>
                <span>📦 {datasets.find(d => d.id_dataset == form.id_dataset)?.nombre ?? "—"}</span>
                <span>🔁 {form.epochs} épocas</span>
                <span>📐 Batch {form.batch_size}</span>
                <span>📉 LR {form.learning_rate}</span>
                <span>{form.modo === "local" ? "🖥 Local" : "🌐 Distribuido"}</span>
              </div>
              <div className="di-btn-row">
                <button className={`di-btn-train ${entrenando ? "di-btn-cancel" : ""}`}
                  onClick={entrenando ? cancelarEntrenamiento : lanzarEntrenamiento}>
                  {entrenando ? "⏹ Cancelar" : "▶ Iniciar entrenamiento"}
                </button>
                <button className="di-btn-reset"
                  onClick={() => { setForm(FORM_INICIAL); setLogs([]); setProgreso(0); }} disabled={entrenando}>
                  Restablecer
                </button>
              </div>
            </div>
            <div className="di-logs-box">
              <h3>📋 Progreso</h3>
              <div className="di-progress-wrap">
                <div className="di-progress-bar" style={{ width: `${progreso}%`, background: progreso === 100 ? "#1f4d3a" : "#006699" }} />
              </div>
              <p className="di-progress-label">
                {progreso === 0 && !entrenando && "Sin entrenar"}
                {progreso > 0 && progreso < 100 && `${progreso}% — entrenando...`}
                {progreso === 100 && "✅ Completado"}
              </p>
              <div className="di-logs" ref={logsRef}>
                {logs.length === 0
                  ? <span className="di-logs-empty">Los logs aparecerán aquí al iniciar.</span>
                  : logs.map((l, i) => <div key={i} className="di-log-line">{l}</div>)}
              </div>
              {jobId && <p className="di-job-id">Job ID: <code>{jobId}</code></p>}
            </div>
          </div>
          <div className="di-historial">
            <h3>🗃 Historial de modelos entrenados</h3>
            {modelos.length === 0 ? <p className="di-empty">Aún no hay modelos entrenados.</p> : (
              <div className="di-table-wrap">
                <table className="di-table">
                  <thead><tr><th>#</th><th>Modelo</th><th>Dataset</th><th>Epochs</th><th>Accuracy</th><th>F1</th><th>Modo</th><th>Fecha</th></tr></thead>
                  <tbody>
                    {modelos.map((m) => (
                      <tr key={m.id_modelo ?? m.id}>
                        <td>{m.id_modelo ?? m.id}</td>
                        <td><span className="di-modelo-badge">{m.modelo ?? m.nombre}</span></td>
                        <td>{m.dataset ?? m.id_dataset}</td>
                        <td>{m.epocas ?? m.epochs}</td>
                        <td>{m.accuracy ? Number(m.accuracy).toFixed(3) : "—"}</td>
                        <td>{m.f1_score ? Number(m.f1_score).toFixed(3) : "—"}</td>
                        <td>{m.modo ?? "local"}</td>
                        <td>{m.created_at ? new Date(m.created_at).toLocaleDateString() : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ DATASETS ══ */}
      {seccion === "datasets" && (
        <div className="di-section">
          <h2 className="di-title">Mis datasets 📊</h2>
          <DatasetsInvestigador datasets={datasets} onActualizar={fetchDatasets} />
        </div>
      )}

      {/* ══ IMÁGENES ══ */}
      {seccion === "imagenes" && (
        <div className="di-section">
          <h2 className="di-title">Imágenes biológicas 🖼️</h2>
          <ImagenesInvestigador datasets={datasets} />
        </div>
      )}

      {/* ══ CLUSTER ══ */}
      {seccion === "cluster" && (
        <div className="di-section">
          <h2 className="di-title">Monitor del Cluster</h2>
          <div className="di-info-box"><p>Accede al panel externo del cluster desde aquí.</p></div>
          <a href="https://nonobsessional-flynn-unrecognizing.ngrok-free.dev/"
            target="_blank" rel="noopener noreferrer" className="di-btn-cluster">
            🖥 Abrir panel del Cluster
          </a>
          <div className="di-cluster-frame-wrap">
            <iframe src="https://nonobsessional-flynn-unrecognizing.ngrok-free.dev/" title="Cluster" className="di-cluster-frame" />
          </div>
        </div>
      )}

    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// Sub-componente: Datasets (crear + ver)
// ══════════════════════════════════════════════════════════════
function DatasetsInvestigador({ datasets, onActualizar }) {
  const [form,       setForm]       = useState({ nombre: "", descripcion: "" });
  const [guardando,  setGuardando]  = useState(false);
  const [editando,   setEditando]   = useState(null); // { id, nombre, descripcion }

  const crear = async () => {
    if (!form.nombre) { alert("El nombre es obligatorio"); return; }
    try {
      setGuardando(true);
      await axios.post(`${API}/datasets`, form, { headers: authHeader() });
      setForm({ nombre: "", descripcion: "" });
      onActualizar();
    } catch { alert("Error al crear dataset"); }
    finally { setGuardando(false); }
  };

  const guardarEdicion = async () => {
    if (!editando.nombre) { alert("El nombre es obligatorio"); return; }
    try {
      await axios.put(`${API}/datasets/${editando.id}`,
        { nombre: editando.nombre, descripcion: editando.descripcion },
        { headers: authHeader() });
      setEditando(null);
      onActualizar();
    } catch { alert("Error al editar dataset"); }
  };

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar este dataset?")) return;
    try {
      await axios.delete(`${API}/datasets/${id}`, { headers: authHeader() });
      onActualizar();
    } catch { alert("Error al eliminar"); }
  };

  return (
    <>
      {/* Modal editar */}
      {editando && (
        <div className="di-modal-overlay">
          <div className="di-modal">
            <h3>✏️ Editar dataset</h3>
            <input className="di-input di-input-full" placeholder="Nombre"
              value={editando.nombre}
              onChange={(e) => setEditando({ ...editando, nombre: e.target.value })} />
            <input className="di-input di-input-full" placeholder="Descripción"
              value={editando.descripcion || ""}
              onChange={(e) => setEditando({ ...editando, descripcion: e.target.value })} />
            <div className="di-modal-btns">
              <button className="di-btn-primary-sm" onClick={guardarEdicion}>Guardar</button>
              <button className="di-btn-ghost-sm"   onClick={() => setEditando(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Formulario crear */}
      <div className="di-form-box" style={{ marginBottom: 28 }}>
        <h3>➕ Crear nuevo dataset</h3>
        <div className="di-form-row">
          <input className="di-input di-input-grow" placeholder="Nombre del dataset"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          <input className="di-input di-input-grow" placeholder="Descripción (opcional)"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
          <button className="di-btn-primary-sm" onClick={crear} disabled={guardando}>
            {guardando ? "Guardando..." : "Crear"}
          </button>
        </div>
      </div>

      {/* Grid datasets */}
      <div className="di-dataset-grid">
        {datasets.length === 0 && <p className="di-empty">Aún no hay datasets. ¡Crea el primero!</p>}
        {datasets.map((d) => (
          <div className="di-dataset-card" key={d.id_dataset}>
            <div className="di-dataset-img-wrap">
              {d.imagen
                ? <img src={`${API_URL}/uploads/${d.imagen}`} alt={d.nombre} />
                : <div className="di-dataset-no-img">🔬</div>}
            </div>
            <div className="di-dataset-body">
              <p className="di-dataset-name">{d.nombre}</p>
              <p className="di-dataset-desc">{d.descripcion || "Sin descripción"}</p>
              <div className="di-card-actions">
                <button className="di-btn-edit-sm"
                  onClick={() => setEditando({ id: d.id_dataset, nombre: d.nombre, descripcion: d.descripcion })}>
                  ✏️ Editar
                </button>
                <button className="di-btn-danger-sm" onClick={() => eliminar(d.id_dataset)}>
                  🗑 Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════
// Sub-componente: Imágenes (subir + galería + filtros)
// ══════════════════════════════════════════════════════════════
function ImagenesInvestigador({ datasets }) {
  const [imagenes,    setImagenes]    = useState([]);
  const [filtroDs,    setFiltroDs]    = useState("todos");
  const [seleccion,   setSeleccion]   = useState(null);
  const [archivo,     setArchivo]     = useState(null);
  const [idDataset,   setIdDataset]   = useState("");
  const [subiendo,    setSubiendo]    = useState(false);
  const [editandoImg, setEditandoImg] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    fetchImagenes();
    if (datasets.length > 0) setIdDataset(datasets[0].id_dataset);
  }, [datasets]);

  const fetchImagenes = async () => {
    try {
      const res = await axios.get(`${API}/images`, { headers: authHeader() });
      setImagenes(res.data);
    } catch (e) { console.log(e); }
  };

  const subirImagen = async () => {
    if (!archivo)   { alert("Selecciona una imagen"); return; }
    if (!idDataset) { alert("Selecciona un dataset"); return; }
    const formData = new FormData();
    formData.append("imagen",     archivo);
    formData.append("id_dataset", idDataset);
    try {
      setSubiendo(true);
      await axios.post(`${API}/images`, formData, {
        headers: { ...authHeader(), "Content-Type": "multipart/form-data" },
      });
      setArchivo(null);
      if (fileRef.current) fileRef.current.value = "";
      fetchImagenes();
    } catch { alert("Error al subir imagen"); }
    finally { setSubiendo(false); }
  };

  const guardarEdicionImg = async () => {
    try {
      await axios.put(`${API}/images/${editandoImg.id}`,
        { id_dataset: editandoImg.id_dataset },
        { headers: authHeader() });
      setEditandoImg(null);
      fetchImagenes();
    } catch { alert("Error al editar imagen"); }
  };

  const eliminarImagen = async (id) => {
    if (!confirm("¿Eliminar esta imagen?")) return;
    try {
      await axios.delete(`${API}/images/${id}`, { headers: authHeader() });
      fetchImagenes();
    } catch { alert("Error al eliminar"); }
  };

  const filtradas = filtroDs === "todos"
    ? imagenes
    : imagenes.filter((i) => String(i.id_dataset) === String(filtroDs));

  const nombreDataset = (id) => {
    const d = datasets.find((d) => d.id_dataset === id || d.id_dataset === Number(id));
    return d ? d.nombre : `Dataset #${id}`;
  };

  return (
    <>
      {/* Modal editar imagen */}
      {editandoImg && (
        <div className="di-modal-overlay">
          <div className="di-modal">
            <h3>✏️ Mover imagen a otro dataset</h3>
            <img src={`${API_URL}/uploads/${editandoImg.url}`} alt=""
              className="di-modal-preview" onError={(e) => { e.target.style.display = "none"; }} />
            <label className="di-modal-label">Dataset destino</label>
            <select className="di-select" style={{ width: "100%", borderRadius: 12 }}
              value={editandoImg.id_dataset}
              onChange={(e) => setEditandoImg({ ...editandoImg, id_dataset: Number(e.target.value) })}>
              {datasets.map((d) => <option key={d.id_dataset} value={d.id_dataset}>{d.nombre}</option>)}
            </select>
            <div className="di-modal-btns">
              <button className="di-btn-primary-sm" onClick={guardarEdicionImg}>Guardar</button>
              <button className="di-btn-ghost-sm"   onClick={() => setEditandoImg(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {seleccion && (
        <div className="di-lightbox" onClick={() => setSeleccion(null)}>
          <div className="di-lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <button className="di-lightbox-close" onClick={() => setSeleccion(null)}>✕</button>
            <img src={`${API_URL}/uploads/${seleccion.url}`} alt={seleccion.url} />
            <p>{seleccion.url} — <em>{nombreDataset(seleccion.id_dataset)}</em></p>
          </div>
        </div>
      )}

      {/* Formulario subir */}
      <div className="di-form-box" style={{ marginBottom: 28 }}>
        <h3>⬆️ Subir imagen biológica</h3>
        <div className="di-form-row">
          <select className="di-select" value={idDataset}
            onChange={(e) => setIdDataset(e.target.value)}>
            {datasets.length === 0
              ? <option>— Sin datasets —</option>
              : datasets.map((d) => <option key={d.id_dataset} value={d.id_dataset}>{d.nombre}</option>)}
          </select>

          <label className="di-file-label">
            📂 {archivo ? archivo.name : "Seleccionar imagen"}
            <input ref={fileRef} type="file" accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => setArchivo(e.target.files[0])} />
          </label>

          <button className="di-btn-primary-sm" onClick={subirImagen} disabled={subiendo}>
            {subiendo ? "Subiendo..." : "Subir"}
          </button>
        </div>

        {/* Preview */}
        {archivo && (
          <div style={{ marginTop: 12 }}>
            <img src={URL.createObjectURL(archivo)} alt="preview"
              style={{ height: 100, borderRadius: 10, border: "2px solid #d8c3a5", objectFit: "cover" }} />
          </div>
        )}
      </div>

      {/* Filtros */}
      <div className="di-filtros">
        <span>Filtrar por dataset:</span>
        <button className={`di-filtro-btn ${filtroDs === "todos" ? "active" : ""}`}
          onClick={() => setFiltroDs("todos")}>Todos</button>
        {datasets.map((d) => (
          <button key={d.id_dataset}
            className={`di-filtro-btn ${filtroDs == d.id_dataset ? "active" : ""}`}
            onClick={() => setFiltroDs(d.id_dataset)}>
            {d.nombre}
          </button>
        ))}
      </div>

      {filtradas.length === 0 && <p className="di-empty">No hay imágenes en este dataset.</p>}

      {/* Grid imágenes */}
      <div className="di-img-grid">
        {filtradas.map((img) => {
          const imgId = img.id_imagen ?? img.id;
          return (
            <div key={imgId} className="di-img-card">
              <img src={`${API_URL}/uploads/${img.url}`} alt={img.url}
                onClick={() => setSeleccion(img)}
                onError={(e) => { e.target.style.display = "none"; }} />
              <p className="di-img-dataset">📁 {nombreDataset(img.id_dataset)}</p>
              <p className="di-img-name">{img.url}</p>
              <div className="di-card-actions" style={{ padding: "0 8px 10px" }}>
                <button className="di-btn-edit-sm"
                  onClick={() => setEditandoImg({ id: imgId, url: img.url, id_dataset: img.id_dataset })}>
                  ✏️
                </button>
                <button className="di-btn-danger-sm" onClick={() => eliminarImagen(imgId)}>🗑</button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default DashboardInvestigador;