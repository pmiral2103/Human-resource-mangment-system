import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "./components/login-signup/login";
import ProtectedRoute from "./routes/ProtectedRoutes";
import Unauthorized from "./routes/Unauthorised";
import Dashboard from "./pages/employee/EmployeeDashboard";
import HRDashboard from "./pages/hr/HRDashboard";
import Profile from "./pages/Profile";
import Attendance from "./pages/employee/Attendance";
import Leave from "./pages/employee/Leave";
import LeaveApprovals from "./pages/hr/LeaveApprovals";
import Payroll from "./pages/employee/Payroll";
import Employees from "./pages/hr/Employees";
import Reports from "./pages/hr/Reports";
import HRAttendance from "./pages/hr/HRAttendance";
import HRPayroll from "./pages/hr/HRPayroll";
import AddPayroll from "./pages/hr/AddPayroll";
import Analytics from "./pages/hr/Analytics";
import ResetPassword from "./pages/auth/ResetPassword";


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYEE", "HR", "ADMIN"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          import HRDashboard from "./pages/hr/HRDashboard";
          <Route
            path="/hr/dashboard"
            element={
              <ProtectedRoute allowedRoles={["HR", "ADMIN"]}>
                <HRDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYEE", "HR", "ADMIN"]}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
                <Attendance />
              </ProtectedRoute>
            }
          />
          <Route
  path="/reset-password/:token"
  element={<ResetPassword />}
/>

          <Route
            path="/leave"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
                <Leave />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/leaves"
            element={
              <ProtectedRoute allowedRoles={["HR", "ADMIN"]}>
                <LeaveApprovals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/salary"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
                <Payroll />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/employees"
            element={
              <ProtectedRoute allowedRoles={["HR", "ADMIN"]}>
                <Employees />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/reports"
            element={
              <ProtectedRoute allowedRoles={["HR", "ADMIN"]}>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
  path="/hr/analytics"
  element={
    <ProtectedRoute allowedRoles={["HR", "ADMIN"]}>
      <Analytics />
    </ProtectedRoute>
  }
/>

          <Route
            path="/hr/payroll"
            element={
              <ProtectedRoute allowedRoles={["HR", "ADMIN"]}>
                <HRPayroll />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/attendance"
            element={
              <ProtectedRoute allowedRoles={["HR", "ADMIN"]}>
                <HRAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/add-payroll"
            element={
              <ProtectedRoute allowedRoles={["HR", "ADMIN"]}>
                <AddPayroll />
              </ProtectedRoute>
            }
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </Router>
    </>
  );
}
export default App;
