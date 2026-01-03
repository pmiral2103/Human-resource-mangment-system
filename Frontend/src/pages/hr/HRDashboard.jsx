import { useNavigate } from "react-router-dom";
import DashboardCard from "../../components/DashboardCard";
import Navbar from "../../components/Content/Navbar";
import "./HRDashboard.css";

const HRDashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="hr-dashboard">
        <h2 className="dashboard-title">HR Dashboard</h2>

        <div className="dashboard-grid">
          <DashboardCard
            title="Manage Employees"
            icon="👥"
            onClick={() => navigate("/hr/employees")}
          />

          <DashboardCard
            title="Attendance Records"
            icon="🕒"
            onClick={() => navigate("/hr/attendance")}
          />

          <DashboardCard
            title="Leave Approvals"
            icon="📝"
            onClick={() => navigate("/hr/leaves")}
          />

          <DashboardCard
            title="Payroll Overview"
            icon="💰"
            onClick={() => navigate("/hr/payroll")}
          />

          <DashboardCard
            title="Add Payroll"
            icon="💸"
            onClick={() => navigate("/hr/add-payroll")}
          />
          <DashboardCard
  title="Analytics"
  icon="📊"
  onClick={() => navigate("/hr/analytics")}
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

export default HRDashboard;
