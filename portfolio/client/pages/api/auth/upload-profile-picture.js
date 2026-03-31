import multer from "multer";
import path from "path";
import fs from "fs";

// Set up multer storage to save files to /public/uploads
const uploadDir = path.join(process.cwd(), "public/uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

const uploadMiddleware = upload.single("profilePicture");

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    return;
  }

  uploadMiddleware(req, res, function (err) {
    if (err) {
      res.status(500).json({ message: err.message });
      return;
    }
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }
    // Return the relative path to the uploaded file
    const filePath = `/uploads/${req.file.filename}`;
    res.status(200).json({ filePath });
  });
}
