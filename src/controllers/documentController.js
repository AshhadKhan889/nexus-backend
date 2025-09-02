const Document = require("../models/Document");

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileUrl = req.file.path; // this will be local path (e.g. uploads/abc123.pdf)
    const doc = await Document.create({
      name: req.file.originalname,
      url: fileUrl,
      owner: req.user._id,
    });

    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch all docs
exports.getDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ owner: req.user._id });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add signature
exports.signDocument = async (req, res) => {
  try {
    const doc = await Document.findByIdAndUpdate(
      req.params.id,
      { $push: { signatures: { user: req.user._id, signedAt: new Date() } }, status: "Signed" },
      { new: true }
    );
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
