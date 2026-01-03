const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Dayflow HRMS" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("EMAIL ERROR (IGNORED):", err.message);
    // ❗ DO NOT throw error — app must continue
  }
};

module.exports = sendEmail;
