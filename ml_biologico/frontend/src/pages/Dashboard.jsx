import DashboardInvestigador from "./DashboardInvestigador";
import DashboardEstudiante from "./DashboardEstudiante";

function Dashboard({ rol }) {
  return (
    <div>
      {rol === "investigador" ? (
        <DashboardInvestigador />
      ) : (
        <DashboardEstudiante />
      )}
    </div>
  );
}

export default Dashboard;
