import mongoose, { Schema, model } from "mongoose";

const mallSchema = new Schema(
  {
    model: {
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
        unitIdentifier: { type: [String], required: true },
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

        availability: {
          type: Boolean,
          default: false,
        },
      },
    },
  },

  { timestamps: true }
);

mallSchema.post("init", function () {
  if (this.model.details.images && Array.isArray(this.model.details.images)) {
    this.model.details.images = this.model.details.images.map((elm) => {
      if (!elm.startsWith(process.env.BaseURL)) {
        return process.env.BaseURL + "mall/models/" + elm;
      }
      return elm;
    });
  }
});

export const mallModel = mongoose.models.mall || model("mall", mallSchema);
