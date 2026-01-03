import { useNavigate } from "react-router-dom";
import "./BackButton.css";

const BackButton = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleBack = () => {
    if (role === "HR" || role === "ADMIN") {
      navigate("/hr/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="back-btn" onClick={handleBack}>
      ← Back
    </div>
  );
};

export default BackButton;
