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
  const baseURL = process.env.BaseURL;

  if (this.images) {
    this.images.forEach((image) => {
      if (!image.image.startsWith(baseURL)) {
        image.image = baseURL + "gallery/" + image.image;
      }
    });
  }

  if (this.videos) {
    this.videos.forEach((video) => {
      if (!video.video.startsWith(baseURL)) {
        video.video = baseURL + "gallery/" + video.video;
      }
    });
  }
});

export const galleryModel =
  mongoose.models.gallery || model("gallery", gallerySchema);
