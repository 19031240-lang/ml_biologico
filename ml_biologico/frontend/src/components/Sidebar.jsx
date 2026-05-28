import {
  FaChartPie,
  FaDatabase,
  FaImage,
  FaRobot,
  FaUsers,
  FaServer,
  FaGraduationCap,
  FaTrophy,
  FaBook,
  FaChartLine,
  FaBrain,
} from "react-icons/fa";

function Sidebar({ logout, seccion, setSeccion, rol }) {

  const itemsAdmin = [
    { id: "inicio",     icon: <FaChartPie className="icon" />, label: "Dashboard"  },
    { id: "usuarios",   icon: <FaUsers    className="icon" />, label: "Usuarios"   },
    { id: "datasets",   icon: <FaDatabase className="icon" />, label: "Datasets"   },
    { id: "imagenes",   icon: <FaImage    className="icon" />, label: "Imágenes"   },
    { id: "tutoriales", icon: <FaBook     className="icon" />, label: "Tutoriales" },
    { id: "cluster",    icon: <FaServer   className="icon" />, label: "Cluster"    },
  ];

  const itemsInvestigador = [
    { id: "inicio",   icon: <FaChartPie className="icon" />, label: "Dashboard" },
    { id: "datasets", icon: <FaDatabase className="icon" />, label: "Datasets"  },
    { id: "imagenes", icon: <FaImage    className="icon" />, label: "Imágenes"  },
    { id: "modelos",  icon: <FaRobot    className="icon" />, label: "Modelos"   },
    { id: "cluster",  icon: <FaServer   className="icon" />, label: "Cluster"   },
  ];

  const itemsEstudiante = [
    { id: "inicio",        icon: <FaChartLine       className="icon" />,  label: "Inicio"       },
    { id: "tutoriales",    icon: <FaBook           className="icon" />,  label: "Tutoriales"    },
    { id: "entrenamiento", icon: <FaBrain          className="icon" />,  label: "Entrenamiento" },
    { id: "progreso",      icon: <FaGraduationCap  className="icon" />,  label: "Progreso"      },
    { id: "logros",        icon: <FaTrophy         className="icon" />,  label: "Logros"        },
  ];

  const items =
    rol === 1 ? itemsAdmin :
    rol === 2 ? itemsInvestigador :
    itemsEstudiante;

  return (
    <div className="sidebar">
      <h2>ML Bio 🌿</h2>
      <ul>
        {items.map((item) => (
          <li
            key={item.id}
            className={seccion === item.id ? "sidebar-active" : ""}
            onClick={() => setSeccion(item.id)}
          >
            {item.icon}
            {item.label}
          </li>
        ))}
      </ul>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}

export default Sidebar;