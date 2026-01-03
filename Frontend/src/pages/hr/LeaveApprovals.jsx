import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Content/Navbar";
import BackButton from "../../components/BackButton";
import "./LeaveApprovals.css";

const LeaveApprovals = () => {
  const token = localStorage.getItem("token");
  const [leaves, setLeaves] = useState([]);

  const fetchLeaves = () => {
    axios
      .get("http://localhost:8081/leave/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setLeaves(res.data));
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const updateStatus = (id, status) => {
    axios
      .put(
        `http://localhost:8081/leave/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(fetchLeaves); // 🔥 auto refresh
  };

  return (
    <>
      <Navbar />
      <div className="leave-approval-page">
  <BackButton />
  <h2>Leave Approvals</h2>

  <div className="leave-table-wrapper">
    <table className="leave-table">
      <thead>...</thead>
      <tbody>
        {leaves.map((l) => (
          <tr key={l.id}>
            <td className="employee-cell">
              {l.first_name} {l.last_name}
            </td>
            <td>{l.leave_type}</td>
            <td className="date-range">
              {l.start_date} → {l.end_date}
            </td>
            <td>
              <span className={`status ${l.status.toLowerCase()}`}>
                {l.status}
              </span>
            </td>
            <td className="action-buttons">
              <button
                className="approve-btn"
                onClick={() => updateStatus(l.id, "APPROVED")}
                disabled={l.status !== "PENDING"}
              >
                Approve
              </button>
              <button
                className="reject-btn"
                onClick={() => updateStatus(l.id, "REJECTED")}
                disabled={l.status !== "PENDING"}
              >
                Reject
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

    </>
  );
};

export default LeaveApprovals;
