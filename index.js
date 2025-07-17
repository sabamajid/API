

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve files

// 📦 In-memory storage for uploaded items
let uploadedItems = [];

// 📂 Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = file.fieldname + "s"; // "image" → "images"
    cb(null, `uploads/${folder}`);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

// 🆙 Upload endpoint
app.post("/upload", upload.fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
  { name: "model", maxCount: 1 },
]), (req, res) => {
  const { title, description, brand } = req.body;
  const files = req.files;

  // Save to memory
  const item = {
    title,
    description,
    brand,
    image: files.image?.[0]?.path,
    video: files.video?.[0]?.path,
    model: files.model?.[0]?.path,
    uploadedAt: new Date()
  };

  uploadedItems.push(item);

  res.json({
    message: "Upload successful",
    ...item
  });
});

// 📄 Fetch uploaded items
app.get("/items", (req, res) => {
  res.json(uploadedItems);
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
