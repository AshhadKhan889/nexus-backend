const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  name: String,
  url: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  version: { type: Number, default: 1 },
  status: { type: String, enum: ["Draft", "Reviewed", "Signed"], default: "Draft" },
  signatures: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, signedAt: Date }]
}, { timestamps: true });

module.exports = mongoose.model("Document", documentSchema);
