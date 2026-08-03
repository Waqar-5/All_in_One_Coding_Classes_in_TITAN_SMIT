const router = require("express").Router();
const multer = require("multer");

// ================= STORAGE =================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// ================= MULTER =================

const upload = multer({
  storage: storage,
});

// ================= SINGLE FILE UPLOAD =================

router.post("/single", upload.single("image"), (req, res) => {
  try {
    res.status(200).json({
      message: "File uploaded successfully",
      file: req.file,
    });
  } catch (error) {
    res.status(500).json({
      message: "File upload failed",
      error: error.message,
    });
  }
});

module.exports = router;