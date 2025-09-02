const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, index: true },
    balance: { type: Number, default: 0 } // store in smallest unit if you prefer (e.g. cents)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wallet", walletSchema);
