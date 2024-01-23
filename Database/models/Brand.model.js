import mongoose, { Schema, model } from "mongoose";

const brandSchema = new Schema(
  {
    images: [
      {
        image: {
          type: String,
          required: true,
        },
        alt: {
          en: {
            type: String,
            required: true,
          },
          ar: {
            type: String,
            required: true,
          },
        },
      },
    ],
  },
  { timestamps: true }
);

brandSchema.post("init", function () {
  if (this.images) {
    this.images.forEach((image) => {
      image.image = process.env.BaseURL + "mall/brands/" + image.image;
    });
  }
});
export const brandModel = mongoose.models.brand || model("brand", brandSchema);
