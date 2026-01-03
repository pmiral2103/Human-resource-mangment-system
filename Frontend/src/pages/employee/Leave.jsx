import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Content/Navbar";
import BackButton from "../../components/BackButton";
import "./Leave.css";

const Leave = () => {
  const token = localStorage.getItem("token");
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState("");

  const fetchLeaves = () => {
    axios
      .get("http://localhost:8081/leave/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setLeaves(res.data));
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const applyLeave = () => {
   axios.post(
  "http://localhost:8081/leave/apply",
  form,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
    .then((res) => {
      setMsg(res.data.message);
      fetchLeaves(); // 🔥 auto refresh
    });
  };

  return (
    <>
      <Navbar />
      <div className="leave-page">
        <BackButton />
        <h2 style={{ marginTop: "20px" }}>Apply Leave</h2>

        <div className="leave-form">
          <select onChange={(e) => setForm({ ...form, leave_type: e.target.value })}>
            <option value="">Leave Type</option>
            <option value="PAID">Paid</option>
            <option value="SICK">Sick</option>
            <option value="UNPAID">Unpaid</option>
          </select>

          <input type="date" onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
          <input type="date" onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
          <textarea placeholder="Reason" onChange={(e) => setForm({ ...form, reason: e.target.value })} />

          <button onClick={applyLeave}>Apply</button>
        </div>

        {msg && <p className="msg">{msg}</p>}

        <h3>My Leave Requests</h3>

        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Dates</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((l) => (
              <tr key={l.id}>
                <td>{l.leave_type}</td>
                <td>{l.start_date} → {l.end_date}</td>
                <td className={l.status.toLowerCase()}>{l.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Leave;
