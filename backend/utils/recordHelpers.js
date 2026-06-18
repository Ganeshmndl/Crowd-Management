import mongoose from "mongoose";
import { cloudinary } from "../config/cloudinary.js";

const requireSelectedEvent = (req, res) => {
  if (!req.user.eventId) {
    res.status(400);
    throw new Error("Select an event before creating this record");
  }
};

const validateRecordId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error("Invalid record ID");
  }
  next();
};

const uploadedPhoto = (file) =>
  file ? { url: file.path, publicId: file.filename } : null;

const deleteCloudinaryPhoto = async (photo) => {
  if (photo?.publicId) {
    await cloudinary.uploader.destroy(photo.publicId).catch(() => {});
  }
};

export {
  deleteCloudinaryPhoto,
  requireSelectedEvent,
  uploadedPhoto,
  validateRecordId,
};
