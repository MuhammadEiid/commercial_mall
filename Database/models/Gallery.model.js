import mongoose, { Schema, model } from "mongoose";

const gallerySchema = new Schema(
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
    videos: [
      {
        video: String,
        alt: {
          en: {
            type: String,
          },
          ar: {
            type: String,
          },
        },
      },
    ],
  },
  { timestamps: true }
);

gallerySchema.post("init", function () {
  if (this.images) {
    this.images.forEach((image) => {
      image.image = process.env.BaseURL + "gallery/" + image.image;
    });
  }

  if (this.videos) {
    this.videos.forEach((video) => {
      video.video = process.env.BaseURL + "gallery/" + video.video;
    });
  }
});

export const galleryModel =
  mongoose.models.gallery || model("gallery", gallerySchema);
