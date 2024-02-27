import mongoose, { Schema, model } from "mongoose";

const homeSchema = new Schema(
  {
    layerText: {
      en: {
        type: String,
      },
      ar: {
        type: String,
      },
    },

    images: [
      {
        image: {
          type: String,
        },
        alt: {
          en: {
            type: String,
          },
          ar: {
            type: String,
          },
        },
        button: {
          hyperlink: {
            type: String,
          },
          text: {
            type: String,
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
        button: {
          hyperlink: {
            type: String,
          },
          text: {
            type: String,
          },
        },
      },
    ],
  },
  { timestamps: true }
);

homeSchema.post("init", function () {
  const baseURL = process.env.BaseURL;

  // Update image URLs
  if (this.images && this.images.length > 0) {
    this.images.forEach((image) => {
      if (image.image && !image.image.startsWith(baseURL)) {
        image.image = baseURL + "backend/home/" + image.image;
      }
    });
  }

  if (this.videos && this.videos.length > 0) {
    this.videos.forEach((video) => {
      if (video.video && !video.video.startsWith(baseURL)) {
        video.video = baseURL + "backend/home/" + video.video;
      }
    });
  }
});

export const homeModel = mongoose.models.home || model("home", homeSchema);
