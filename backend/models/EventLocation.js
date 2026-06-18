import mongoose from "mongoose";

const eventLocationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    type: {
      type: String,
      required: true,
      enum: ["help_desk", "volunteer_point", "sos_point", "lost_found", "medical"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("EventLocation", eventLocationSchema);
