import multer from "multer";
import { cloudinaryStorage } from "../config/cloudinary.js";

const imageUpload = multer({
  storage: cloudinaryStorage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter(_req, file, callback) {
    if (!file.mimetype.startsWith("image/")) {
      callback(new Error("Only image uploads are allowed"));
      return;
    }

    callback(null, true);
  },
});

export { imageUpload };
