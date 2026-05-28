import { useEffect, useState, useRef } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import axios from "axios";
import "../styles/DashboardAdmin.css";

const API = "http://localhost:4000/api";
const CLUSTER_URL = "https://nonobsessional-flynn-unrecognizing.ngrok-free.dev/";

function authHeader() {
  return { Authorization: `Bearer ${localStorage.getItem("token")}` };
}

function DashboardAdmin({ seccion }) {

  // ── STATS ──
  const [stats, setStats] = useState({ usuarios: 0, datasets: 0, imagenes: 0 });

  // ── USUARIOS ──
  const [usuarios,        setUsuarios]        = useState([]);
  const [formUsuario,     setFormUsuario]     = useState({ nombre: "", email: "", password: "", id_rol: 2 });
  const [editandoUsuario, setEditandoUsuario] = useState(null);

  // ── DATASETS ──
  const [datasets,        setDatasets]        = useState([]);
  const [formDataset,     setFormDataset]     = useState({ nombre: "", descripcion: "" });
  const [editandoDataset, setEditandoDataset] = useState(null); // { id, nombre, descripcion }

  // ── IMÁGENES ──
  const [datasets2,     setDatasets2]     = useState([]);
  const [idDatasetImg,  setIdDatasetImg]  = useState("");
  const [archivoImg,    setArchivoImg]    = useState(null);
  const [imagenes,      setImagenes]      = useState([]);
  const [subiendo,      setSubiendo]      = useState(false);
  const [editandoImg,   setEditandoImg]   = useState(null); // { id, id_dataset }
  const fileRef = useRef();

// ── TUTORIALES ──
const [tutoriales, setTutoriales] = useState([]);
const [formTutorial, setFormTutorial] = useState({titulo: "", contenido: "", });
const [editandoTutorial, setEditandoTutorial] = useState(null);
  
  // ── CARGA ──
  useEffect(() => { fetchStats(); }, []);
  useEffect(() => {
    if (seccion === "usuarios")  fetchUsuarios();
    if (seccion === "datasets")  fetchDatasets();
    if (seccion === "imagenes")   { fetchDatasets2(); fetchImagenes(); }
    if (seccion === "tutoriales") fetchTutoriales();
  }, [seccion]);

  // ════ STATS ════
  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/stats`, { headers: authHeader() });
      setStats(res.data);
    } catch (e) { console.log(e); }
  };

  // ════ USUARIOS ════
  const fetchUsuarios = async () => {
    try {
      const res = await axios.get(`${API}/users`, { headers: authHeader() });
      setUsuarios(res.data);
    } catch (e) { console.log(e); }
  };

  const guardarUsuario = async () => {
    if (!formUsuario.nombre || !formUsuario.email) { alert("Nombre y correo son obligatorios"); return; }
    try {
      if (editandoUsuario) {
        await axios.put(`${API}/users/${editandoUsuario}`, { id_rol: formUsuario.id_rol }, { headers: authHeader() });
      } else {
        await axios.post(`${API}/auth/register`, formUsuario, { headers: authHeader() });
      }
      setFormUsuario({ nombre: "", email: "", password: "", id_rol: 2 });
      setEditandoUsuario(null);
      fetchUsuarios(); fetchStats();
    } catch { alert("Error al guardar usuario"); }
  };

  const editarUsuario = (u) => {
    setEditandoUsuario(u.id_usuario);
    setFormUsuario({ nombre: u.nombre, email: u.email, password: "", id_rol: u.id_rol });
  };

  const cancelarEdicionUsuario = () => {
    setEditandoUsuario(null);
    setFormUsuario({ nombre: "", email: "", password: "", id_rol: 2 });
  };

  const eliminarUsuario = async (id) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    try {
      await axios.delete(`${API}/users/${id}`, { headers: authHeader() });
      fetchUsuarios(); fetchStats();
    } catch { alert("Error al eliminar"); }
  };

  // ════ DATASETS ════
  const fetchDatasets = async () => {
    try {
      const res = await axios.get(`${API}/datasets`, { headers: authHeader() });
      setDatasets(res.data);
    } catch (e) { console.log(e); }
  };

  const crearDataset = async () => {
    if (!formDataset.nombre) { alert("El nombre es obligatorio"); return; }
    try {
      await axios.post(`${API}/datasets`, formDataset, { headers: authHeader() });
      setFormDataset({ nombre: "", descripcion: "" });
      fetchDatasets(); fetchStats();
    } catch { alert("Error al crear dataset"); }
  };

  const guardarEdicionDataset = async () => {
    if (!editandoDataset.nombre) { alert("El nombre es obligatorio"); return; }
    try {
      await axios.put(
        `${API}/datasets/${editandoDataset.id}`,
        { nombre: editandoDataset.nombre, descripcion: editandoDataset.descripcion },
        { headers: authHeader() }
      );
      setEditandoDataset(null);
      fetchDatasets();
    } catch { alert("Error al editar dataset"); }
  };

  const eliminarDataset = async (id) => {
    if (!confirm("¿Eliminar este dataset?")) return;
    try {
      await axios.delete(`${API}/datasets/${id}`, { headers: authHeader() });
      fetchDatasets(); fetchStats();
    } catch { alert("Error al eliminar"); }
  };

  // ════ IMÁGENES ════
  const fetchDatasets2 = async () => {
    try {
      const res = await axios.get(`${API}/datasets`, { headers: authHeader() });
      setDatasets2(res.data);
      if (res.data.length > 0) setIdDatasetImg(res.data[0].id_dataset);
    } catch (e) { console.log(e); }
  };

  const fetchImagenes = async () => {
    try {
      const res = await axios.get(`${API}/images`, { headers: authHeader() });
      setImagenes(res.data);
    } catch (e) { console.log(e); }
  };

  const subirImagen = async () => {
    if (!archivoImg)   { alert("Selecciona una imagen"); return; }
    if (!idDatasetImg) { alert("Selecciona un dataset"); return; }
    const formData = new FormData();
    formData.append("imagen",     archivoImg);
    formData.append("id_dataset", idDatasetImg);
    try {
      setSubiendo(true);
      await axios.post(`${API}/images`, formData, {
        headers: { ...authHeader(), "Content-Type": "multipart/form-data" },
      });
      setArchivoImg(null);
      if (fileRef.current) fileRef.current.value = "";
      fetchImagenes(); fetchStats();
    } catch { alert("Error al subir imagen"); }
    finally { setSubiendo(false); }
  };

  const guardarEdicionImagen = async () => {
    try {
      await axios.put(
        `${API}/images/${editandoImg.id}`,
        { id_dataset: editandoImg.id_dataset },
        { headers: authHeader() }
      );
      setEditandoImg(null);
      fetchImagenes();
    } catch { alert("Error al editar imagen"); }
  };

  const eliminarImagen = async (id) => {
    if (!confirm("¿Eliminar esta imagen?")) return;
    try {
      await axios.delete(`${API}/images/${id}`, { headers: authHeader() });
      fetchImagenes(); fetchStats();
    } catch { alert("Error al eliminar"); }
  };

  // ════ TUTORIALES ════

const fetchTutoriales = async () => {
  try {
    const res = await axios.get(
      `${API}/tutoriales`,
      { headers: authHeader() }
    );
    setTutoriales(res.data);
  } catch (error) {
    console.log(error);
  }
};

const guardarTutorial = async () => {
  if (!formTutorial.titulo || !formTutorial.contenido) {
    alert("Completa todos los campos");
    return;
  }
  try {
    if (editandoTutorial) {
      await axios.put(
        `${API}/tutoriales/${editandoTutorial}`,
        formTutorial,
        { headers: authHeader() }
      );
    } else {
      await axios.post(
        `${API}/tutoriales`,
        formTutorial,
        { headers: authHeader() }
      );
    }
    setFormTutorial({
      titulo: "",
      contenido: "",
    });
    setEditandoTutorial(null);
    fetchTutoriales();
  } catch (error) {
    console.log(error);
    alert("Error al guardar tutorial");
  }
};

const editarTutorial = (tutorial) => {
  setEditandoTutorial(tutorial.id_tutorial);
  setFormTutorial({
    titulo: tutorial.titulo,
    contenido: tutorial.contenido,
  });
};

const cancelarTutorial = () => {
  setEditandoTutorial(null);
  setFormTutorial({
    titulo: "",
    contenido: "",
  });
};

const eliminarTutorial = async (id) => {
  if (!confirm("¿Eliminar tutorial?")) return;
  try {
    await axios.delete(
      `${API}/tutoriales/${id}`,
      { headers: authHeader() }
    );
    fetchTutoriales();
  } catch (error) {
    console.log(error);
    alert("Error al eliminar");
  }
};

  // ════ HELPERS ════
  const rolLabel = (id) => {
    if (id === 1) return { texto: "Admin",        clase: "badge-admin" };
    if (id === 2) return { texto: "Investigador", clase: "badge-inv"   };
    return           { texto: "Estudiante",    clase: "badge-est"   };
  };

  const nombreDataset = (id) => {
    const d = datasets2.find((d) => d.id_dataset === id || d.id_dataset === Number(id));
    return d ? d.nombre : `Dataset #${id}`;
  };
  const modules = { toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image", "video"],
    ["clean"],],
  };
  // ══════════════════════════════════════════════════════════════
  return (
    <div className="da-wrapper">

      {/* ══ MODAL EDITAR DATASET ══ */}
      {editandoDataset && (
        <div className="da-modal-overlay">
          <div className="da-modal">
            <h3>✏️ Editar dataset</h3>
            <input
              className="da-input da-input-full"
              placeholder="Nombre del dataset"
              value={editandoDataset.nombre}
              onChange={(e) => setEditandoDataset({ ...editandoDataset, nombre: e.target.value })}
            />
            <input
              className="da-input da-input-full"
              placeholder="Descripción (opcional)"
              value={editandoDataset.descripcion || ""}
              onChange={(e) => setEditandoDataset({ ...editandoDataset, descripcion: e.target.value })}
            />
            <div className="da-modal-btns">
              <button className="da-btn da-btn-primary" onClick={guardarEdicionDataset}>Guardar</button>
              <button className="da-btn da-btn-ghost"   onClick={() => setEditandoDataset(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL EDITAR IMAGEN ══ */}
      {editandoImg && (
        <div className="da-modal-overlay">
          <div className="da-modal">
            <h3>✏️ Editar imagen</h3>
            <p className="da-modal-sub">Cambiar el dataset al que pertenece esta imagen</p>
            <img
              src={`http://localhost:4000/uploads/${editandoImg.url}`}
              alt="preview"
              className="da-modal-preview"
            />
            <label className="da-modal-label">Dataset destino</label>
            <select
              className="da-select da-select-full"
              value={editandoImg.id_dataset}
              onChange={(e) => setEditandoImg({ ...editandoImg, id_dataset: Number(e.target.value) })}
            >
              {datasets2.map((d) => (
                <option key={d.id_dataset} value={d.id_dataset}>{d.nombre}</option>
              ))}
            </select>
            <div className="da-modal-btns">
              <button className="da-btn da-btn-primary" onClick={guardarEdicionImagen}>Guardar</button>
              <button className="da-btn da-btn-ghost"   onClick={() => setEditandoImg(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ INICIO ══ */}
      {seccion === "inicio" && (
        <div className="da-section">
          <h2 className="da-section-title">Resumen global</h2>
          <div className="da-cards">
            <div className="da-card da-card-green">
              <div className="da-card-icon">👥</div>
              <div>
                <p className="da-card-num">{stats.usuarios}</p>
                <p className="da-card-label">Usuarios</p>
              </div>
            </div>
            <div className="da-card da-card-blue">
              <div className="da-card-icon">🧫</div>
              <div>
                <p className="da-card-num">{stats.datasets}</p>
                <p className="da-card-label">Datasets</p>
              </div>
            </div>
            <div className="da-card da-card-sand">
              <div className="da-card-icon">🖼️</div>
              <div>
                <p className="da-card-num">{stats.imagenes}</p>
                <p className="da-card-label">Imágenes</p>
              </div>
            </div>
          </div>
          <div className="da-info-box">
            <p>Bienvenido al panel de administración. Usa el menú lateral para gestionar <strong>usuarios</strong>, <strong>datasets</strong>, <strong>imágenes</strong> y el <strong>cluster</strong>.</p>
          </div>
        </div>
      )}

      {/* ══ USUARIOS ══ */}
      {seccion === "usuarios" && (
        <div className="da-section">
          <h2 className="da-section-title">Gestión de usuarios</h2>
          <div className="da-form-box">
            <h3>{editandoUsuario ? "Editar rol de usuario" : "Crear usuario"}</h3>
            <div className="da-form-row">
              {!editandoUsuario && (
                <>
                  <input className="da-input" placeholder="Nombre completo"
                    value={formUsuario.nombre}
                    onChange={(e) => setFormUsuario({ ...formUsuario, nombre: e.target.value })} />
                  <input className="da-input" placeholder="Correo electrónico" type="email"
                    value={formUsuario.email}
                    onChange={(e) => setFormUsuario({ ...formUsuario, email: e.target.value })} />
                  <input className="da-input" placeholder="Contraseña" type="password"
                    value={formUsuario.password}
                    onChange={(e) => setFormUsuario({ ...formUsuario, password: e.target.value })} />
                </>
              )}
              <select className="da-select" value={formUsuario.id_rol}
                onChange={(e) => setFormUsuario({ ...formUsuario, id_rol: Number(e.target.value) })}>
                <option value={1}>Admin</option>
                <option value={2}>Investigador</option>
                <option value={3}>Estudiante</option>
              </select>
              <button className="da-btn da-btn-primary" onClick={guardarUsuario}>
                {editandoUsuario ? "Guardar cambios" : "Crear usuario"}
              </button>
              {editandoUsuario && (
                <button className="da-btn da-btn-ghost" onClick={cancelarEdicionUsuario}>Cancelar</button>
              )}
            </div>
          </div>
          <div className="da-table-wrap">
            <table className="da-table">
              <thead>
                <tr><th>#</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {usuarios.length === 0 && (
                  <tr><td colSpan={5} className="da-empty">No hay usuarios registrados</td></tr>
                )}
                {usuarios.map((u) => {
                  const { texto, clase } = rolLabel(u.id_rol);
                  return (
                    <tr key={u.id_usuario}>
                      <td>{u.id_usuario}</td>
                      <td>{u.nombre}</td>
                      <td>{u.email}</td>
                      <td><span className={`da-badge ${clase}`}>{texto}</span></td>
                      <td className="da-actions">
                        <button className="da-btn da-btn-sm da-btn-edit"   onClick={() => editarUsuario(u)}>Editar rol</button>
                        <button className="da-btn da-btn-sm da-btn-danger" onClick={() => eliminarUsuario(u.id_usuario)}>Eliminar</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══ DATASETS ══ */}
      {seccion === "datasets" && (
        <div className="da-section">
          <h2 className="da-section-title">Gestión de datasets</h2>
          <div className="da-form-box">
            <h3>Crear dataset</h3>
            <div className="da-form-row">
              <input className="da-input" placeholder="Nombre del dataset"
                value={formDataset.nombre}
                onChange={(e) => setFormDataset({ ...formDataset, nombre: e.target.value })} />
              <input className="da-input" placeholder="Descripción (opcional)"
                value={formDataset.descripcion}
                onChange={(e) => setFormDataset({ ...formDataset, descripcion: e.target.value })} />
              <button className="da-btn da-btn-primary" onClick={crearDataset}>Crear dataset</button>
            </div>
          </div>
          <div className="da-dataset-grid">
            {datasets.length === 0 && <p className="da-empty">No hay datasets registrados</p>}
            {datasets.map((d) => (
              <div className="da-dataset-card" key={d.id_dataset}>
                <div className="da-dataset-header">
                  {d.imagen
                    ? <img src={`http://localhost:4000/uploads/${d.imagen}`} alt={d.nombre} className="da-dataset-img" />
                    : <div className="da-dataset-no-img">🔬</div>}
                </div>
                <div className="da-dataset-body">
                  <p className="da-dataset-name">{d.nombre}</p>
                  <p className="da-dataset-desc">{d.descripcion || "Sin descripción"}</p>
                  <div className="da-card-actions">
                    <button
                      className="da-btn da-btn-edit da-btn-sm da-btn-half"
                      onClick={() => setEditandoDataset({ id: d.id_dataset, nombre: d.nombre, descripcion: d.descripcion })}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="da-btn da-btn-danger da-btn-sm da-btn-half"
                      onClick={() => eliminarDataset(d.id_dataset)}
                    >
                      🗑 Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ IMÁGENES ══ */}
      {seccion === "imagenes" && (
        <div className="da-section">
          <h2 className="da-section-title">Gestión de imágenes</h2>
          <div className="da-form-box">
            <h3>Subir imagen biológica</h3>
            <div className="da-form-row da-form-col">
              <div className="da-upload-row">
                <select className="da-select" value={idDatasetImg}
                  onChange={(e) => setIdDatasetImg(e.target.value)}>
                  {datasets2.length === 0
                    ? <option>— Sin datasets —</option>
                    : datasets2.map((d) => (
                        <option key={d.id_dataset} value={d.id_dataset}>{d.nombre}</option>
                      ))}
                </select>
                <label className="da-file-label">
                  📂 {archivoImg ? archivoImg.name : "Seleccionar imagen"}
                  <input ref={fileRef} type="file" accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => setArchivoImg(e.target.files[0])} />
                </label>
                <button className="da-btn da-btn-primary" onClick={subirImagen} disabled={subiendo}>
                  {subiendo ? "Subiendo..." : "⬆ Subir imagen"}
                </button>
              </div>
              {archivoImg && (
                <div className="da-preview">
                  <img src={URL.createObjectURL(archivoImg)} alt="preview" className="da-preview-img" />
                </div>
              )}
            </div>
          </div>

          <div className="da-img-grid">
            {imagenes.length === 0 && <p className="da-empty">No hay imágenes registradas</p>}
            {imagenes.map((img) => {
              const imgId = img.id_imagen ?? img.id;
              return (
                <div className="da-img-card" key={imgId}>
                  <img
                    src={`http://localhost:4000/uploads/${img.url}`}
                    alt={img.url}
                    className="da-img-thumb"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                  <div className="da-img-info">
                    <p className="da-img-dataset">📁 {nombreDataset(img.id_dataset)}</p>
                    <p className="da-img-name">{img.url}</p>
                    <div className="da-card-actions">
                      <button
                        className="da-btn da-btn-edit da-btn-sm da-btn-half"
                        onClick={() => setEditandoImg({ id: imgId, url: img.url, id_dataset: img.id_dataset })}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className="da-btn da-btn-danger da-btn-sm da-btn-half"
                        onClick={() => eliminarImagen(imgId)}
                      >
                        🗑 Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* ══ TUTORIALES ══ */}
      {seccion === "tutoriales" && (
        <div className="da-section">
          <h2 className="da-section-title"> Gestión de tutoriales</h2>
        <div className="da-form-box">
      <h3>{ editandoTutorial ? "Editar tutorial" : "Crear tutorial" }</h3>
      <div className="da-form-col">
        <input
          className="da-input da-input-full"
          placeholder="Título del tutorial"
          value={formTutorial.titulo}
          onChange={(e) =>
            setFormTutorial({
              ...formTutorial,
              titulo: e.target.value,
            })
          }
        />
       <ReactQuill
        theme="snow"
        value={formTutorial.contenido}
        onChange={(value) =>
         setFormTutorial({...formTutorial, contenido: value,})}
       modules={modules}
      className="da-editor"/>
        <div className="da-modal-btns">
          <button className="da-btn da-btn-primary" onClick={guardarTutorial}>
            { editandoTutorial
                ? "Guardar cambios"
                : "Crear tutorial"
            }
          </button>
          {
            editandoTutorial && (
              <button className="da-btn da-btn-ghost" onClick={cancelarTutorial}> Cancelar </button>
            )
          }
        </div>
      </div>
    </div>
    <div className="da-dataset-grid">
      {
        tutoriales.map((tutorial) => (
          <div
            className="da-dataset-card"
            key={tutorial.id_tutorial}>
            <div className="da-dataset-body">
              <p className="da-dataset-name"> 📘 {tutorial.titulo}</p>
              <div
                className="da-tutorial-preview"
                dangerouslySetInnerHTML={{ __html: tutorial.contenido }}
              />
              <div className="da-card-actions">
                <button className="da-btn da-btn-edit da-btn-sm da-btn-half" onClick={() => editarTutorial(tutorial)}>  ✏️ Editar </button>
                <button className="da-btn da-btn-danger da-btn-sm da-btn-half" onClick={() => eliminarTutorial(tutorial.id_tutorial)}> 🗑 Eliminar </button>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  </div>
)}

      {/* ══ CLUSTER ══ */}
      {seccion === "cluster" && (
        <div className="da-section">
          <h2 className="da-section-title">Monitor del Cluster</h2>
          <div className="da-info-box" style={{ marginBottom: 24 }}>
            <p>Accede al panel externo del cluster desde aquí. Se abrirá en una nueva pestaña.</p>
          </div>
          <a href={CLUSTER_URL} target="_blank" rel="noopener noreferrer"
            className="da-btn da-btn-primary da-btn-cluster">
            🖥 Abrir panel del Cluster
          </a>
          <div className="da-cluster-frame-wrap">
            <iframe src={CLUSTER_URL} title="Cluster" className="da-cluster-frame" />
          </div>
        </div>
      )}

    </div>
  );
}

export default DashboardAdmin;