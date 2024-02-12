import mongoose, { Schema, model } from "mongoose";

const timelineSchema = new Schema(
  {
    content: {
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
      date: String,
    },

    image: String,
  },
  { timestamps: true }
);

timelineSchema.post("init", function () {
  if (this.image) this.image = process.env.BaseURL + "timeline/" + this.image;
});

export const timelineModel =
  mongoose.models.timeline || model("timeline", timelineSchema);
