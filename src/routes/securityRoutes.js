const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/authMiddleware");
const { requestOtp, verifyOtp } = require("../controllers/otpController");
const { body } = require("express-validator");
const { runValidation } = require("../middleware/validators");

router.post("/request-otp", auth, requestOtp);
router.post("/verify-otp", auth, [body("code").isLength({ min: 6, max: 6 })], runValidation, verifyOtp);

module.exports = router;
