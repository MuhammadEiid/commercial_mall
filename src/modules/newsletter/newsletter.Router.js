import express from "express";
import { validate } from "../../middleware/validate.js";
import {
  allowedTo,
  protectedRoutes,
} from "../Authentication/authController.js";
import { getAllSubscribers, subscribe } from "./newsletter.Controller.js";
import { emailCheck } from "./newsletterValidation.js";

const newsletterRouter = express.Router();

newsletterRouter
  .route("/")
  .post(validate(emailCheck), subscribe)
  .get(protectedRoutes, allowedTo("admin"), getAllSubscribers);

export default newsletterRouter;
