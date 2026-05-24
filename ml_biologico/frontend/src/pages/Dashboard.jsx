import DashboardInvestigador from "./DashboardInvestigador";
import DashboardEstudiante from "./DashboardEstudiante";
import DashboardAdmin from "./DashboardAdmin"; 

function Dashboard() {

  const usuario = JSON.parse(
    localStorage.getItem("usuario")
  );

  const rol = Number(usuario?.id_rol);

  // ADMIN
  if (rol === 1) {
    return <DashboardAdmin />;
  }

  // INVESTIGADOR
  if (rol === 2) {

    return <DashboardInvestigador />;

  }

  // ESTUDIANTE
  if (rol === 3) {

    return <DashboardEstudiante />;

  }

  return (

    <h1>
      Sin permisos
    </h1>

  );

}

export default Dashboard;