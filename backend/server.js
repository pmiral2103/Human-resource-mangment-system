const express = require("express");
require("dotenv").config();
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const { isDate } = require("util");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "dayflow_hrms",
});

const verifyToken = (req, res, next) => {

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    console.error("JWT ERROR:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};

db.connect((err) => {
  if (err) {
    return console.error("MySQL Error:", err);
  }
  console.log("Connected to MySQL.");
});

app.use("/images", express.static(path.join(__dirname, "public/images")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/images"),
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

app.get("/", (req, res) => res.json("From Backend"));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

transporter.use(
  "compile",
  hbs({
    viewEngine: {
      extname: ".hbs",
      defaultLayout: false,
    },
    viewPath: path.resolve(__dirname, "template"),
    extName: ".hbs",
  })
);

async function sendResetPasswordMail(toEmail) {
  const resetLink = `http://localhost:3000/resetpassword?email=${toEmail}`;

  const mailOptions = {
    from: process.env.EMAIL,
    to: toEmail,
    subject: "Reset Password for Tabster",
    template: "resetPassword",
    context: { resetLink, year: new Date().getFullYear() },
  };
  await transporter.sendMail(mailOptions);
}
const crypto = require("crypto");
const sendEmail = require("./utils/sendEmail");

app.post("/api/forgot-password", (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const sql = "SELECT id, email FROM users WHERE email=?";

    db.query(sql, [email], (err, result) => {
      if (err) {
        console.error("FORGOT PASSWORD DB ERROR:", err);
        return res.status(500).json({ message: "Server error" });
      }

      // IMPORTANT: Do NOT reveal if email exists
      if (result.length === 0) {
        return res.json({
          message: "If this email exists, a reset link has been sent",
        });
      }

      const user = result[0];

      const token = crypto.randomBytes(32).toString("hex");
      const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min

      const updateSql = `
        UPDATE users
        SET reset_token=?, reset_token_expiry=?
        WHERE id=?
      `;

      db.query(updateSql, [token, expiry, user.id], (err) => {
        if (err) {
          console.error("RESET TOKEN SAVE ERROR:", err);
          return res.status(500).json({ message: "Server error" });
        }

        const resetLink = `http://localhost:3000/reset-password/${token}`;

        // 🔥 SEND EMAIL (NON-BLOCKING)
        sendEmail({
          to: req.body.email,

          subject: "Password Reset – Dayflow HRMS",
          html: `
            <h3>Password Reset Request</h3>
            <p>Click the link below to reset your password:</p>
            <a href="${resetLink}">${resetLink}</a>
            <br/><br/>
            <b>This link expires in 15 minutes.</b>
          `,
        });

        // RESPOND IMMEDIATELY
        res.json({
          message: "If this email exists, a reset link has been sent",
        });
      });
    });
  } catch (e) {
    console.error("FORGOT PASSWORD SERVER CRASH:", e);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const sql = `
      SELECT id FROM users
      WHERE reset_token = ?
      AND reset_token_expiry > NOW()
    `;

    db.query(sql, [token], async (err, result) => {
      if (err) {
        console.error("RESET PASSWORD DB ERROR:", err);
        return res.status(500).json({ message: "Server error" });
      }

      if (result.length === 0) {
        return res
          .status(400)
          .json({ message: "Reset link is invalid or expired" });
      }

      const bcrypt = require("bcrypt");
      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        `
        UPDATE users
        SET password = ?, reset_token = NULL, reset_token_expiry = NULL
        WHERE id = ?
        `,
        [hashedPassword, result[0].id],
        (err) => {
          if (err) {
            console.error("PASSWORD UPDATE ERROR:", err);
            return res.status(500).json({ message: "Server error" });
          }

          res.json({ message: "Password reset successful" });
        }
      );
    });
  } catch (err) {
    console.error("RESET PASSWORD SERVER CRASH:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Get users
app.get("/users", (req, res) => {
  const sql = "select * from emp";
  db.query(sql, (error, data) =>
    error ? res.status(500).json(error) : res.json(data)
  );
});
app.get("/auth/profile", verifyToken, (req, res) => {
  const sql = `
    SELECT id, employee_id, first_name, last_name, email, phone,
           role, department, designation, profile_image
    FROM users WHERE id = ?
  `;

  db.query(sql, [req.user.id], (err, result) => {
    if (err || result.length === 0)
      return res.status(404).json({ message: "User not found" });

    res.json(result[0]);
  });
});
app.put(
  "/auth/profile",
  verifyToken,
  upload.single("profile_image"),
  (req, res) => {
    const role = req.user.role;
    const userId = req.user.id;

    let updates = [];
    let values = [];

    const allowedFields =
      role === "EMPLOYEE"
        ? ["phone"]
        : [
            "first_name",
            "last_name",
            "phone",
            "role",
            "department",
            "designation",
          ];

    allowedFields.forEach((field) => {
      if (req.body[field]) {
        updates.push(`${field}=?`);
        values.push(req.body[field]);
      }
    });

    if (req.file) {
      updates.push("profile_image=?");
      values.push(req.file.filename);
    }

    if (updates.length === 0)
      return res.status(400).json({ message: "No changes detected" });

    const sql = `UPDATE users SET ${updates.join(", ")} WHERE id=?`;
    values.push(userId);

    db.query(sql, values, (err) => {
      if (err) return res.status(500).json({ message: "Update failed" });
      res.json({ message: "Profile updated successfully" });
    });
  }
);

// Login
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ? AND status='ACTIVE'";
  db.query(sql, [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        employee_id: user.employee_id,
        name: `${user.first_name} ${user.last_name}`,
        role: user.role,
        email: user.email,
      },
    });
  });
});

app.post("/attendance/checkin", verifyToken, (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().split("T")[0];

  const checkQuery =
    "SELECT id FROM attendance WHERE user_id=? AND attendance_date=?";
  db.query(checkQuery, [userId, today], (err, result) => {
    if (result.length > 0) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    const insertQuery = `
      INSERT INTO attendance (user_id, attendance_date, check_in, status)
      VALUES (?, ?, CURTIME(), 'PRESENT')
    `;
    db.query(insertQuery, [userId, today], () => {
      res.json({ message: "Checked in successfully" });
    });
  });
});
app.post("/attendance/checkout", verifyToken, (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().split("T")[0];

  const updateQuery = `
    UPDATE attendance
    SET check_out = CURTIME()
    WHERE user_id=? AND attendance_date=?
  `;

  db.query(updateQuery, [userId, today], (err, result) => {
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Check-in required first" });
    }
    res.json({ message: "Checked out successfully" });
  });
});
app.get("/attendance/me/today", verifyToken, (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().split("T")[0];

  const sql = "SELECT * FROM attendance WHERE user_id=? AND attendance_date=?";
  db.query(sql, [userId, today], (err, result) => {
    res.json(result[0] || null);
  });
});
app.get("/attendance/all", verifyToken, (req, res) => {
  if (req.user.role === "EMPLOYEE") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const sql = `
    SELECT a.*, u.first_name, u.last_name, u.employee_id
    FROM attendance a
    JOIN users u ON a.user_id = u.id
    ORDER BY attendance_date DESC
  `;
  db.query(sql, (err, result) => {
    res.json(result);
  });
});

