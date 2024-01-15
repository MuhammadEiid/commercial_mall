import mongoose, { Schema, model } from "mongoose";

const blogSchema = new Schema(
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

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
    imageCover: String,
  },
  { timestamps: true }
);

blogSchema.post("init", function () {
  if (this.imageCover)
    this.imageCover = process.env.BaseURL + "blogs/" + this.imageCover;
});

export const blogModel = mongoose.models.blog || model("blog", blogSchema);
