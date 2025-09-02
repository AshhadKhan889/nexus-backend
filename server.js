const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const connectDB = require("./src/config/db");

dotenv.config();
const app = express();

app.use(helmet());
app.use(cors({ origin: "*"}));
app.use(express.json());

// DB
connectDB();

// Rate limit only on auth routes
const { authLimiter } = require("./src/middleware/rateLimit");

// Routes
app.use("/api/auth", authLimiter, require("./src/routes/authRoutes"));
app.use("/api/profile", require("./src/routes/profileRoutes"));
app.use("/api/meetings", require("./src/routes/meetingRoutes"));
app.use("/api/video", require("./src/routes/videoRoutes"));
app.use("/api/documents", require("./src/routes/documentRoutes"));
app.use("/api/payments", require("./src/routes/paymentRoutes"));
app.use("/api/security", require("./src/routes/securityRoutes"));

app.get("/", (req, res) => {
  res.send("🚀 Nexus Backend is running! Use /api/* routes.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
