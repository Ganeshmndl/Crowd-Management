import mongoose from "mongoose";
import {
  indianMobileErrorMessage,
  isValidIndianMobile,
} from "../utils/validators.js";

const missingReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    photo: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    age: { type: Number, required: true, min: 0, max: 120 },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "non-binary", "unknown"],
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value) => isValidIndianMobile(value),
        message: indianMobileErrorMessage,
      },
    },
    secondaryContactNumber: {
      type: String,
      trim: true,
      validate: {
        validator: (value) => !value || isValidIndianMobile(value),
        message: indianMobileErrorMessage,
      },
      default: null,
    },
    lastSeenLocation: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    lastSeenDate: { type: Date, required: true },
    description: { type: String, trim: true, maxlength: 2000, default: "" },
    status: {
      type: String,
      enum: ["open", "found", "closed"],
      default: "open",
    },
    reviewStatus: {
      type: String,
      enum: [
        "pending",
        "under_review",
        "verified",
        "matched",
        "resolved",
        "rejected",
      ],
      default: "pending",
      index: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewedAt: { type: Date, default: null },
    faceDescriptor: {
      type: [Number],
      default: null,
    },
  },
  { timestamps: true },
);

missingReportSchema.index({ userId: 1, eventId: 1, createdAt: -1 });
missingReportSchema.index({ eventId: 1, reviewStatus: 1, createdAt: -1 });

export default mongoose.model("MissingReport", missingReportSchema);
