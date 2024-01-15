import express from "express";
import * as review from "./reviewController.js";
import {
  allowedTo,
  protectedRoutes,
} from "../Authentication/authController.js";
import { validate } from "../../middleware/validate.js";
import { checkID } from "../user/userValidation.js";

const reviewRouter = express.Router();

reviewRouter
  .route("/")
  .post(protectedRoutes, allowedTo("user"), review.addReview)
  .get(review.getAllReviews);
reviewRouter
  .route("/:id")
  .put(
    validate(checkID),
    protectedRoutes,
    allowedTo("user"),
    review.updateReview
  )
  .delete(
    validate(checkID),
    protectedRoutes,
    allowedTo("user"),
    review.deleteReview
  )
  .get(validate(checkID), review.getReview);

export default reviewRouter;
