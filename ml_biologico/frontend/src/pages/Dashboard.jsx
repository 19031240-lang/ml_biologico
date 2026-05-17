import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {

  const [stats, setStats] = useState({
    datasets: 0,
    imagenes: 0,
    usuarios: 0,
  });

  const token = localStorage.getItem("token");

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

  useEffect(() => {

    getStats();

  }, []);

  return (

    <div className="dashboard-content">

      <h1>
        Dashboard ML Biológico 🚀
      </h1>

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

    </div>

  );

}

export default Dashboard;