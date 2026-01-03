import { useNavigate } from "react-router-dom";
import DashboardCard from "../../components/DashboardCard";
import Navbar from "../../components/Content/Navbar";
import "./EmployeeDashboard.css"

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="employee-dashboard">
        <h2 className="dashboard-title">Employee Dashboard</h2>

        <div className="dashboard-grid">
          <DashboardCard
            title="My Profile"
            icon="👤"
            onClick={() => navigate("/profile")}
          />
          <DashboardCard
            title="Attendance"
            icon="🕒"
            onClick={() => navigate("/attendance")}
          />
          <DashboardCard
            title="Apply Leave"
            icon="📝"
            onClick={() => navigate("/leave")}
          />
          <DashboardCard
            title="My Salary"
            icon="📊"
            onClick={() => navigate("/salary")}
          />
          <DashboardCard
            title="Logout"
            icon="🚪"
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          />
        </div>
      </div>
    </>
  );
};

export default EmployeeDashboard;
