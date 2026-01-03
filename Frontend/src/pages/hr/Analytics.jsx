import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell,
  BarChart, Bar, ResponsiveContainer
} from "recharts";
import Navbar from "../../components/Content/Navbar";
import BackButton from "../../components/BackButton";
import "./Analytics.css";

const COLORS = ["#00ffb3", "#00c3ff", "#ff4d4d", "#ffc107"];

const Analytics = () => {
  const token = localStorage.getItem("token");
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [payroll, setPayroll] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8081/analytics/attendance", { headers:{Authorization:`Bearer ${token}`} }).then(r=>setAttendance(r.data));
    axios.get("http://localhost:8081/analytics/leaves", { headers:{Authorization:`Bearer ${token}`} }).then(r=>setLeaves(r.data));
    axios.get("http://localhost:8081/analytics/departments", { headers:{Authorization:`Bearer ${token}`} }).then(r=>setDepartments(r.data));
    axios.get("http://localhost:8081/analytics/payroll", { headers:{Authorization:`Bearer ${token}`} }).then(r=>setPayroll(r.data));
  }, []);

  return (
    <>
      <Navbar />
      <div className="analytics-page">
        <BackButton />
        <h2>HR Analytics Dashboard</h2>

        <div className="analytics-grid">

          <div className="card">
            <h3>Attendance Trend (7 Days)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={attendance}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#00ffb3" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3>Leave Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={leaves} dataKey="count" nameKey="status" outerRadius={90}>
                  {leaves.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3>Department Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={departments}>
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#00c3ff" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3>Monthly Payroll Cost</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={payroll}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total_cost" stroke="#ffc107" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </>
  );
};

export default Analytics;
