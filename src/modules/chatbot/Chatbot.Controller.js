import { chatbotModel } from "../../../Database/models/Chatbot.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import * as handler from "../controllersHandler.js";
import { addContentSchema } from "./chatValidation.js";

// Add Chatbot data
const addChat = catchError(async (req, res, next) => {
  const chatbot = new chatbotModel(req.body);

  const result = await chatbot.save();
  if (!result) {
    return next(new AppError("Internal Server Error", 500));
  }
  res.status(200).json({
    message: `Added Successfully`,
    result,
  });
});

const getAllChatbot = handler.getAllWithoutPaginationNoRole(
  chatbotModel,
  "Chatbot"
);

const updateChatbot = catchError(async (req, res, next) => {
  const { id } = req.params;

  // Check if the request body has valid data
  const hasValidData =
    (req.body.question && (req.body.question.ar || req.body.question.en)) ||
    (req.body.answer && (req.body.answer.ar || req.body.answer.en));

  if (!hasValidData) {
    return next(
      new AppError("At least one language version must be provided", 400)
    );
  }

  const updateFields = {};

  // Update specific fields based on the provided data
  if (req.body.question) {
    updateFields["question.ar"] = req.body.question.ar;
    updateFields["question.en"] = req.body.question.en;
  }

  if (req.body.answer) {
    updateFields["answer.ar"] = req.body.answer.ar;
    updateFields["answer.en"] = req.body.answer.en;
  }

  const result = await chatbotModel.findByIdAndUpdate(
    { _id: id },
    { $set: updateFields },
    { new: true }
  );

  if (result) {
    res.status(200).json({
      message: ` Updated Successfully`,
      result,
    });
  } else {
    next(new AppError(`Question Not Found`, 404));
  }
});

const deleteQuestion = catchError(async (req, res, next) => {
  const { id } = req.params;

  const result = await chatbotModel.findByIdAndDelete(id);
  if (!result) {
    return next(new AppError(`Question Not Found`, 404));
  }

  res.status(200).json({
    message: `Deleted Successfully`,
  });
});

const getChatbot = handler.getOne(chatbotModel, "Chatbot");

export { addChat, getAllChatbot, updateChatbot, deleteQuestion, getChatbot };
