const express = require("express");
const { scheduleMeeting, updateMeeting, cancelMeeting } = require("../controllers/meetingController");
const { auth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", auth, scheduleMeeting);
router.put("/:id", auth, updateMeeting);
router.delete("/:id", auth, cancelMeeting);

module.exports = router;
