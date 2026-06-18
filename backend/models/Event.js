import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Event name is required"],
    trim: true,
    maxlength: [120, "Event name cannot exceed 120 characters"],
  },
  province: {
    type: String,
    required: [true, "Province is required"],
    trim: true,
    maxlength: [80, "Province cannot exceed 80 characters"],
  },
  district: {
    type: String,
    required: [true, "District is required"],
    trim: true,
    maxlength: [80, "District cannot exceed 80 characters"],
  },
  venue: {
    type: String,
    required: [true, "Venue is required"],
    trim: true,
    maxlength: [160, "Venue cannot exceed 160 characters"],
  },
  startDate: {
    type: Date,
    required: [true, "Event date is required"],
  },
  endDate: {
    type: Date,
    default: null,
  },
  capacity: {
    type: Number,
    required: [true, "Capacity is required"],
    min: [1, "Capacity must be at least 1"],
    max: [10000000, "Capacity cannot exceed 10,000,000"],
  },
  status: {
    type: String,
    enum: ["upcoming", "active", "completed", "cancelled"],
    default: "upcoming",
  },
  banner: {
    url: { type: String, default: "" },
    publicId: { type: String, default: "" },
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, "Description cannot exceed 2000 characters"],
    default: "",
  },
  committeeIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
});

eventSchema.virtual("date").get(function getLegacyDate() {
  return this.startDate;
});

eventSchema.virtual("date").set(function setLegacyDate(value) {
  this.startDate = value;
  if (!this.endDate) {
    this.endDate = value;
  }
});

eventSchema.set("toJSON", { virtuals: true });
eventSchema.set("toObject", { virtuals: true });

eventSchema.pre("validate", function normalizeLegacyDate() {
  if (!this.startDate && this.date) {
    this.startDate = this.date;
  }

  if (!this.endDate && this.startDate) {
    this.endDate = this.startDate;
  }
});

eventSchema.index({ status: 1, startDate: 1 });
eventSchema.index({ name: "text", province: "text", district: "text", venue: "text" });

const Event = mongoose.model("Event", eventSchema);

export default Event;
