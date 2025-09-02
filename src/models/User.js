// src/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Investor", "Entrepreneur"], required: true },
  bio: { type: String },
  portfolio: { type: String },
  preferences: { type: Object },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
