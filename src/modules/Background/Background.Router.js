import express from "express";
import * as background from "./Background.Controller.js";
import {
  allowedTo,
  protectedRoutes,
} from "../Authentication/authController.js";
import { uploadSingleFile } from "../../File Upload/multer.js";
import { validate } from "../../middleware/validate.js";
import { checkID } from "../user/userValidation.js";
import {
  addContentSchema,
  updateContentSchema,
} from "./backgroundValidation.js";

const backgroundRouter = express.Router();

backgroundRouter
  .route("/")
  .post(
    validate(addContentSchema),
    protectedRoutes,
    allowedTo("admin"),
    uploadSingleFile("image", "mall/pages"),
    background.addBackgroundImage
  )
  .get(background.getAllBackgroundImages);

backgroundRouter
  .route("/:id")
  .put(
    validate(updateContentSchema),
    protectedRoutes,
    allowedTo("admin"),
    uploadSingleFile("image", "mall/pages"),
    background.updateBackgroundImage
  )
  .delete(
    validate(checkID),
    protectedRoutes,
    allowedTo("admin"),
    background.deleteBackgroundImage
  )
  .get(validate(checkID), background.getBackgroundImage);

export default backgroundRouter;
