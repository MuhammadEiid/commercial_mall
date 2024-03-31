import mongoose, { Schema, model } from "mongoose";

const mainSchema = new Schema(
  {
    image: String,
    page: String,
  },

  { timestamps: true }
);

mainSchema.post("init", function () {
  const baseURL = process.env.BaseURL;

  if (this.image && !this.image.startsWith(baseURL)) {
    this.image = baseURL + "mall/pages/" + this.image;
  }
});

export const mainModel =
  mongoose.models.background || model("background", mainSchema);
