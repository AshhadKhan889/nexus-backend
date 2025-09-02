const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

exports.sendMail = async (to, subject, text) => {
  // In mock mode, also log to console
  console.log(`[MOCK EMAIL] to=${to} subject=${subject} text=${text}`);
  try {
    await transporter.sendMail({ from: process.env.SMTP_USER, to, subject, text });
  } catch {
    // ignore failures in mock
  }
};
