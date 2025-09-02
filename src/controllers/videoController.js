const VideoRoom = require("../models/VideoRoom");

// Create video room
exports.createRoom = async (req, res) => {
  try {
    const { roomId, meetingId, participants } = req.body;
    const room = await VideoRoom.create({ roomId, meetingId, participants });
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Join room
exports.joinRoom = async (req, res) => {
  try {
    const { roomId } = req.body; // roomId from request body
    const participantId = req.user._id; // logged-in user from auth middleware

    const room = await VideoRoom.findOneAndUpdate(
      { roomId },
      { $addToSet: { participants: participantId } },
      { new: true }
    );

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};