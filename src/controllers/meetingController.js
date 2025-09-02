const Meeting = require("../models/Meeting");

// Schedule new meeting
exports.scheduleMeeting = async (req, res) => {
  try {
    const { title, date, participants } = req.body;

    // Prevent conflict: check if same participants already have a meeting at that time
    const conflict = await Meeting.findOne({ date, participants: { $in: participants }, status: "Scheduled" });
    if (conflict) {
      return res.status(400).json({ error: "Meeting conflict detected!" });
    }

    const meeting = await Meeting.create({ title, date, participants });
    res.status(201).json(meeting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update meeting
exports.updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel meeting
exports.cancelMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(req.params.id, { status: "Cancelled" }, { new: true });
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
