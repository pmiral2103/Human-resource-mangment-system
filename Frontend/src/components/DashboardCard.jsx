import "./Content/Styles/DashboardCard.css";

const DashboardCard = ({ title, icon, onClick }) => {
  return (
    <div className="dashboard-card" onClick={onClick}>
      <div className="dashboard-icon">{icon}</div>
      <h5>{title}</h5>
    </div>
  );
};

export default DashboardCard;
