import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Content/Navbar";
import BackButton from "../../components/BackButton";
import "./HRAttendance.css";

const HRAttendance = () => {
  const token = localStorage.getItem("token");
  const [records, setRecords] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8081/attendance/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setRecords(res.data))
      .catch((err) => console.error("HR ATTENDANCE ERROR:", err));
  }, []);

  return (
    <>
      <Navbar />
      <div className="hr-attendance-page">
        <BackButton />
        <h2>Attendance Records</h2>

        <div className="table-wrapper">
          <table className="hr-table">
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Name</th>
                <th>Date</th>
                <th>Status</th>
                <th>Check In</th>
                <th>Check Out</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td>{r.employee_id}</td>
                  <td>{r.first_name} {r.last_name}</td>
                  <td>{r.attendance_date}</td>
                  <td className={r.status.toLowerCase()}>{r.status}</td>
                  <td>{r.check_in || "—"}</td>
                  <td>{r.check_out || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default HRAttendance;
