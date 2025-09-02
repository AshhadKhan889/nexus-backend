const express = require("express");
const multer = require("multer");
const Document = require("../models/Document");
const { uploadDocument, getDocuments, signDocument } = require("../controllers/documentController");
const { auth } = require("../middleware/authMiddleware");

const upload = multer({ dest: "uploads/" }); // Replace with S3/Cloudinary setup

const router = express.Router();

router.post("/", auth, upload.single("file"), uploadDocument);
// GET a single document by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.json(document);
  } catch (err) {
    console.error("GET /api/documents/:id error:", err.message);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

router.put("/:id/sign", auth, signDocument);

module.exports = router;
