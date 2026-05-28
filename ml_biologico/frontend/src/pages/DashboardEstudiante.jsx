import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/DashboardEstudiante.css";

const API = "http://localhost:4000/api";

function authHeader() {
  return { Authorization: `Bearer ${localStorage.getItem("token")}` };
}

// Logros y su condición para desbloquearlos
const LOGROS_DEF = [
  { id: 1, emoji: "🧠", titulo: "Primer entrenamiento",  descripcion: "Completaste tu primer entrenamiento",   check: (s) => s.entrenamientos >= 1  },
  { id: 2, emoji: "📊", titulo: "Experto en métricas",   descripcion: "Alcanzaste accuracy mayor al 70%",       check: (s) => s.accuracy >= 0.70     },
  { id: 3, emoji: "📚", titulo: "Primer tutorial",        descripcion: "Completaste tu primer tutorial",         check: (s) => s.completados >= 1     },
  { id: 4, emoji: "🎯", titulo: "Precisión perfecta",    descripcion: "Alcanzaste accuracy mayor al 90%",       check: (s) => s.accuracy >= 0.90     },
  { id: 5, emoji: "🏅", titulo: "Estudiante dedicado",   descripcion: "Completaste 3 tutoriales",               check: (s) => s.completados >= 3     },
  { id: 6, emoji: "🚀", titulo: "Listo para investigar", descripcion: "Realizaste 3 o más entrenamientos",      check: (s) => s.entrenamientos >= 3  },
];

