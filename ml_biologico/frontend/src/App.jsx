import { useState } from "react";
import axios from "axios";
import API_URL from "./api";

import "./index.css";

import Sidebar from "./components/Sidebar";
import DashboardAdmin        from "./pages/DashboardAdmin";
import DashboardInvestigador from "./pages/DashboardInvestigador";
import DashboardEstudiante   from "./pages/DashboardEstudiante";

function App() {

  const token   = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const rol     = Number(usuario?.id_rol);

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [nombre,   setNombre]   = useState("");
  const [isRegister, setIsRegister] = useState(false);

  // Sección activa del menú
  const [seccion, setSeccion] = useState("inicio");

  // ── LOGIN ──
  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("token",   res.data.token);
      localStorage.setItem("usuario", JSON.stringify(res.data.user));
      window.location.reload();
    } catch {
      alert("Credenciales incorrectas");
    }
  };

  // ── REGISTER ──
  const register = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/auth/register`, {
        nombre,
        email,
        password,
        id_rol: 3, // por defecto estudiante; admin asigna el rol después
      });
      alert("Cuenta creada exitosamente");
      setIsRegister(false);
    } catch {
      alert("Error al registrar");
    }
  };

  // ── LOGOUT ──
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.reload();
  };

  // ── PANTALLA DE LOGIN ──
  if (!token) {
    return (
      <div className="login-container">
        <div className="login-card">

          <div className="login-left">
            <img
              className="avatar"
              src="/crode.jpg"
              alt=""
            />
            <h2>ML Biológico</h2>
            <p>Plataforma de análisis y administración de datasets biológicos.</p>
          </div>

          <div className="login-right">
            <h1>{isRegister ? "Registro" : "Login"}</h1>

            <form
              className="login-form"
              onSubmit={isRegister ? register : login}
            >
              {isRegister && (
                <input
                  type="text"
                  placeholder="Nombre"
                  onChange={(e) => setNombre(e.target.value)}
                />
              )}
              <input
                type="email"
                placeholder="Correo"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Contraseña"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit">
                {isRegister ? "Crear cuenta" : "Iniciar sesión"}
              </button>

              <p
                style={{ marginTop: "20px", cursor: "pointer", color: "#ddd", textAlign: "center" }}
                onClick={() => setIsRegister(!isRegister)}
              >
                {isRegister
                  ? "¿Ya tienes cuenta? Inicia sesión"
                  : "¿No tienes cuenta? Regístrate"}
              </p>
            </form>
          </div>

        </div>
      </div>
    );
  }

  // ── CONTENIDO SEGÚN ROL Y SECCIÓN ──
  const renderContenido = () => {
    if (rol === 1) return <DashboardAdmin        seccion={seccion} />;
    if (rol === 2) return <DashboardInvestigador seccion={seccion} />;
    if (rol === 3) return <DashboardEstudiante seccion={seccion} setSeccion={setSeccion} />
    return <h1 style={{ padding: 40 }}>Sin permisos</h1>;
  };

  return (
    <div className="dashboard">
      <Sidebar
        logout={logout}
        seccion={seccion}
        setSeccion={setSeccion}
        rol={rol}
      />
      {renderContenido()}
    </div>
  );
}

export default App;
