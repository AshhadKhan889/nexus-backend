const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["DEPOSIT", "WITHDRAW", "TRANSFER"], required: true },
    amount: { type: Number, required: true, min: 0.01 },
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending", index: true },
    provider: { type: String, enum: ["Stripe", "PayPal", "Mock"], default: "Mock" },
    reference: { type: String, index: true }, // gateway/trace id
    meta: { type: Object }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
