import express from "express";
import * as bot from "./Chatbot.Controller.js";
import {
  allowedTo,
  protectedRoutes,
} from "../Authentication/authController.js";
import { validate } from "../../middleware/validate.js";
import { checkID } from "../user/userValidation.js";
import { addContentSchema, updateContentSchema } from "./chatValidation.js";

const chatRouter = express.Router();

chatRouter
  .route("/")
  .post(
    validate(addContentSchema),
    protectedRoutes,
    allowedTo("admin"),
    bot.addChat
  )
  .get(bot.getAllChatbot);

chatRouter
  .route("/:id")
  .put(
    validate(updateContentSchema),
    protectedRoutes,
    allowedTo("admin"),
    bot.updateChatbot
  )
  .delete(
    validate(checkID),
    protectedRoutes,
    allowedTo("admin"),
    bot.deleteQuestion
  )
  .get(validate(checkID), bot.getChatbot);

export default chatRouter;
