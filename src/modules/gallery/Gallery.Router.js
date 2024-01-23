import express from "express";
import * as gallery from "./Gallery.Controller.js";
import {
  allowedTo,
  protectedRoutes,
} from "../Authentication/authController.js";
import { uploadSingleFile } from "../../File Upload/multer.js";
import { validate } from "../../middleware/validate.js";
import { checkID } from "../user/userValidation.js";

const galleryRouter = express.Router();

galleryRouter
  .route("/images")
  .post(
    protectedRoutes,
    uploadSingleFile("image", "gallery"),
    gallery.addImages
  );

galleryRouter
  .route("/videos")
  .post(
    protectedRoutes,
    uploadSingleFile("video", "gallery"),
    gallery.addVideos
  );

galleryRouter
  .route("/video/:id")
  .delete(validate(checkID), protectedRoutes, gallery.deleteVideo);

galleryRouter
  .route("/image/:id")
  .delete(validate(checkID), protectedRoutes, gallery.deleteImage);

galleryRouter.route("/images").delete(protectedRoutes, gallery.deleteAllImages);

galleryRouter.route("/videos").delete(protectedRoutes, gallery.deleteAllVideos);

galleryRouter.route("/").get(gallery.getAllGallery);

galleryRouter
  .route("/getAll")
  .get(protectedRoutes, allowedTo("admin"), gallery.getAllGalleryNoPagination);

export default galleryRouter;
