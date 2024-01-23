import express from "express";
import * as contact from "./Contact.Controller.js";
import { validate } from "../../middleware/validate.js";
import { contactSchema } from "./contactValidation.js";
import {
  allowedTo,
  protectedRoutes,
} from "../Authentication/authController.js";

const contactRouter = express.Router();

contactRouter
  .route("/")
  .post(validate(contactSchema), contact.sendEmail)
  .get(protectedRoutes, allowedTo("admin"), contact.getAllEmails);

export default contactRouter;
