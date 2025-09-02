const mongoose = require("mongoose");

const videoRoomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  meetingId: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting" }
}, { timestamps: true });

module.exports = mongoose.model("VideoRoom", videoRoomSchema);
