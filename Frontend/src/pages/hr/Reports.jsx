import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Content/Navbar";
import BackButton from "../../components/BackButton";
import "./Reports.css";

const Reports = () => {
  const token = localStorage.getItem("token");
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8081/reports/summary", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data));
  }, []);

  if (!data) {
    return <div className="reports-loading">Loading reports...</div>;
  }

  const getCount = (arr, key) =>
    arr.find((i) => i.status === key)?.count || 0;

  return (
    <>
      <Navbar />
      <div className="reports-page">
        <BackButton />
        <h2>HR Reports Dashboard</h2>

        <div className="report-grid">
          <div className="report-card">
            <h3>Total Employees</h3>
            <span>{data.employees}</span>
          </div>

          <div className="report-card">
            <h3>Attendance Today</h3>
            <p>Present: {getCount(data.attendance, "PRESENT")}</p>
            <p>Absent: {getCount(data.attendance, "ABSENT")}</p>
            <p>Leave: {getCount(data.attendance, "LEAVE")}</p>
          </div>

          <div className="report-card">
            <h3>Leave Requests</h3>
            <p>Pending: {getCount(data.leaves, "PENDING")}</p>
            <p>Approved: {getCount(data.leaves, "APPROVED")}</p>
            <p>Rejected: {getCount(data.leaves, "REJECTED")}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reports;
