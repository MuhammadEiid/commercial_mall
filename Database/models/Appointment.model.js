import mongoose, { Schema, model } from "mongoose";

const appointmentSchema = new Schema(
  {
    mainType: {
      type: String,
      enum: ["Administrative", "Medical", "Commercial"],
      required: true,
    },

    secondaryType: {
      ar: { type: String },
      en: { type: String },
    },

    name: {
      type: String,
      min: 3,
      max: 50,
      required: true,
    },

    email: {
      type: String,
      trim: true,
      required: [true, "Please add a user email"],
      lowercase: true,
    },
    phone: { type: String, required: true },
    message: {
      type: String,
      min: 5,
      max: 450,
      required: true,
    },
  },
  { timestamps: true }
);

export const appointmentModel =
  mongoose.models.appointment || model("appointment", appointmentSchema);
