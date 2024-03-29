import mongoose, { Schema, model } from "mongoose";

const homeSchema = new Schema(
  {
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
            en: {
              type: String,
            },
            ar: {
              type: String,
            },
          },
        },

        layerText: {
          title: {
            en: {
              type: String,
            },
            ar: {
              type: String,
            },
          },
          description: {
            en: {
              type: String,
            },
            ar: {
              type: String,
            },
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
            en: {
              type: String,
            },
            ar: {
              type: String,
            },
          },
        },

        layerText: {
          title: {
            en: {
              type: String,
            },
            ar: {
              type: String,
            },
          },
          description: {
            en: {
              type: String,
            },
            ar: {
              type: String,
            },
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
        image.image = baseURL + "home/" + image.image;
      }
    });
  }

  if (this.videos && this.videos.length > 0) {
    this.videos.forEach((video) => {
      if (video.video && !video.video.startsWith(baseURL)) {
        video.video = baseURL + "home/" + video.video;
      }
    });
  }
});

export const homeModel = mongoose.models.home || model("home", homeSchema);
