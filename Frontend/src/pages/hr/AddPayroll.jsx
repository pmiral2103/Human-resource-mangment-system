import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Content/Navbar";
import BackButton from "../../components/BackButton";
import "./AddPayroll.css";

const AddPayroll = () => {
  const token = localStorage.getItem("token");
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8081/hr/employees", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEmployees(res.data));
  }, []);

  const handleSubmit = () => {
    if (!form.user_id || !form.month || !form.base_salary) {
      alert("Please fill all required fields");
      return;
    }

axios
  .post("http://localhost:8081/hr/payroll", form, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
  .then((res) => {
        setMsg(res.data.message);
        setForm({});
      })
      .catch((err) => {
        console.error("ADD PAYROLL ERROR:", err);
      });
  };

  return (
    <>
      <Navbar />
      <div className="add-payroll-page">
        <BackButton />
        <h2>Add Payroll</h2>

        <div className="payroll-form">
          <select
            value={form.user_id || ""}
            onChange={(e) => setForm({ ...form, user_id: e.target.value })}
          >
            <option value="">Select Employee</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.employee_id} - {e.first_name} {e.last_name}
              </option>
            ))}
          </select>

          <input
            type="month"
            value={form.month || ""}
            onChange={(e) => setForm({ ...form, month: e.target.value })}
          />

          <input
            type="number"
            placeholder="Base Salary"
            value={form.base_salary || ""}
            onChange={(e) =>
              setForm({ ...form, base_salary: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Allowances"
            value={form.allowances || ""}
            onChange={(e) =>
              setForm({ ...form, allowances: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Deductions"
            value={form.deductions || ""}
            onChange={(e) =>
              setForm({ ...form, deductions: e.target.value })
            }
          />

          <button onClick={handleSubmit}>Save Payroll</button>

          {msg && <p className="success">{msg}</p>}
        </div>
      </div>
    </>
  );
};

export default AddPayroll;
