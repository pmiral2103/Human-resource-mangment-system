import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Content/Navbar";
import BackButton from "../../components/BackButton";
import "./Payroll.css";

const Payroll = () => {
  const token = localStorage.getItem("token");
  const [payroll, setPayroll] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8081/payroll/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPayroll(res.data));
  }, []);

  return (
    <>
      <Navbar />
      <div className="payroll-page">
        <BackButton />
        <h2>My Payroll</h2>

        {payroll.length === 0 ? (
          <p className="empty">No payroll records available</p>
        ) : (
          <div className="payroll-grid">
            {payroll.map((p, i) => (
              <div className="payroll-card" key={i}>
                <h3>{p.month}</h3>

                <div className="salary-row">
                  <span>Base Salary</span>
                  <span>₹ {p.base_salary}</span>
                </div>

                <div className="salary-row">
                  <span>Allowances</span>
                  <span>₹ {p.allowances}</span>
                </div>

                <div className="salary-row">
                  <span>Deductions</span>
                  <span className="deduction">- ₹ {p.deductions}</span>
                </div>

                <div className="salary-row net">
                  <span>Net Salary</span>
                  <span>₹ {p.net_salary}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Payroll;
