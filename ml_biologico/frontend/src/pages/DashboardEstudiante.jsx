import { useEffect, useState } from "react";

import axios from "axios";

import "../styles/DashboardEstudiante.css";

function DashboardEstudiante() {

  const [imagenes, setImagenes] = useState([]);

  const [sessionTime, setSessionTime] = useState(0);

  const getImagenes = async () => {

    try {

      const res = await axios.get(
        "http://localhost:4000/api/imagenes"
      );

      setImagenes(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  const getSessionTime = async () => {

    try {

      const res = await axios.get(
        "http://localhost:4000/api/cluster/session"
      );

      setSessionTime(res.data.tiempo);

    } catch (error) {

      console.log(error);

    }

  };

  const eliminar = async (id) => {

    try {

      await axios.delete(
        `http://localhost:4000/api/imagenes/${id}`
      );

      getImagenes();

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    getImagenes();

    getSessionTime();

  }, []);

  return (

    <div className="dashboard-estudiante">

      <h1>
        Vista Estudiante 🎓
      </h1>

      <div className="cards">

        <div className="card">

          <h2>
            Tiempo de sesión del cluster
          </h2>

          <p>
            {sessionTime} minutos
          </p>

        </div>

        <div className="card">

          <h2>
            Total de imágenes
          </h2>

          <p>
            {imagenes.length}
          </p>

        </div>

      </div>

      <div className="crud-container">

        <table>

          <thead>

            <tr>
              <th>Imagen</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>

          </thead>

          <tbody>

            {
              imagenes.map((img) => (

                <tr key={img.id}>

                  <td>

                    <img
                      src={img.url}
                      alt={img.nombre}
                      width="50"
                    />

                  </td>

                  <td>
                    {img.categoria}
                  </td>

                  <td>

                    <button
                      onClick={() => eliminar(img.id)}
                    >
                      Eliminar
                    </button>

                  </td>

                </tr>

              ))
            }

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default DashboardEstudiante;