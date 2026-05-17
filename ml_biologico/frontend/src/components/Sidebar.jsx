import {
  FaChartPie,
  FaDatabase,
  FaImage,
  FaRobot,
  FaUsers,
} from "react-icons/fa";

function Sidebar({ logout }) {

  return (

    <div className="sidebar">

      <h2>ML Bio</h2>

      <ul>

        <li>
          <FaChartPie className="icon" />
          Dashboard
        </li>

        <li>
          <FaDatabase className="icon" />
          Datasets
        </li>

        <li>
          <FaImage className="icon" />
          Imágenes
        </li>

        <li>
          <FaRobot className="icon" />
          Modelos
        </li>

        <li>
          <FaUsers className="icon" />
          Usuarios
        </li>

      </ul>

      <button onClick={logout}>
        Cerrar sesión
      </button>

    </div>

  );

}

export default Sidebar;