const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/authMiddleware");
const { deposit, withdraw, transfer, history, getWallet } = require("../controllers/paymentController");
const { depositValidator, withdrawValidator, transferValidator, runValidation } = require("../middleware/validators");

// Wallet
router.get("/wallet", auth, getWallet);

// Transactions
router.get("/transactions", auth, history);

// Actions
router.post("/deposit", auth, depositValidator, runValidation, deposit);
router.post("/withdraw", auth, withdrawValidator, runValidation, withdraw);
router.post("/transfer", auth, transferValidator, runValidation, transfer);

module.exports = router;
