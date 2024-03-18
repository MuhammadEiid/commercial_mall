import mongoose, { Schema, model } from "mongoose";

const portfolioSchema = new Schema(
  {
    portfolio: {
      pdf: {
        type: String,
      },
      category: {
        type: String,
        enum: ["Administrative", "Medical", "Commercial", "Home"],
      },
    },
  },
  { timestamps: true }
);

portfolioSchema.post("init", function () {
  const baseURL = process.env.BaseURL;

  // Update portfolio URL
  if (
    this.portfolio &&
    this.portfolio.pdf &&
    !this.portfolio.pdf.startsWith(baseURL)
  ) {
    this.portfolio.pdf = baseURL + "portfolio/" + this.portfolio.pdf;
  }
});

export const portfolioModel =
  mongoose.models.portfolio || model("portfolio", portfolioSchema);
