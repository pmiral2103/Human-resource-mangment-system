# Dayflow – Human Resource Management System (HRMS)

Dayflow is a full-stack **Human Resource Management System (HRMS)** built to automate and streamline core HR operations such as employee management, attendance tracking, leave management, payroll processing, authentication, and analytics.

The project is designed to reflect **real-world HR workflows**, focusing on security, role-based access, and scalable architecture.

---

## 🚀 Features

### 🔐 Authentication & Security
- JWT-based authentication
- Secure password hashing using bcrypt
- Role-based access control (Employee / HR / Admin)
- Forgot Password with email-based reset link (time-bound & secure)

---

### 👤 Employee Module
- View & update personal profile (limited permissions)
- Attendance check-in / check-out
- Apply for leave with status tracking
- View payroll details (read-only)
- Email notifications for key actions

---

### 🧑‍💼 HR / Admin Module
- Employee management (view, edit, manage)
- Leave approval / rejection workflow
- Payroll generation with salary breakdown
- Attendance overview for all employees
- Analytics dashboard for HR insights

---

### 💰 Payroll Management
- Monthly payroll generation
- Base salary, allowances, and deductions
- Net salary calculated securely at database level
- Payroll visibility restricted by role
- Email notification on payroll generation

---

### 📊 Analytics & Reporting
- Employee count overview
- Leave trends
- Attendance summaries
- Payroll analytics for HR decision-making

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- Axios
- CSS (custom, glassmorphism-style UI)

### Backend
- Node.js
- Express.js
- JWT (Authentication)
- bcrypt (Password hashing)
- Nodemailer (Email notifications)

### Database
- MySQL
- Relational schema with constraints
- Generated columns for payroll calculations

---

## 🏗️ Project Architecture

- **Frontend:** Role-based routing and protected routes
- **Backend:** RESTful APIs with middleware-level authorization
- **Database:** Normalized schema for HR data integrity
- **Security:** Authentication + authorization enforced at both frontend and backend

---

## 🔑 User Roles

| Role | Access |
|----|----|
| Employee | Profile, Attendance, Leave, Payroll (view) |
| HR | Employee Management, Leave Approval, Payroll, Analytics |
| Admin | Full system access |

---

## 📧 Email Notifications

Automated emails are sent for:
- User onboarding
- Leave approval / rejection
- Payroll generation
- Password reset

Email delivery is handled asynchronously to ensure system stability.

---

## 📌 Setup Instructions

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/dayflow-hrms.git
