import { reviewModel } from "../../../Database/models/Review.model.js";
import { userModel } from "../../../Database/models/User.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import * as handler from "../controllersHandler.js";

const addReview = catchError(async (req, res, next) => {
  const { text } = req.body;

  if (!text || (!text.en && !text.ar)) {
    return next(
      new AppError("Please provide a text in English or Arabic", 400)
    );
  }

  if (text.en && text.ar) {
    return next(
      new AppError(
        "Please provide a text in either English or Arabic, not both",
        400
      )
    );
  }

  // to restrict user from making more than one review
  let existingReview = await reviewModel.findOne({
    user: req.user._id,
  });
  if (existingReview) {
    return next(new AppError("You created a review before", 409));
  }
  const review = new reviewModel({
    ...req.body,
    user: req.user._id,
  });

  await review.save();

  // Add the review to the user's reviews array
  await userModel.findByIdAndUpdate(
    req.user._id,
    { $push: { reviews: review._id } },
    { new: true }
  );
  res.status(200).json({
    message: `Review Added Successfully`,
    review,
  });
});

const getAllReviews = handler.getAll(reviewModel, "Reviews");
const updateReview = catchError(async (req, res, next) => {
  const { text } = req.body;
  const { id } = req.params;

  if (req.body.text) {
    if (!text || (!text.en && !text.ar)) {
      return next(
        new AppError("Please provide a text in English or Arabic", 400)
      );
    }
  }

  let review = await reviewModel.findOneAndUpdate(
    { _id: id, user: req.user._id },
    req.body,
    { new: true }
  );

  if (review) {
    res.status(200).json({
      message: `Review Updated Successfully`,
      review,
    });
  } else {
    return next(new AppError(`Review Not Found`, 404));
  }
});

const deleteReview = catchError(async (req, res, next) => {
  const review = await reviewModel.findByIdAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (review) {
    // Remove the review from the user's reviews array
    await userModel.findByIdAndUpdate(
      req.user._id,
      { $pull: { reviews: review._id } },
      { new: true }
    );

    res.status(200).json({
      message: `Review is Deleted Successfully`,
    });
  } else {
    return next(new AppError(`Review Not Found`, 404));
  }
});

const getReview = handler.getOne(reviewModel, "Review");

export { addReview, getAllReviews, updateReview, deleteReview, getReview };
