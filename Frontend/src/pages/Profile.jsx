import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Content/Navbar";
import "./Profile.css";
import { useNavigate } from "react-router-dom";


const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const navigate = useNavigate();

const handleBack = () => {
  const role = localStorage.getItem("role");
  if (role === "HR" || role === "ADMIN") {
    navigate("/hr/dashboard");
  } else {
    navigate("/dashboard");
  }
};

  useEffect(() => {
    axios
      .get("http://localhost:8081/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfile(res.data);
        setFormData(res.data);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = () => {
    const payload = new FormData();
    Object.keys(formData).forEach((key) =>
      payload.append(key, formData[key])
    );

    axios
      .put("http://localhost:8081/auth/profile", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => alert("Profile updated successfully"));
  };

  if (loading) return <div className="profile-loading">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="profile-card">
            <div className="profile-back" onClick={handleBack}>
  ← Back
</div>

          <div className="profile-header">
            

            <div className="header-info">
              <h2>
                {profile.first_name} {profile.last_name}
              </h2>
              <p>{profile.designation}</p>
              <span className="role-chip">{profile.role}</span>
            </div>
          </div>

          <div className="profile-form">
            <div className="field">
              <label>Employee ID</label>
              <input value={profile.employee_id} disabled />
            </div>

            <div className="field">
              <label>Email</label>
              <input value={profile.email} disabled />
            </div>

            <div className="field">
              <label>Phone</label>
              <input
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>First Name</label>
              <input
                name="first_name"
                value={formData.first_name || ""}
                disabled={role === "EMPLOYEE"}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Last Name</label>
              <input
                name="last_name"
                value={formData.last_name || ""}
                disabled={role === "EMPLOYEE"}
                onChange={handleChange}
              />
            </div>

            {role !== "EMPLOYEE" && (
              <>
                <div className="field">
                  <label>Department</label>
                  <input
                    name="department"
                    value={formData.department || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label>Designation</label>
                  <input
                    name="designation"
                    value={formData.designation || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label>Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="EMPLOYEE">Employee</option>
                    <option value="HR">HR</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="profile-actions">
            <button className="save-btn" onClick={handleSubmit}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
