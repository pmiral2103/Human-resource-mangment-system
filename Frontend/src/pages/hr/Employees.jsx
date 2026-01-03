import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Content/Navbar";
import BackButton from "../../components/BackButton";
import "./Employees.css";

const Employees = () => {
  const token = localStorage.getItem("token");
  const [employees, setEmployees] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const fetchEmployees = () => {
    axios
      .get("http://localhost:8081/hr/employees", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEmployees(res.data));
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const startEdit = (emp) => {
    setEditing(emp.id);
    setForm(emp);
  };

  const saveEdit = () => {
  axios
    .put(`http://localhost:8081/hr/employees/${editing}`, form, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => {
      setEditing(null);
      fetchEmployees();
    })
    .catch((err) => {
      console.error("EDIT EMPLOYEE ERROR:", err.response?.data || err);
    });
};


  return (
    <>
      <Navbar />
      <div className="employee-page">
        <BackButton />
        <h2>Employee Management</h2>

        <div className="employee-table-wrapper">
          <table className="employee-table">
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((e) => (
                <tr key={e.id}>
                  <td>{e.employee_id}</td>
                  <td>
                    {e.first_name} {e.last_name}
                  </td>
                  <td>{e.email}</td>

                  <td>
                    {editing === e.id ? (
                      <select
                        value={form.role}
                        onChange={(ev) =>
                          setForm({ ...form, role: ev.target.value })
                        }
                      >
                        <option value="EMPLOYEE">EMPLOYEE</option>
                        <option value="HR">HR</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    ) : (
                      e.role
                    )}
                  </td>

                  <td>
                    {editing === e.id ? (
                      <input
                        value={form.department || ""}
                        onChange={(ev) =>
                          setForm({ ...form, department: ev.target.value })
                        }
                      />
                    ) : (
                      e.department
                    )}
                  </td>

                  <td>
                    {editing === e.id ? (
                      <select
                        value={form.status}
                        onChange={(ev) =>
                          setForm({ ...form, status: ev.target.value })
                        }
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                      </select>
                    ) : (
                      <span className={`status ${e.status.toLowerCase()}`}>
                        {e.status}
                      </span>
                    )}
                  </td>

                  <td>
                    {editing === e.id ? (
                      <button className="save-btn" onClick={saveEdit}>
                        Save
                      </button>
                    ) : (
                      <button className="edit-btn" onClick={() => startEdit(e)}>
                        Edit
                      </button>
                    )}
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

export default Employees;