function DashboardEstudiante({ seccion, setSeccion }) {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  const [tutoriales,   setTutoriales]   = useState([]);
  const [completados,  setCompletados]  = useState([]); // ids completados
  const [tutorialAct,  setTutorialAct]  = useState(null);
  const [stats,        setStats]        = useState({ completados: 0, entrenamientos: 0, accuracy: 0 });
  const [cargando,     setCargando]     = useState(true);

  // Calcula logros desbloqueados según stats reales
  const logrosDesbloqueados = LOGROS_DEF.filter((l) => l.check(stats)).map((l) => l.id);

  // Progreso = (tutoriales completados / total) * 60  +  (entrenamientos / 3) * 40  (máx 100)
  const progreso = tutoriales.length === 0 ? 0 : Math.min(100, Math.round(
    (completados.length / tutoriales.length) * 60 +
    Math.min(stats.entrenamientos, 3) / 3 * 40
  ));

  useEffect(() => {
    Promise.all([fetchTutoriales(), fetchStats(), fetchCompletados()])
      .finally(() => setCargando(false));
  }, []);

  const fetchTutoriales = async () => {
    try {
      const res = await axios.get(`${API}/tutoriales`);
      setTutoriales(res.data);
    } catch { /* sin tutoriales */ }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/estudiante/stats`, { headers: authHeader() });
      setStats(res.data);
    } catch { /* usa defaults */ }
  };

  const fetchCompletados = async () => {
    try {
      const res = await axios.get(`${API}/estudiante/completados`, { headers: authHeader() });
      setCompletados(res.data); // array de ids
    } catch { /* usa defaults */ }
  };

  const completarTutorial = async (tutorial) => {
    try {
      await axios.post(
        `${API}/estudiante/completar/${tutorial.id_tutorial}`,
        {},
        { headers: authHeader() }
      );
      // Actualiza estado local
      setCompletados((prev) =>
        prev.includes(tutorial.id_tutorial) ? prev : [...prev, tutorial.id_tutorial]
      );
      setStats((s) => ({ ...s, completados: s.completados + 1 }));
      setTutorialAct(null);
    } catch {
      alert("Error al guardar progreso");
    }
  };

  if (cargando) {
    return (
      <div className="de-wrapper" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#6b8f71", fontSize: 20 }}>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="de-wrapper">

      {/* ══ MODAL TUTORIAL ══ */}
      {tutorialAct && (
        <div className="de-modal-overlay">
          <div className="de-modal">
            <h3>{tutorialAct.titulo}</h3>
            <div
              className="de-modal-contenido"
              dangerouslySetInnerHTML={{ __html: tutorialAct.contenido }}
            />
            <div className="de-modal-btns">
              {!completados.includes(tutorialAct.id_tutorial) ? (
                <button
                  className="de-btn de-btn-primary"
                  onClick={() => completarTutorial(tutorialAct)}
                >
                  ✅ Marcar como completado
                </button>
              ) : (
                <button className="de-btn de-btn-primary" disabled>
                  ✔ Ya completado
                </button>
              )}
              <button className="de-btn de-btn-ghost" onClick={() => setTutorialAct(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ INICIO ══ */}
      {seccion === "inicio" && (
        <div className="de-section">
          <h2 className="de-title">Bienvenido, {usuario.nombre ?? "Estudiante"} 🎓</h2>

          <div className="de-cards">
            <div className="de-card de-card-green">
              <div className="de-card-icon">📚</div>
              <div>
                <p className="de-card-num">{completados.length} / {tutoriales.length}</p>
                <p className="de-card-label">Tutoriales completados</p>
              </div>
            </div>
            <div className="de-card de-card-blue">
              <div className="de-card-icon">🧠</div>
              <div>
                <p className="de-card-num">{stats.entrenamientos}</p>
                <p className="de-card-label">Entrenamientos realizados</p>
              </div>
            </div>
            <div className="de-card de-card-teal">
              <div className="de-card-icon">🎯</div>
              <div>
                <p className="de-card-num">{stats.accuracy > 0 ? (stats.accuracy * 100).toFixed(1) + "%" : "—"}</p>
                <p className="de-card-label">Accuracy promedio</p>
              </div>
            </div>
            <div className="de-card de-card-sand">
              <div className="de-card-icon">🏆</div>
              <div>
                <p className="de-card-num">{logrosDesbloqueados.length} / {LOGROS_DEF.length}</p>
                <p className="de-card-label">Logros desbloqueados</p>
              </div>
            </div>
          </div>

          <div className="de-progress-box">
            <div className="de-progress-header">
              <span>Progreso general del curso</span>
              <span>{progreso}%</span>
            </div>
            <div className="de-progress-track">
              <div className="de-progress-fill" style={{ width: `${progreso}%` }} />
            </div>
          </div>
          {/* Accesos rápidos */}
          <div className="de-accesos">
            <h3 className="de-subtitle">Accesos rápidos</h3>
            <div className="de-accesos-grid">
              <button className="de-acceso-card" onClick={() => setSeccion?.("tutoriales")}>
                <span className="de-acceso-icon">📖</span>
                <span className="de-acceso-label">Tutoriales</span>
                <span className="de-acceso-sub">{completados.length}/{tutoriales.length} completados</span>
              </button>
              <button className="de-acceso-card" onClick={() => setSeccion?.("entrenamiento")}>
                <span className="de-acceso-icon">🤖</span>
                <span className="de-acceso-label">Entrenar modelo</span>
                <span className="de-acceso-sub">Modo simplificado</span>
              </button>
              <button className="de-acceso-card" onClick={() => setSeccion?.("progreso")}>
                <span className="de-acceso-icon">📈</span>
                <span className="de-acceso-label">Mi progreso</span>
                <span className="de-acceso-sub">{progreso}% completado</span>
              </button>
              <button className="de-acceso-card" onClick={() => setSeccion?.("logros")}>
                <span className="de-acceso-icon">🏆</span>
                <span className="de-acceso-label">Logros</span>
                <span className="de-acceso-sub">{logrosDesbloqueados.length}/{LOGROS_DEF.length} desbloqueados</span>
              </button>
            </div>
          </div>

          {/* Frase motivacional */}
          <div className="de-frase-card">
            <span className="de-frase-icon">🌱</span>
            <p>"El machine learning no es magia, es matemáticas aplicadas con curiosidad."</p>
          </div>
        </div>
      )}

      {/* ══ TUTORIALES ══ */}
      {seccion === "tutoriales" && (
        <div className="de-section">
          <h2 className="de-title">Tutoriales interactivos 📖</h2>
          {tutoriales.length === 0 && (
            <div className="de-info-box"><p>Aún no hay tutoriales disponibles. El administrador los publicará pronto.</p></div>
          )}
          <div className="de-tutorial-grid">
            {tutoriales.map((t) => {
              const yaCompletado = completados.includes(t.id_tutorial);
              return (
                <div className={`de-tutorial-card ${yaCompletado ? "de-tutorial-done" : ""}`} key={t.id_tutorial}>
                  <div className="de-tutorial-icon">{yaCompletado ? "✅" : "📄"}</div>
                  <h3>{t.titulo}</h3>
                  <div
                    className="de-tutorial-preview"
                    dangerouslySetInnerHTML={{ __html: t.contenido?.substring(0, 120) }}
                  />
                  <button
                    className={`de-btn ${yaCompletado ? "de-btn-ghost" : "de-btn-primary"}`}
                    onClick={() => setTutorialAct(t)}
                  >
                    {yaCompletado ? "📖 Releer tutorial" : "▶ Iniciar tutorial"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══ ENTRENAMIENTO ══ */}
      {seccion === "entrenamiento" && (
        <div className="de-section">
          <h2 className="de-title">Entrenamiento simplificado 🤖</h2>
          <div className="de-info-box" style={{ marginBottom: 24 }}>
            <p>Lanza entrenamientos con parámetros preconfigurados para aprender el flujo sin configuración avanzada.</p>
          </div>
          <EntrenamientoEstudiante onCompletado={fetchStats} />
        </div>
      )}

      {/* ══ PROGRESO ══ */}
      {seccion === "progreso" && (
        <div className="de-section">
          <h2 className="de-title">Mi progreso 📈</h2>

          <div className="de-progress-box" style={{ marginBottom: 24 }}>
            <div className="de-progress-header">
              <span>Progreso general</span>
              <span>{progreso}%</span>
            </div>
            <div className="de-progress-track">
              <div className="de-progress-fill" style={{ width: `${progreso}%` }} />
            </div>
          </div>

          <div className="de-progreso-grid">
            {[
              { label: "Tutoriales completados", valor: completados.length,      total: tutoriales.length, color: "#1f4d3a" },
              { label: "Logros obtenidos",        valor: logrosDesbloqueados.length, total: LOGROS_DEF.length,  color: "#006699" },
              { label: "Entrenamientos",          valor: stats.entrenamientos,   total: 3,                  color: "#7b5ea7" },
            ].map((item) => (
              <div className="de-progreso-card" key={item.label}>
                <p className="de-progreso-label">{item.label}</p>
                <p className="de-progreso-num" style={{ color: item.color }}>
                  {item.valor} / {item.total}
                </p>
                <div className="de-progress-track">
                  <div
                    className="de-progress-fill"
                    style={{
                      width: `${item.total ? Math.min(100, (item.valor / item.total) * 100) : 0}%`,
                      background: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {stats.accuracy > 0 && (
            <div className="de-accuracy-box">
              <span>🎯 Accuracy promedio de tus entrenamientos:</span>
              <strong> {(stats.accuracy * 100).toFixed(1)}%</strong>
            </div>
          )}
        </div>
      )}

      {/* ══ LOGROS ══ */}
      {seccion === "logros" && (
        <div className="de-section">
          <h2 className="de-title">Mis logros 🏆</h2>
          <p style={{ color: "#666", marginBottom: 24 }}>
            {logrosDesbloqueados.length} de {LOGROS_DEF.length} desbloqueados
          </p>
          <div className="de-logros-grid">
            {LOGROS_DEF.map((logro) => {
              const desbloqueado = logrosDesbloqueados.includes(logro.id);
              return (
                <div key={logro.id} className={`de-logro-card ${desbloqueado ? "desbloqueado" : "bloqueado"}`}>
                  <div className="de-logro-emoji">{desbloqueado ? logro.emoji : "🔒"}</div>
                  <p className="de-logro-titulo">{logro.titulo}</p>
                  <p className="de-logro-desc">{logro.descripcion}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}

// ─── Entrenamiento simplificado ───────────────────────────────
function EntrenamientoEstudiante({ onCompletado }) {
  const [dataset,    setDataset]    = useState("");
  const [datasets,   setDatasets]   = useState([]);
  const [entrenando, setEntrenando] = useState(false);
  const [resultado,  setResultado]  = useState(null);
  const [logs,       setLogs]       = useState([]);

  useEffect(() => {
    axios.get(`${API}/datasets`, { headers: authHeader() })
      .then((r) => { setDatasets(r.data); if (r.data[0]) setDataset(r.data[0].id_dataset); })
      .catch(() => {});
  }, []);

  const lanzar = async () => {
    if (!dataset) { alert("Selecciona un dataset"); return; }
    setEntrenando(true);
    setLogs([]);
    setResultado(null);

    const addLog = (msg) =>
      setLogs((p) => [...p, `[${new Date().toLocaleTimeString()}] ${msg}`]);

    try {
      addLog("Iniciando entrenamiento con parámetros básicos...");
      addLog("Modelo: CNN | Épocas: 5 | Batch: 16 | LR: 0.001");

      const res = await axios.post(
        `${API}/models/train`,
        { id_dataset: dataset, modelo: "cnn", epochs: 5, batch_size: 16, learning_rate: 0.001, modo: "local" },
        { headers: authHeader() }
      );

      addLog("✅ Entrenamiento completado.");
      setResultado(res.data.metricas);
      onCompletado?.(); // refresca stats
    } catch (e) {
      addLog(`❌ Error: ${e.response?.data?.error ?? e.message}`);
    } finally {
      setEntrenando(false);
    }
  };

  return (
    <div className="de-entrena-box">
      <div className="de-field">
        <label>Selecciona un dataset</label>
        <select className="de-select" value={dataset} onChange={(e) => setDataset(e.target.value)} disabled={entrenando}>
          {datasets.length === 0
            ? <option>— Sin datasets —</option>
            : datasets.map((d) => <option key={d.id_dataset} value={d.id_dataset}>{d.nombre}</option>)
          }
        </select>
      </div>

      <div className="de-params-info">
        <span>🤖 CNN</span><span>🔁 5 épocas</span>
        <span>📐 Batch 16</span><span>📉 LR 0.001</span>
      </div>

      <button className="de-btn de-btn-primary de-btn-big" onClick={lanzar} disabled={entrenando}>
        {entrenando ? "⏳ Entrenando..." : "▶ Iniciar entrenamiento"}
      </button>

      {logs.length > 0 && (
        <div className="de-logs">
          {logs.map((l, i) => <div key={i}>{l}</div>)}
        </div>
      )}

      {resultado && (
        <div className="de-resultado">
          <h3>📊 Resultado</h3>
          <div className="de-resultado-grid">
            <div><span>Accuracy</span><strong>{(resultado.accuracy * 100).toFixed(1)}%</strong></div>
            <div><span>F1-Score</span><strong>{(resultado.f1_score * 100).toFixed(1)}%</strong></div>
            <div><span>Loss</span><strong>{resultado.loss}</strong></div>
            <div><span>Precision</span><strong>{(resultado.precision * 100).toFixed(1)}%</strong></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardEstudiante;