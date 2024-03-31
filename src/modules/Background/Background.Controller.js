import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import * as handler from "../controllersHandler.js";
import { addContentSchema } from "./backgroundValidation.js";
import { promisify } from "util";
import fs from "fs";
import { mainModel } from "../../../Database/models/Background.model.js";

const unlinkAsync = promisify(fs.unlink);

const addBackgroundImage = catchError(async (req, res, next) => {
  const { page } = req.body;
  const { error } = addContentSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }

  const requiredFields = [page];

  if (requiredFields.some((field) => field === undefined)) {
    return next(new AppError("Required fields are missing", 404));
  }

  if (!req.file) {
    return next(new AppError("No file uploaded", 400));
  }

  const backgroundImage = new mainModel({
    page,
    image: req.file.filename,
  });

  if (!backgroundImage) {
    return next(new AppError("Something went wrong!", 400));
  }
  await backgroundImage.save();

  res.status(200).json({
    message: `Background Image Added Successfully`,
  });
});

const getAllBackgroundImages = handler.getAll(mainModel, "Background Images");

const updateBackgroundImage = catchError(async (req, res, next) => {
  const { id } = req.params;
  const { page } = req.body;
  const folderName = "pages";

  // Find the backgroundImage by ID
  let background = await mainModel.findById(id);

  // If the background doesn't exist, return an error
  if (!background) {
    return next(new AppError("Image not found", 404));
  }

  // Update the title if provided
  if (page) {
    background.page = page;
  }

  // Update image if provided
  if (req.file) {
    // Handle file deletion if the image exists
    const filename = background.image.replace(
      process.env.BaseURL + "mall/pages/",
      ""
    );

    const imagePath = `uploads/mall/${folderName}/${filename}`;

    try {
      // Check if the file exists
      fs.accessSync(imagePath, fs.constants.F_OK);

      // If the file exists, delete it
      await unlinkAsync(imagePath);
    } catch (err) {
      // If the file is not found, log the error and continue without throwing an error
      if (err.code === "ENOENT") {
      } else {
        // If there is another error, log and handle it
        return next(new AppError("Error deleting file", 500));
      }
    }
    background.image = req.file.filename;
  }

  // Save the updated background object
  background = await background.save();

  // Return the updated background object
  return res.status(200).json(background);
});

const deleteBackgroundImage = catchError(async (req, res, next) => {
  const { id } = req.params;
  const folderName = "pages";

  const background = await mainModel.findByIdAndDelete(id);

  if (!background) {
    return next(new AppError(`Image Not Found`, 404));
  }

  // Handle file deletion if the image exists
  const filename = background.image.replace(
    process.env.BaseURL + "mall/pages/",
    ""
  );

  const imagePath = `uploads/mall/${folderName}/${filename}`;

  try {
    // Check if the file exists
    fs.accessSync(imagePath, fs.constants.F_OK);

    // If the file exists, delete it
    await unlinkAsync(imagePath);
  } catch (err) {
    // If the file is not found, log the error and continue without throwing an error
    if (err.code === "ENOENT") {
    } else {
      // If there is another error, log and handle it
      return next(new AppError("Error deleting file", 500));
    }
  }

  return res.status(200).json({
    message: `Image Deleted Successfully`,
  });
});

const getBackgroundImage = handler.getOne(mainModel, "Image");

export {
  addBackgroundImage,
  getAllBackgroundImages,
  updateBackgroundImage,
  deleteBackgroundImage,
  getBackgroundImage,
};
