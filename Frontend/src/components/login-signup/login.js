import React, { useState } from "react";

import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ForgotPass from "./ForgotPass";
import Navbar from "../Content/Navbar";
import "../Content/Styles/theme.css";

const AuthForm = () => {
  const navigate = useNavigate();
  const [errorModalShow, setErrorModalShow] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [forgotPassOpen, setForgotPassOpen] = useState(false);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    if (isLogin) {
      let dataObject = {
        email: formData.get("email"),
        password: formData.get("password"),
      };
      axios
        .post("http://localhost:8081/auth/login", dataObject)
        .then((res) => {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("role", res.data.user.role);
          localStorage.setItem("user_id", res.data.user.id);
          console.log(res.data.user.role);
          if(res.data.user.role === "HR") {
            navigate("/hr/dashboard");
          }else{
            navigate("/dashboard");
          }
          
        })
        .catch(() => {
          setErrorModalShow(true);
        });
    } else {
      axios
        .post("http://localhost:8081/auth/register", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(() => {
          setIsLogin(true); // redirect to login after signup
        })
        .catch(() => {
          setErrorModalShow(true);
        });
    }
  };

  return (
    <>
      <Navbar />
      <Modal show={errorModalShow}>
        <Modal.Header>
          <div>Error....</div>
          <div>
            <button
              type="button"
              to="/"
              onClick={() => {
                setErrorModalShow(false);
              }}
              className="btn btn-light"
            >
              X
            </button>
          </div>
        </Modal.Header>
        <Modal.Body>Invalid Credentials.</Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            to="/"
            onClick={() => {
              setErrorModalShow(false);
            }}
            className="btn btn-outline-danger"
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
      <ForgotPass
        show={forgotPassOpen}
        onClose={() => setForgotPassOpen(false)}
      />
      <div
        className="auth-wrapper"
        style={{ display: forgotPassOpen ? "none" : "flex" }}
      >
        <div className="auth-card">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${isLogin ? "active" : ""}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`auth-tab ${!isLogin ? "active" : ""}`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" id="login">
            {!isLogin && (
              <>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Employee ID</label>
                    <input
                      type="text"
                      name="employee_id"
                      className="form-control"
                      placeholder="EMP001"
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Role</label>
                    <select name="role" className="form-select" required>
                      <option value="EMPLOYEE">Employee</option>
                      <option value="HR">HR</option>
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Department</label>
                    <input
                      type="text"
                      name="department"
                      className="form-control"
                      placeholder="Engineering / HR / Sales"
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Designation</label>
                    <input
                      type="text"
                      name="designation"
                      className="form-control"
                      placeholder="Software Engineer"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    required
                  />
                </div>

                
              </>
            )}

            {isLogin && (
              <>
                <div className="mb-3 ">
                  <label
                    htmlFor="exampleFormControlInput1"
                    className="form-label"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Email Address"
                    required
                  />
                </div>
                <div style={{ margin: "2px", height: "68px" }}>
                  <label
                    htmlFor="exampleFormControlInput1"
                    className="form-label"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="Password"
                    name="password"
                    placeholder="Password"
                    required
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <div style={{ display: "flex", justifyContent: "end" }}>
                    <button
                      type="button"
                      className="btn btn-outline-danger no-focus"
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        color: "red",
                      }}
                      onClick={() => {
                        setForgotPassOpen(true);
                      }}
                    >
                      Forgot Password!
                    </button>
                  </div>
                </div>
              </>
            )}
            <button type="submit" className="auth-submit">
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AuthForm;
