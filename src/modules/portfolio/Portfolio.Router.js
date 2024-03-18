import express from "express";
import * as portfolio from "./Portfolio.Controller.js";
import { validate } from "../../middleware/validate.js";
import {
  addPortfolioSchema,
  getOrDeletePortfolioSchema,
  getPortfolioByCategorySchema,
  updatePortfolioSchema,
} from "./portfolioValidation.js";
import {
  allowedTo,
  protectedRoutes,
} from "../Authentication/authController.js";
import { uploadSingleFile } from "../../File Upload/multer.js";

const portfolioRouter = express.Router();

portfolioRouter
  .route("/")
  .post(
    validate(addPortfolioSchema),
    protectedRoutes,
    allowedTo("admin"),
    uploadSingleFile("pdf", "portfolio"),
    portfolio.addPortfolio
  )
  .get(portfolio.getAllPortfolios);

portfolioRouter
  .route("/:category")
  .get(
    validate(getPortfolioByCategorySchema),
    portfolio.getPortfolioByCategory
  );

portfolioRouter
  .route("/:id")
  .put(
    validate(updatePortfolioSchema),
    protectedRoutes,
    allowedTo("admin"),
    uploadSingleFile("pdf", "portfolio"),
    portfolio.updatePortfolio
  )
  .delete(
    validate(getOrDeletePortfolioSchema),
    protectedRoutes,
    allowedTo("admin"),
    portfolio.deletePortfolio
  );

export default portfolioRouter;
