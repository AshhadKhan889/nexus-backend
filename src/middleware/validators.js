const { body, param } = require("express-validator");

exports.depositValidator = [
  body("amount").isFloat({ gt: 0 }).withMessage("Amount must be > 0"),
  body("provider").optional().isIn(["Stripe", "PayPal", "Mock"]).withMessage("Invalid provider")
];

exports.withdrawValidator = [
  body("amount").isFloat({ gt: 0 }).withMessage("Amount must be > 0")
];

exports.transferValidator = [
  body("amount").isFloat({ gt: 0 }).withMessage("Amount must be > 0"),
  body("toUserId").isMongoId().withMessage("Invalid toUserId")
];

exports.idParamValidator = [param("id").isMongoId().withMessage("Invalid id")];

exports.runValidation = (req, res, next) => {
  const { validationResult } = require("express-validator");
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};
