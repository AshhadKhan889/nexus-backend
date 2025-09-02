const mongoose = require("mongoose");

const otpTokenSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    code: String,
    expiresAt: Date,
    consumed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

otpTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // auto-clean after expiry

module.exports = mongoose.model("OtpToken", otpTokenSchema);
