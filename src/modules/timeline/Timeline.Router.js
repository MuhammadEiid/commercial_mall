import express from "express";
import * as timeline from "./Timeline.Controller.js";
import {
  allowedTo,
  protectedRoutes,
} from "../Authentication/authController.js";
import { uploadSingleFile } from "../../File Upload/multer.js";
import { validate } from "../../middleware/validate.js";
import { checkID } from "../user/userValidation.js";
import { addContentSchema, updateContentSchema } from "./timelineValidation.js";

const timelineRouter = express.Router();

timelineRouter
  .route("/")
  .post(
    validate(addContentSchema),
    protectedRoutes,
    allowedTo("admin"),
    uploadSingleFile("image", "timeline"),
    timeline.addTimeline
  )
  .get(timeline.getAllTimelines);

timelineRouter
  .route("/:id")
  .put(
    validate(updateContentSchema),
    protectedRoutes,
    allowedTo("admin"),
    uploadSingleFile("image", "timeline"),
    timeline.updateTimeline
  )
  .delete(
    validate(checkID),
    protectedRoutes,
    allowedTo("admin"),
    timeline.deleteTimeline
  )
  .get(validate(checkID), timeline.getTimeline);

export default timelineRouter;
