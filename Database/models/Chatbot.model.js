import mongoose from "mongoose";

const { Schema, model } = mongoose;

const chatbotSchema = new Schema(
  {
    question: {
      en: {
        type: String,
      },
      ar: {
        type: String,
      },
    },
    answer: {
      en: {
        type: String,
      },
      ar: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

export const chatbotModel =
  mongoose.models.chatbot || model("chatbot", chatbotSchema);
