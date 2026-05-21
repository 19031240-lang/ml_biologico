import { useEffect, useState } from "react";
import axios from "axios";

function DashboardEstudiante() {
  const [imagenes, setImagenes] = useState([]);
  const [sessionTime, setSessionTime] = useState(0);

  const getImagenes = async () => {
    const res = await axios.get("http://localhost:4000/api/imagenes");
    setImagenes(res.data);
  };

  const getSessionTime = async () => {
    const res = await axios.get("http://localhost:4000/api/cluster/session");
    setSessionTime(res.data.tiempo); // Ejemplo: { tiempo: 120 }
  };

  const eliminar = async (id) => {
    await axios.delete(`http://localhost:4000/api/imagenes/${id}`);
    getImagenes();
  };

  useEffect(() => { 
    getImagenes(); 
    getSessionTime(); 
  }, []);

  return (
    <div>
      <h1>Vista Estudiante 🎓</h1>

      <div className="card">
        <h2>Tiempo de sesión del cluster</h2>
        <p>{sessionTime} minutos</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {imagenes.map(img => (
            <tr key={img.id}>
              <td><img src={img.url} alt={img.nombre} width="50"/></td>
              <td>{img.categoria}</td>
              <td>
                <button onClick={() => eliminar(img.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DashboardEstudiante;
