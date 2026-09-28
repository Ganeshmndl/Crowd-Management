import mongoose from "mongoose";
import {
  indianMobileErrorMessage,
  isValidIndianMobile,
} from "../utils/validators.js";

const familyMemberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    photo: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    relation: { type: String, required: true, trim: true, maxlength: 80 },
    age: { type: Number, min: 0, max: 120, default: null },
    phone: {
      type: String,
      trim: true,
      maxlength: 30,
      default: "",
      validate: {
        validator: (value) => !value || isValidIndianMobile(value),
        message: indianMobileErrorMessage,
      },
    },
    medicalNotes: { type: String, trim: true, maxlength: 2000, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("FamilyMember", familyMemberSchema);
