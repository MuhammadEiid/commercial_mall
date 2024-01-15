import mongoose, { Schema, model } from "mongoose";

const mallSchema = new Schema(
  {
    model: [
      {
        mainType: {
          type: String,
          enum: ["Administrative", "Medical", "Commercial"],
          required: true,
        },

        secondaryType: {
          ar: { type: String, required: true },
          en: { type: String, required: true },
        },

        details: {
          images: {
            type: [String],
            required: true,
          },
          length: { type: Number, required: true },
          width: { type: Number, required: true },
          height: { type: Number, required: true },
          squareMeter: { type: Number, required: true },
          description: {
            ar: { type: String },
            en: { type: String },
          },
        },
      },
    ],
  },

  { timestamps: true }
);

mallSchema.post("init", function () {
  if (this.model[0].details.images)
    this.model[0].details.images = this.model[0].details.images.map(
      (elm) => process.env.BaseURL + "mall/models/" + elm
    );
});

export const mallModel = mongoose.models.mall || model("mall", mallSchema);
