import express from "express";
import * as home from "./Home.Controller.js";
import {
  allowedTo,
  protectedRoutes,
} from "../Authentication/authController.js";
import { uploadSingleFile } from "../../File Upload/multer.js";
import { validate } from "../../middleware/validate.js";
import { checkID } from "../user/userValidation.js";

const homeRouter = express.Router();

homeRouter
  .route("/image")
  .post(protectedRoutes, uploadSingleFile("image", "home"), home.addImages);

homeRouter
  .route("/video")
  .post(protectedRoutes, uploadSingleFile("video", "home"), home.addVideos);

homeRouter
  .route("/video/:id")
  .delete(validate(checkID), protectedRoutes, home.deleteVideo);

homeRouter
  .route("/image/:id")
  .delete(validate(checkID), protectedRoutes, home.deleteImage);

homeRouter.route("/images").delete(protectedRoutes, home.deleteAllImages);

homeRouter.route("/videos").delete(protectedRoutes, home.deleteAllVideos);

homeRouter.route("/").get(home.getAllHome);
homeRouter
  .route("/layertext")
  .put(home.updateLayerText)
  .delete(home.deleteLayerText);

homeRouter
  .route("/getAll")
  .get(protectedRoutes, allowedTo("admin"), home.getAllHomeNoPagination);

export default homeRouter;
