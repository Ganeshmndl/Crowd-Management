import mongoose from "mongoose";
import {
  indianMobileErrorMessage,
  isValidIndianMobile,
} from "../utils/validators.js";

const matchSchema = new mongoose.Schema({
  missingReportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MissingReport",
    required: true,
  },
  foundReportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FoundReport",
    required: true,
  },
  committeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
    index: true,
  },
  matchScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  scoreDetails: {
    age: { type: Number, required: true },
    gender: { type: Number, required: true },
    location: { type: Number, required: true },
    sameEvent: { type: Number, required: true },
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "resolved"],
    default: "pending",
    index: true,
  },
  ticketId: {
    type: String,
    unique: true,
    sparse: true,
  },
  committeeContactName: {
    type: String,
    trim: true,
  },
  committeeContactNumber: {
    type: String,
    trim: true,
    validate: {
      validator: (value) => !value || isValidIndianMobile(value),
      message: indianMobileErrorMessage,
    },
  },
  helpDeskLocation: {
    type: String,
    trim: true,
  },
  meetingTime: {
    type: Date,
  },
  matchNotes: {
    type: String,
    trim: true,
  },
  reunificationStatus: {
    type: String,
    enum: ["pending", "awaiting_reunification", "resolved", "closed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
});

matchSchema.index(
  { missingReportId: 1, foundReportId: 1 },
  { unique: true },
);

export default mongoose.model("Match", matchSchema);
