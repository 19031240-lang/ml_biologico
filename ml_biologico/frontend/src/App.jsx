import { useState } from "react";
import axios from "axios";

import "./index.css";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import DashboardInvestigador from "./pages/DashboardInvestigador";
import DashboardEstudiante from "./pages/DashboardEstudiante";

function App() {

  const token = localStorage.getItem("token");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [nombre, setNombre] = useState("");

  const [isRegister, setIsRegister] = useState(false);

  // LOGIN
  const login = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:4000/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      window.location.reload();

    } catch (error) {

      alert("Credenciales incorrectas");

    }

  };

  // REGISTER
  const register = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        "http://localhost:4000/api/auth/register",
        {
          nombre,
          email,
          password,
          id_rol: 2,
        }
      );

      alert("Cuenta creada exitosamente");

      setIsRegister(false);

    } catch (error) {

      alert("Error al registrar");

    }

  };

  // LOGOUT
  const logout = () => {

    localStorage.removeItem("token");

    window.location.reload();

  };

  // LOGIN SCREEN
  if (!token) {

    return (

      <div className="login-container">

        <div className="login-card">

          <div className="login-left">

            <img
              className="avatar"
              src="https://sii.celaya.tecnm.mx/img/logo_lince.png"
              alt=""
            />

            <h2>ML Biológico</h2>

            <p>
              Plataforma de análisis y administración
              de datasets biológicos.
            </p>

          </div>

          <div className="login-right">

            <h1>
              {
                isRegister
                  ? "Registro"
                  : "Login"
              }
            </h1>

            <form
              className="login-form"
              onSubmit={
                isRegister
                  ? register
                  : login
              }
            >

              {
                isRegister && (

                  <input
                    type="text"
                    placeholder="Nombre"
                    onChange={(e) =>
                      setNombre(e.target.value)
                    }
                  />

                )
              }

              <input
                type="email"
                placeholder="Correo"
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

              <input
                type="password"
                placeholder="Contraseña"
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

              <button type="submit">

                {
                  isRegister
                    ? "Crear cuenta"
                    : "Iniciar sesión"
                }

              </button>

              <p
                style={{
                  marginTop: "20px",
                  cursor: "pointer",
                  color: "#ddd",
                  textAlign: "center",
                }}
                onClick={() =>
                  setIsRegister(!isRegister)
                }
              >

                {
                  isRegister
                    ? "¿Ya tienes cuenta? Inicia sesión"
                    : "¿No tienes cuenta? Regístrate"
                }

              </p>

            </form>

          </div>

        </div>

      </div>

    );

  }

  // DASHBOARD
  return (

    <div className="dashboard">

      <Sidebar logout={logout} />

      <Dashboard />

    </div>

  );

}

export default App;
