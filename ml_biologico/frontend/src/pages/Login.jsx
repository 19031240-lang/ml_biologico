import { useState } from "react";
import axios from "axios";
import "../styles/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

      localStorage.setItem("token", res.data.token);

      window.location.reload();

    } catch (error) {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="login-container">

      <div className="login-card">

        {/* IZQUIERDA */}
        <div className="login-left">

          <img
            src="https://sii.celaya.tecnm.mx/img/logo_lince.png"
            alt="Logo"
            className="logo"
          />

          <div className="image-container">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
              alt="IA"
              className="main-image"
            />
          </div>

          <h2>ML Biológico</h2>
          <p>
            Plataforma de análisis y administración
            de datasets biológicos.
          </p>

        </div>

        {/* DERECHA */}
        <div className="login-right">

          <h1>Login</h1>

          <form onSubmit={login}>

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
              Iniciar sesión
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Login;