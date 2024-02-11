import express from "express";
import * as mall from "./Mall.Controller.js";
import {
  allowedTo,
  protectedRoutes,
} from "../Authentication/authController.js";
import { uploadMixedFiles } from "../../File Upload/multer.js";
import { validate } from "../../middleware/validate.js";
import { checkID } from "../user/userValidation.js";
let arrayOfFields = [{ name: "images", maxCount: 8 }];
const mallRouter = express.Router();

mallRouter
  .route("/")
  .post(
    protectedRoutes,
    allowedTo("admin"),
    uploadMixedFiles(arrayOfFields, "mall/models"),
    mall.addModel
  );

mallRouter
  .route("/filter")
  .post(protectedRoutes, allowedTo("admin"), mall.searchForUnit);

mallRouter
  .route("/:id")
  .put(
    protectedRoutes,
    allowedTo("admin"),
    uploadMixedFiles(arrayOfFields, "mall/models"),
    mall.updateModel
  );

mallRouter
  .route("/:id")
  .delete(validate(checkID), protectedRoutes, mall.deleteModel)
  .get(validate(checkID), mall.getOneModel);

mallRouter.route("/").get(mall.getAllModels);

mallRouter
  .route("/getAll")
  .get(protectedRoutes, allowedTo("admin"), mall.getlAllModelsNoPagination);
mallRouter
  .route("/get/data")
  .get(protectedRoutes, allowedTo("admin"), mall.getAllWithoutImages);

export default mallRouter;
