import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";

function DashboardInvestigador() {
  const [stats, setStats] = useState({ accuracy: [], loss: [] });

  useEffect(() => {
    const fetchStats = async () => {
      const res = await axios.get("http://localhost:4000/api/investigador/stats");
      setStats(res.data);
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1>Vista Investigador 🔬</h1>
      <Line
        data={{
          labels: stats.accuracy.map((_, i) => `Epoch ${i+1}`),
          datasets: [
            { label: "Accuracy", data: stats.accuracy, borderColor: "green" },
            { label: "Loss", data: stats.loss, borderColor: "red" }
          ]
        }}
      />
      <p>Logs de entrenamiento disponibles en consola.</p>
    </div>
  );
}

export default DashboardInvestigador;
