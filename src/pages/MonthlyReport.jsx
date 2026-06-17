import Sidebar from "../components/Sidebar";

function MonthlyReport() {
  return (
    <div className="dashboard-layout">

      <Sidebar />

      <div className="main-content">

        <h1>
          Monthly Report
        </h1>

        <p>
          Monthly expense
          analysis page.
        </p>

      </div>

    </div>
  );
}

export default MonthlyReport;