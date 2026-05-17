import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {

  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    datasets: 0,
    imagenes: 0,
    usuarios: 0,
  });

  const [datasets, setDatasets] = useState([]);

  // STATS
  const getStats = async () => {

    try {

      const res = await axios.get(
        "http://localhost:4000/api/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  // DATASETS
  const getDatasets = async () => {

    try {

      const res = await axios.get(
        "http://localhost:4000/api/datasets",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDatasets(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    getStats();
    getDatasets();

  }, []);

  return (

    <div className="dashboard-content">

      <h1>
        Dashboard ML Biológico 🚀
      </h1>

      {/* CARDS */}
      <div className="cards">

        <div className="card">
          <h2>Datasets</h2>
          <p>{stats.datasets}</p>
        </div>

        <div className="card">
          <h2>Imágenes</h2>
          <p>{stats.imagenes}</p>
        </div>

        <div className="card">
          <h2>Usuarios</h2>
          <p>{stats.usuarios}</p>
        </div>

      </div>

      {/* DATASETS */}
      <h2 className="section-title">
        Datasets
      </h2>

      <div className="dataset-grid">

        {
          datasets.map((dataset) => (

            <div
              className="dataset-card"
              key={dataset.id_dataset}
            >

              {
                dataset.imagen ? (

                 <img
                    src={`http://localhost:4000/uploads/${dataset.imagen}`}
                    alt=""
                    className="dataset-image"
                />

                ) : (

                  <div className="no-image">
                    Sin imagen
                  </div>

                )
              }

              <div className="dataset-info">

                <h3>
                  {dataset.nombre}
                </h3>

                <p>
                  {dataset.descripcion}
                </p>

                <button>
                  Ver más
                </button>

              </div>

            </div>

          ))
        }

      </div>

    </div>

  );

}

export default Dashboard;