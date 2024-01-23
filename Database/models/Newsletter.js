import mongoose, { Schema, model } from "mongoose";

const newsletterSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

export const newsletterModel =
  mongoose.models.newsletter || model("newsletter", newsletterSchema);
