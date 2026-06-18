import mongoose from "mongoose";

const sosRequestSchema = new mongoose.Schema(
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
    location: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 1000 },
    severity: {
      type: String,
      required: true,
      enum: ["low", "medium", "high", "critical"],
    },
    status: {
      type: String,
      enum: ["active", "responding", "resolved", "cancelled"],
      default: "active",
    },
    assignedCommitteeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

sosRequestSchema.index({ userId: 1, eventId: 1, createdAt: -1 });

export default mongoose.model("SOSRequest", sosRequestSchema);
