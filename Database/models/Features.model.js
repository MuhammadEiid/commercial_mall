import mongoose, { Schema, model } from "mongoose";

const featuresSchema = new Schema(
  {
    title: {
      en: {
        type: String,
        required: true,
        min: 3,
      },
      ar: {
        type: String,
        required: true,
        min: 3,
      },
    },

    description: {
      en: {
        type: String,
        required: true,
        min: 3,
      },
      ar: {
        type: String,
        required: true,
        min: 3,
      },
    },

    section: [
      {
        title: {
          en: {
            type: String,
            required: true,
            min: 3,
          },
          ar: {
            type: String,
            required: true,
            min: 3,
          },
        },
        content: {
          en: {
            type: String,
            required: true,
            min: 3,
          },
          ar: {
            type: String,
            required: true,
            min: 3,
          },
        },
      },
    ],

    createdAt: {
      type: Date,
      default: Date.now,
    },
    imageCover: String,
  },
  { timestamps: true }
);

featuresSchema.post("init", function () {
  const baseURL = process.env.BaseURL;

  if (this.imageCover && !this.imageCover.startsWith(baseURL)) {
    this.imageCover = baseURL + "features/" + this.imageCover;
  }
});

export const featuresModel =
  mongoose.models.features || model("features", featuresSchema);
