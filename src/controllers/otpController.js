const OtpToken = require("../models/OtpToken");
const { sendMail } = require("../services/mailer");

function randomCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/security/request-otp
exports.requestOtp = async (req, res) => {
  const user = req.user; // require auth
  const code = randomCode();
  const token = await OtpToken.create({
    user: user._id,
    code,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000)
  });
  await sendMail(user.email, "Your OTP Code", `Your code is ${code}. It expires in 5 minutes.`);
  res.json({ message: "OTP sent (mock)", tokenId: token._id });
};

// POST /api/security/verify-otp
exports.verifyOtp = async (req, res) => {
  const { code } = req.body;
  const user = req.user;

  const token = await OtpToken.findOne({
    user: user._id,
    code,
    consumed: false,
    expiresAt: { $gt: new Date() }
  });

  if (!token) return res.status(400).json({ error: "Invalid or expired code" });

  token.consumed = true;
  await token.save();

  res.json({ message: "OTP verified (mock)" });
};
