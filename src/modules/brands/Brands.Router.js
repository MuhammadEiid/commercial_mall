import express from "express";
import * as brand from "./Brands.Controller.js";
import {
  allowedTo,
  protectedRoutes,
} from "../Authentication/authController.js";
import { uploadSingleFile } from "../../File Upload/multer.js";
import { validate } from "../../middleware/validate.js";
import { checkID } from "../user/userValidation.js";

const brandRouter = express.Router();

brandRouter
  .route("/images")
  .post(
    protectedRoutes,
    uploadSingleFile("image", "mall/brands"),
    brand.addBrands
  );

brandRouter
  .route("/image/:id")
  .delete(validate(checkID), protectedRoutes, brand.deleteBrand);

brandRouter.route("/images").delete(protectedRoutes, brand.deleteAllBrands);

brandRouter.route("/").get(brand.getAllBrands);

brandRouter
  .route("/getAll")
  .get(protectedRoutes, allowedTo("admin"), brand.getAllBrandsNoPagination);

export default brandRouter;
