const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  status: { type: String, enum: ["Scheduled", "Completed", "Cancelled"], default: "Scheduled" }
}, { timestamps: true });

module.exports = mongoose.model("Meeting", meetingSchema);
