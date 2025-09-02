const mongoose = require("mongoose");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");

// Ensure user has wallet
async function ensureWallet(userId, session) {
  let wallet = await Wallet.findOne({ user: userId }).session(session);
  if (!wallet) wallet = await Wallet.create([{ user: userId, balance: 0 }], { session }).then(r => r[0]);
  return wallet;
}

// POST /api/payments/deposit
exports.deposit = async (req, res) => {
  const { amount, provider = "Mock" } = req.body;
  const userId = req.user._id;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const tx = await Transaction.create(
      [{ type: "DEPOSIT", amount, toUser: userId, status: "Pending", provider, reference: `DEP-${Date.now()}` }],
      { session }
    ).then(r => r[0]);

    // Simulate provider success
    const wallet = await ensureWallet(userId, session);
    wallet.balance += Number(amount);
    await wallet.save({ session });

    tx.status = "Completed";
    await tx.save({ session });

    await session.commitTransaction();
    res.status(201).json({ wallet, transaction: tx });
  } catch (e) {
    await session.abortTransaction();
    res.status(500).json({ error: e.message });
  } finally {
    session.endSession();
  }
};

// POST /api/payments/withdraw
exports.withdraw = async (req, res) => {
  const { amount } = req.body;
  const userId = req.user._id;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const wallet = await ensureWallet(userId, session);
    if (wallet.balance < amount) throw new Error("Insufficient balance");

    const tx = await Transaction.create(
      [{ type: "WITHDRAW", amount, fromUser: userId, status: "Pending", provider: "Mock", reference: `WDR-${Date.now()}` }],
      { session }
    ).then(r => r[0]);

    // Simulate payout
    wallet.balance -= Number(amount);
    await wallet.save({ session });

    tx.status = "Completed";
    await tx.save({ session });

    await session.commitTransaction();
    res.status(201).json({ wallet, transaction: tx });
  } catch (e) {
    await session.abortTransaction();
    res.status(400).json({ error: e.message });
  } finally {
    session.endSession();
  }
};

// POST /api/payments/transfer
exports.transfer = async (req, res) => {
  const { amount, toUserId } = req.body;
  const fromUserId = req.user._id;

  if (String(fromUserId) === String(toUserId)) {
    return res.status(400).json({ error: "Cannot transfer to self" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const fromWallet = await ensureWallet(fromUserId, session);
    const toWallet = await ensureWallet(toUserId, session);
    if (fromWallet.balance < amount) throw new Error("Insufficient balance");

    const tx = await Transaction.create(
      [{
        type: "TRANSFER",
        amount,
        fromUser: fromUserId,
        toUser: toUserId,
        status: "Pending",
        provider: "Mock",
        reference: `TRF-${Date.now()}`
      }],
      { session }
    ).then(r => r[0]);

    fromWallet.balance -= Number(amount);
    toWallet.balance += Number(amount);
    await fromWallet.save({ session });
    await toWallet.save({ session });

    tx.status = "Completed";
    await tx.save({ session });

    await session.commitTransaction();
    res.status(201).json({ transaction: tx });
  } catch (e) {
    await session.abortTransaction();
    res.status(400).json({ error: e.message });
  } finally {
    session.endSession();
  }
};

// GET /api/payments/transactions?type=&status=
exports.history = async (req, res) => {
  const userId = req.user._id;
  const { type, status } = req.query;

  const filter = {
    $or: [{ fromUser: userId }, { toUser: userId }]
  };
  if (type) filter.type = type;
  if (status) filter.status = status;

  const txs = await Transaction.find(filter).sort({ createdAt: -1 });
  res.json(txs);
};

// GET /api/payments/wallet
exports.getWallet = async (req, res) => {
  const wallet = await Wallet.findOne({ user: req.user._id });
  res.json(wallet || { user: req.user._id, balance: 0 });
};
