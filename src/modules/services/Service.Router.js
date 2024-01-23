import express from "express";
import * as service from "./Service.Controller.js";
import { validate } from "../../middleware/validate.js";

import {
  allowedTo,
  protectedRoutes,
} from "../Authentication/authController.js";
import { uploadSingleFile } from "../../File Upload/multer.js";
import { checkID } from "../user/userValidation.js";
import { addContentSchema } from "./serviceValidation.js";

const serviceRouter = express.Router();

serviceRouter
  .route("/")
  .post(
    protectedRoutes,
    allowedTo("admin"),
    validate(addContentSchema),
    uploadSingleFile("imageCover", "services"),
    service.addService
  )
  .get(service.getAllServices);

  serviceRouter.route("/getAll").get(
    protectedRoutes,
    allowedTo("admin"),
    service.getAllServicesNoPagination);
serviceRouter
  .route("/:id")
  .put(
    validate(checkID),
    protectedRoutes,
    allowedTo("admin"),
    uploadSingleFile("imageCover", "services"),
    service.updateService
  )
  .delete(
    validate(checkID),
    protectedRoutes,
    allowedTo("admin"),
    service.deleteService
  )
  .get(validate(checkID), service.getService);

export default serviceRouter;