app.post("/auth/register", upload.single("profile_image"), async (req, res) => {
  try {
    const {
      employee_id,
      first_name,
      last_name,
      email,
      phone,
      password,
      role,
      department,
      designation,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const profile_image = req.file ? req.file.filename : null;

    const sql = `
      INSERT INTO users
      (employee_id, first_name, last_name, email, phone, password, role, department, designation, profile_image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        employee_id,
        first_name,
        last_name,
        email,
        phone,
        hashedPassword,
        role,
        department,
        designation,
        profile_image,
      ],
      (err) => {
        if (err) {
          console.error(err);
          return res.status(400).json({ message: "User already exists" });
        }
        res.status(201).json({ message: "User registered successfully" });
        const sendEmail = require("./utils/sendEmail");

        sendEmail({
          to: req.body.email,
          subject: "Welcome to Dayflow HRMS",
          html: `
    <h2>Welcome ${req.body  .first_name} 👋</h2>
    <p>Your Dayflow HRMS account has been created successfully.</p>
    <p>You can now log in and manage your work activities.</p>
    <br/>
    <b>– Dayflow Team</b>
  `,
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/leave/apply", verifyToken, (req, res) => {
  try {
    const userId = req.user.id;
    const { leave_type, start_date, end_date, reason } = req.body;

    const sql = `
      INSERT INTO leave_requests
      (user_id, leave_type, start_date, end_date, reason, status)
      VALUES (?, ?, ?, ?, ?, 'PENDING')
    `;

    db.query(sql, [userId, leave_type, start_date, end_date, reason], (err) => {
      if (err) {
        console.error("LEAVE APPLY ERROR:", err);
        return res.status(500).json({ message: err.sqlMessage });
      }
      res.json({ message: "Leave applied successfully" });
    });
  } catch (err) {
    console.error("SERVER CRASH:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/leave/me", verifyToken, (req, res) => {
  const sql =
    "SELECT * FROM leave_requests WHERE user_id=? ORDER BY applied_at DESC";

  db.query(sql, [req.user.id], (err, result) => {
    res.json(result);
  });
});

app.get("/leave/all", verifyToken, (req, res) => {
  if (req.user.role === "EMPLOYEE") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const sql = `
    SELECT l.*, u.first_name, u.last_name, u.employee_id
    FROM leave_requests l
    JOIN users u ON l.user_id = u.id
    ORDER BY l.applied_at DESC
  `;

  db.query(sql, (err, result) => {
    res.json(result);
  });
});

app.put("/leave/:id", verifyToken, (req, res) => {
  if (req.user.role === "EMPLOYEE") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { status, admin_comment } = req.body;
  const leaveId = req.params.id;

  const sql = "UPDATE leave_requests SET status=?, admin_comment=? WHERE id=?";

  db.query(sql, [status, admin_comment, leaveId], (err) => {
    if (err) return res.status(500).json({ message: "Update failed" });
    res.json({ message: "Leave updated" });
    sendEmail({
  to: employee.email,
  subject: `Leave ${status}`,
  html: `
    <h3>Your leave request has been ${status}</h3>
    <p><b>Type:</b> ${leave.leave_type}</p>
    <p><b>Dates:</b> ${leave.start_date} → ${leave.end_date}</p>
    <br/>
    <b>Dayflow HRMS</b>
  `,
});

  });
});

app.get("/payroll/me", verifyToken, (req, res) => {
  const sql = `
    SELECT month, base_salary, allowances, deductions
    FROM payroll
    WHERE user_id = ?
    ORDER BY month DESC
  `;

  db.query(sql, [req.user.id], (err, result) => {
    if (err) {
      console.error("PAYROLL ERROR:", err);
      return res.status(500).json({ message: "Failed to load payroll" });
    }
    res.json(result);
  });
});

app.get("/hr/employees", verifyToken, (req, res) => {
  if (req.user.role === "EMPLOYEE") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const sql = `
    SELECT id, employee_id, first_name, last_name, email, phone,
           role, department, designation, status
    FROM users
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("EMPLOYEE LIST ERROR:", err);
      return res.status(500).json({ message: "Failed to load employees" });
    }
    res.json(result);
  });
});

