import { useEffect, useState } from "react";
import axios from "axios";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line, Bar } from "react-chartjs-2";

import "../styles/DashboardInvestigador.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function DashboardInvestigador() {

  const [stats, setStats] = useState([]);

  useEffect(() => {

    const fetchStats = async () => {

      try {

        const res = await axios.get(
          "http://localhost:4000/api/investigador/stats"
        );

        setStats(res.data);

      } catch (error) {

        console.log(error);

      }

    };

    fetchStats();

  }, []);

  const epochs = stats.map((d) => d.Epoca);

  const lossTrain = stats.map((d) => d.Loss_Train);

  const lossVal = stats.map((d) => d.Loss_Val);

  const accuracy = stats.map((d) => d.Accuracy);

  const precision = stats.map((d) => d.Precision);

  const recall = stats.map((d) => d.Recall);

  const f1 = stats.map((d) => d.F1_Score);

  return (

    <div className="dashboard-investigador">

      <h1>
        Vista Investigador 
      </h1>

      <div className="cards">

        <div className="card">

          <h2>
            Accuracy promedio
          </h2>

          <p>
            {
              accuracy.length > 0
                ? (
                    accuracy.reduce((a, b) => a + b, 0)
                    / accuracy.length
                  ).toFixed(2)
                : 0
            }
          </p>

        </div>

        <div className="card">

          <h2>
            Loss Train promedio
          </h2>

          <p>
            {
              lossTrain.length > 0
                ? (
                    lossTrain.reduce((a, b) => a + b, 0)
                    / lossTrain.length
                  ).toFixed(2)
                : 0
            }
          </p>

        </div>

        <div className="card">

          <h2>
            Loss Val promedio
          </h2>

          <p>
            {
              lossVal.length > 0
                ? (
                    lossVal.reduce((a, b) => a + b, 0)
                    / lossVal.length
                  ).toFixed(2)
                : 0
            }
          </p>

        </div>

      </div>

      <div className="chart-container">

        <Line
          data={{
            labels: epochs,
            datasets: [
              {
                label: "Loss Train",
                data: lossTrain,
                borderColor: "#1f4d3a",
              },
              {
                label: "Loss Val",
                data: lossVal,
                borderColor: "#006699",
              },
            ],
          }}
        />

      </div>

      <div className="chart-container">

        <Line
          data={{
            labels: epochs,
            datasets: [
              {
                label: "Accuracy",
                data: accuracy,
                borderColor: "#79c8c0",
              },
            ],
          }}
        />

      </div>

      <div className="chart-container">

        <Bar
          data={{
            labels: epochs,
            datasets: [
              {
                label: "Precision",
                data: precision,
                backgroundColor: "#1f4d3a",
              },
              {
                label: "Recall",
                data: recall,
                backgroundColor: "#006699",
              },
              {
                label: "F1 Score",
                data: f1,
                backgroundColor: "#79c8c0",
              },
            ],
          }}
        />

      </div>

      <p className="logs">
        Logs de entrenamiento disponibles en consola.
      </p>

    </div>

  );

}

export default DashboardInvestigador;