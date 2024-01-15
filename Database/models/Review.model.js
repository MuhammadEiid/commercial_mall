import mongoose, { Schema, model } from "mongoose";

const reviewSchema = new Schema(
  {
    text: {
      en: {
        type: String,
        trim: true,
        min: 3,
        max: 150,
      },
      ar: {
        type: String,
        trim: true,
        min: 3,
        max: 150,
      },
    },

    user: {
      type: Schema.ObjectId,
      ref: "user",
      required: true,
    },

    rate: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function () {
  this.populate("user");
});

export const reviewModel =
  mongoose.models.review || model("review", reviewSchema);