app.get("/hr/employees", verifyToken, (req, res) => {
  if (req.user.role === "EMPLOYEE") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const sql = `
    SELECT id, employee_id, first_name, last_name, email, phone,
           role, department, designation, status
    FROM users
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("EMPLOYEE LIST ERROR:", err);
      return res.status(500).json({ message: "Failed to load employees" });
    }
    res.json(result);
  });
});

app.get("/reports/summary", verifyToken, (req, res) => {
  if (req.user.role === "EMPLOYEE") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const queries = {
    employees: "SELECT COUNT(*) as total FROM users WHERE status='ACTIVE'",
    attendance: `
      SELECT status, COUNT(*) as count
      FROM attendance
      WHERE attendance_date = CURDATE()
      GROUP BY status
    `,
    leaves: `
      SELECT status, COUNT(*) as count
      FROM leave_requests
      GROUP BY status
    `,
  };

  let result = {};

  db.query(queries.employees, (e1, r1) => {
    if (e1) return res.status(500).json(e1);
    result.employees = r1[0].total;

    db.query(queries.attendance, (e2, r2) => {
      if (e2) return res.status(500).json(e2);
      result.attendance = r2;

      db.query(queries.leaves, (e3, r3) => {
        if (e3) return res.status(500).json(e3);
        result.leaves = r3;

        res.json(result);
      });
    });
  });
});

app.put("/hr/employees/:id", verifyToken, (req, res) => {
  if (req.user.role === "EMPLOYEE") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { role, department, designation, status } = req.body;
  const userId = req.params.id;

  const sql = `
    UPDATE users
    SET role=?, department=?, designation=?, status=?
    WHERE id=?
  `;

  db.query(sql, [role, department, designation, status, userId], (err) => {
    if (err) {
      console.error("EMPLOYEE UPDATE ERROR:", err);
      return res.status(500).json({ message: "Update failed" });
    }
    res.json({ message: "Employee updated successfully" });
  });
});

app.get("/payroll/all", verifyToken, (req, res) => {
  if (req.user.role === "EMPLOYEE") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const sql = `
    SELECT p.*, u.first_name, u.last_name, u.employee_id
    FROM payroll p
    JOIN users u ON p.user_id = u.id
    ORDER BY p.month DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.post("/hr/payroll", verifyToken, (req, res) => {
  try {
    if (req.user.role === "EMPLOYEE") {
      return res.status(403).json({ message: "Forbidden" });
    }

    let {
      user_id,
      month,
      base_salary,
      allowances = 0,
      deductions = 0,
    } = req.body;

    // HARD VALIDATION
    if (!user_id || !month || !base_salary) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // FORCE NUMBERS
    base_salary = Number(base_salary);
    allowances = Number(allowances);
    deductions = Number(deductions);

    if ([base_salary, allowances, deductions].some(isNaN)) {
      return res.status(400).json({ message: "Invalid salary values" });
    }

    // PREVENT DUPLICATE PAYROLL
    const checkSql = `
      SELECT id FROM payroll WHERE user_id=? AND month=?
    `;

    db.query(checkSql, [user_id, month], (err, rows) => {
      if (err) {
        console.error("PAYROLL CHECK ERROR:", err);
        return res.status(500).json({ message: "Payroll check failed" });
      }

      if (rows.length > 0) {
        return res
          .status(400)
          .json({ message: "Payroll already exists for this month" });
      }

      // 🔥 INSERT WITHOUT net_salary
      const insertSql = `
        INSERT INTO payroll
        (user_id, month, base_salary, allowances, deductions)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(
        insertSql,
        [user_id, month, base_salary, allowances, deductions],
        (err) => {
          if (err) {
            console.error("ADD PAYROLL ERROR:", err);
            return res.status(500).json({ message: err.sqlMessage });
          }

          res.json({ message: "Payroll added successfully" });
          sendEmail({
  to: employee.email,
  subject: "Payroll Generated",
  html: `
    <h3>Payroll for ${month} is now available</h3>
    <p>Please log in to Dayflow HRMS to view your salary details.</p>
    <br/>
    <b>Dayflow HRMS</b>
  `,
});

        }
      );
    });
  } catch (e) {
    console.error("PAYROLL SERVER CRASH:", e);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/analytics/attendance", verifyToken, (req, res) => {
  if (req.user.role === "EMPLOYEE") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const sql = `
    SELECT attendance_date AS date, COUNT(*) AS count
    FROM attendance
    WHERE attendance_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    GROUP BY attendance_date
    ORDER BY attendance_date
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});
app.get("/analytics/leaves", verifyToken, (req, res) => {
  if (req.user.role === "EMPLOYEE") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const sql = `
    SELECT status, COUNT(*) AS count
    FROM leave_requests
    GROUP BY status
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});
app.get("/analytics/departments", verifyToken, (req, res) => {
  if (req.user.role === "EMPLOYEE") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const sql = `
    SELECT department, COUNT(*) AS count
    FROM users
    WHERE status='ACTIVE'
    GROUP BY department
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});
app.get("/analytics/payroll", verifyToken, (req, res) => {
  if (req.user.role === "EMPLOYEE") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const sql = `
    SELECT month, SUM(net_salary) AS total_cost
    FROM payroll
    GROUP BY month
    ORDER BY month
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.listen(8081, () => {
  console.log("Server listening on port 8081");
});
