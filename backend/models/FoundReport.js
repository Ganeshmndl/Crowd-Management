import mongoose from "mongoose";
import {
  indianMobileErrorMessage,
  isValidIndianMobile,
} from "../utils/validators.js";

const foundReportSchema = new mongoose.Schema(
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
    approxAge: { type: Number, required: true, min: 0, max: 120 },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "non-binary", "unknown"],
    },
    foundLocation: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    helpDesk: { type: String, required: true, trim: true, maxlength: 160 },
    foundPersonName: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },
    reporterMobile: {
      type: String,
      trim: true,
      default: "",
      validate: {
        validator: (value) => !value || isValidIndianMobile(value),
        message: indianMobileErrorMessage,
      },
    },
    description: { type: String, trim: true, maxlength: 2000, default: "" },
    status: {
      type: String,
      enum: ["open", "reunited", "closed"],
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

foundReportSchema.index({ userId: 1, eventId: 1, createdAt: -1 });
foundReportSchema.index({ eventId: 1, reviewStatus: 1, createdAt: -1 });

export default mongoose.model("FoundReport", foundReportSchema);
