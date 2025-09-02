// src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(400).json({ msg: "Token is not valid" });
  }
};

exports.role = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return res.status(403).json({ msg: "Access denied" });
  next();
};
