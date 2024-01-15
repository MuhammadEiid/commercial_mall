import express from "express";
import * as feature from "./Features.Controller.js";
import { validate } from "../../middleware/validate.js";
import {
  allowedTo,
  protectedRoutes,
} from "../Authentication/authController.js";
import { uploadSingleFile } from "../../File Upload/multer.js";
import { checkID } from "../user/userValidation.js";
import { addContentSchema } from "./FeaturesValidation.js";

const featureRouter = express.Router();

featureRouter
  .route("/")
  .post(
    protectedRoutes,
    allowedTo("admin"),
    validate(addContentSchema),
    uploadSingleFile("imageCover", "features"),
    feature.addFeature
  )
  .get(feature.getAllFeatures);

featureRouter
  .route("/getAll")
  .get(protectedRoutes, allowedTo("admin"), feature.getAllFeaturesNoPagination);
featureRouter
  .route("/:id")
  .put(
    validate(checkID),
    protectedRoutes,
    allowedTo("admin"),
    uploadSingleFile("imageCover", "features"),
    feature.updateFeature
  )
  .delete(
    validate(checkID),
    protectedRoutes,
    allowedTo("admin"),
    feature.deleteFeature
  )
  .get(validate(checkID), feature.getFeature);

export default featureRouter;
