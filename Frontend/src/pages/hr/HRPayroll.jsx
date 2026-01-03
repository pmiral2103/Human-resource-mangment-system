import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Content/Navbar";
import BackButton from "../../components/BackButton";
import "./HRPayroll.css";

const HRPayroll = () => {
  const token = localStorage.getItem("token");
  const [payroll, setPayroll] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8081/payroll/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPayroll(res.data))
      .catch((err) => console.error("HR PAYROLL ERROR:", err));
  }, []);

  return (
    <>
      <Navbar />
      <div className="hr-payroll-page">
        <BackButton />
        <h2>Payroll Overview</h2>

        <div className="table-wrapper">
          <table className="hr-table">
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Name</th>
                <th>Month</th>
                <th>Base</th>
                <th>Allowances</th>
                <th>Deductions</th>
                <th>Net</th>
              </tr>
            </thead>
            <tbody>
              {payroll.map((p) => (
                <tr key={p.id}>
                  <td>{p.employee_id}</td>
                  <td>{p.first_name} {p.last_name}</td>
                  <td>{p.month}</td>
                  <td>₹ {p.base_salary}</td>
                  <td>₹ {p.allowances}</td>
                  <td className="deduction">- ₹ {p.deductions}</td>
                  <td className="net">₹ {p.net_salary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default HRPayroll;
