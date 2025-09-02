const express = require("express");
const router = express.Router();
const { createRoom, joinRoom } = require("../controllers/videoController");
const { auth } = require("../middleware/authMiddleware");

// define route
router.post("/create-room", auth, createRoom);
router.post("/join-room", auth, joinRoom);

module.exports = router;
