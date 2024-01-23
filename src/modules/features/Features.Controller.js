import { featuresModel } from "../../../Database/models/Features.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import * as handler from "../controllersHandler.js";
import { addContentSchema } from "./FeaturesValidation.js";

const addFeature = catchError(async (req, res, next) => {
  const { error } = addContentSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }
  if (!req.body.title) {
    return next(new AppError("Title is required", 400));
  }
  if (!req.body.description) {
    return next(new AppError("Description is required", 400));
  }
  if (!req.file) {
    return next(new AppError("No file uploaded", 400));
  }
  req.body.imageCover = req.file.filename;

  const features = new featuresModel(req.body);
  if (!features) {
    return next(new AppError("Something went wrong", 404));
  }

  await features.save();

  res.status(200).json({
    message: `Features Added Successfully`,
    features,
  });
});

const getAllFeatures = handler.getAll(featuresModel, "Features");
const getAllFeaturesNoPagination = handler.getAllWithoutPaginationNoRole(
  featuresModel,
  "Features"
);

const updateFeature = catchError(async (req, res, next) => {
  const { title, description } = req.body;
  const { id } = req.params;

  if (title) {
    if (!title.en && !title.ar) {
      return next(
        new AppError("Please provide a title in English or Arabic", 400)
      );
    }
  }
  if (description) {
    if (!description.en && !description.ar) {
      return next(
        new AppError("Please provide a description in English or Arabic", 400)
      );
    }
  }
  if (req.file) {
    req.body.imageCover = req.file.filename;
  }

  const updatedFeatures = await featuresModel.findOneAndUpdate(
    { _id: id },
    req.body,
    { new: true }
  );
  if (!updatedFeatures) {
    return next(new AppError("Features not found", 404));
  }

  res.status(200).json({
    message: `Features Updated Successfully`,
    updatedFeatures,
  });
});

const deleteFeature = catchError(async (req, res, next) => {
  const { id } = req.params;

  const features = await featuresModel.findByIdAndDelete({
    _id: id,
  });

  if (!features) {
    return next(new AppError("Features not found", 404));
  }

  res.status(200).json({
    message: `Feature Deleted Successfully`,
  });
});

const getFeature = handler.getOne(featuresModel, "Feature");

export {
  addFeature,
  getAllFeatures,
  updateFeature,
  getAllFeaturesNoPagination,
  deleteFeature,
  getFeature,
};
