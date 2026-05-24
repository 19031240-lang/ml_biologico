import { useState } from "react";
import axios from "axios";

function Register() {

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("estudiante");

  const register = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        "http://localhost:4000/api/auth/register",
        {
          nombre,
          email,
          password,
          rol,
        }
      );

      alert("Usuario creado");

      window.location.href = "/";

    } catch (error) {

      console.log(error);

      alert("Error al registrar");

    }

  };

  return (

    <div className="login-container">

      <div className="login-card">

        <div className="login-left">

          <img
            src="https://sii.celaya.tecnm.mx/img/logo_lince.png"
            alt=""
            className="logo"
          />

          <h2>
            Registro
          </h2>

          <p>
            Crear nueva cuenta
          </p>

        </div>

        <div className="login-right">

          <h1>
            Register
          </h1>

          <form onSubmit={register}>

            <input
              type="text"
              placeholder="Nombre"
              onChange={(e) =>
                setNombre(e.target.value)
              }
            />

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

            <select
              onChange={(e) =>
                setRol(e.target.value)
              }
            >

              <option value="estudiante">
                Estudiante
              </option>

              <option value="investigador">
                Investigador
              </option>

            </select>

            <button type="submit">
              Crear cuenta
            </button>

          </form>

        </div>

      </div>

    </div>

  );

}

export default Register;