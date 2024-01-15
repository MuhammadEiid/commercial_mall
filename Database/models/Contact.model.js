import mongoose, { Schema, model } from "mongoose";

const contactSchema = new Schema(
  {
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

    message: {
      type: String,
      min: 5,
      max: 350,
      required: true,
    },
  },
  { timestamps: true }
);

export const contactModel =
  mongoose.models.contact || model("contact", contactSchema);
