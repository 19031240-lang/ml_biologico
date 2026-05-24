import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/DashboardAdmin.css";

const API = "http://localhost:4000/api";

function getToken() {
  return localStorage.getItem("token");
}

function authHeader() {
  return { Authorization: `Bearer ${getToken()}` };
}

function DashboardAdmin({ seccion }) {

  // ── STATS ──
  const [stats, setStats] = useState({ usuarios: 0, datasets: 0, imagenes: 0 });

  // ── USUARIOS ──
  const [usuarios, setUsuarios] = useState([]);
  const [formUsuario, setFormUsuario] = useState({ nombre: "", email: "", password: "", id_rol: 2 });
  const [editandoUsuario, setEditandoUsuario] = useState(null);

  // ── DATASETS ──
  const [datasets, setDatasets] = useState([]);
  const [formDataset, setFormDataset] = useState({ nombre: "", descripcion: "" });

  useEffect(() => { fetchStats(); }, []);

  useEffect(() => {
    if (seccion === "usuarios") fetchUsuarios();
    if (seccion === "datasets") fetchDatasets();
  }, [seccion]);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/stats`, { headers: authHeader() });
      setStats(res.data);
    } catch (e) { console.log(e); }
  };

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
      fetchUsuarios();
      fetchStats();
    } catch { alert("Error al guardar usuario"); }
  };

  const editarUsuario = (u) => {
    setEditandoUsuario(u.id_usuario);
    setFormUsuario({ nombre: u.nombre, email: u.email, password: "", id_rol: u.id_rol });
  };

  const eliminarUsuario = async (id) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    try {
      await axios.delete(`${API}/users/${id}`, { headers: authHeader() });
      fetchUsuarios(); fetchStats();
    } catch { alert("Error al eliminar"); }
  };

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

  const eliminarDataset = async (id) => {
    if (!confirm("¿Eliminar este dataset?")) return;
    try {
      await axios.delete(`${API}/datasets/${id}`, { headers: authHeader() });
      fetchDatasets(); fetchStats();
    } catch { alert("Error al eliminar"); }
  };

  const rolLabel = (id) => {
    if (id === 1) return { texto: "Admin",        clase: "badge-admin" };
    if (id === 2) return { texto: "Investigador", clase: "badge-inv"   };
    return           { texto: "Estudiante",    clase: "badge-est"   };
  };

  // ══════════════════════════════════════════════
  return (
    <div className="da-wrapper">

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
              <div className="da-card-icon">🗂</div>
              <div>
                <p className="da-card-num">{stats.datasets}</p>
                <p className="da-card-label">Datasets</p>
              </div>
            </div>
            <div className="da-card da-card-sand">
              <div className="da-card-icon">🖼</div>
              <div>
                <p className="da-card-num">{stats.imagenes}</p>
                <p className="da-card-label">Imágenes</p>
              </div>
            </div>
          </div>

          <div className="da-info-box">
            <p>
              Bienvenido al panel de administración. Usa el menú lateral para
              gestionar <strong>usuarios</strong> y <strong>datasets</strong>.
            </p>
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
                <button className="da-btn da-btn-ghost"
                  onClick={() => { setEditandoUsuario(null); setFormUsuario({ nombre: "", email: "", password: "", id_rol: 2 }); }}>
                  Cancelar
                </button>
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
                        <button className="da-btn da-btn-sm da-btn-edit" onClick={() => editarUsuario(u)}>Editar rol</button>
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
                    : <div className="da-dataset-no-img">🗂</div>
                  }
                </div>
                <div className="da-dataset-body">
                  <p className="da-dataset-name">{d.nombre}</p>
                  <p className="da-dataset-desc">{d.descripcion || "Sin descripción"}</p>
                  <button className="da-btn da-btn-danger da-btn-full" onClick={() => eliminarDataset(d.id_dataset)}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default DashboardAdmin;