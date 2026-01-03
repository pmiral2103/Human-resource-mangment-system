import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Content/Navbar";
import "./Attendance.css";
import BackButton from "../../components/BackButton";

const Attendance = () => {
  const token = localStorage.getItem("token");
  const [today, setToday] = useState(null);
  const [message, setMessage] = useState("");

  const fetchTodayAttendance = () => {
    axios
      .get("http://localhost:8081/attendance/me/today", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setToday(res.data));
  };

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  const checkIn = () => {
    axios
      .post(
        "http://localhost:8081/attendance/checkin",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setMessage(res.data.message);
        fetchTodayAttendance();
      });
  };

  const checkOut = () => {
    axios
      .post(
        "http://localhost:8081/attendance/checkout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setMessage(res.data.message);
        fetchTodayAttendance();
      });
  };

  return (
    <>
      <Navbar />
      <div className="attendance-page">
        <BackButton />
        <h2 style={{ marginTop: "20px" }}>Today’s Attendance</h2>

        {today ? (
          <div className="attendance-card">
            <p>Status: {today.status}</p>
            <p>Check-In: {today.check_in || "—"}</p>
            <p>Check-Out: {today.check_out || "—"}</p>
          </div>
        ) : (
          <p>No attendance marked today</p>
        )}

        <div className="attendance-actions">
          <button onClick={checkIn} disabled={!!today}>
            Check In
          </button>
          <button onClick={checkOut} disabled={!today || today.check_out}>
            Check Out
          </button>
        </div>

        {message && <p className="attendance-msg">{message}</p>}
      </div>
    </>
  );
};

export default Attendance;
