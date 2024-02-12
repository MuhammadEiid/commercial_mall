import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import * as handler from "../controllersHandler.js";
import { addContentSchema } from "./timelineValidation.js";
import { promisify } from "util";
import fs from "fs";
import { timelineModel } from "../../../Database/models/Timeline.model.js";

const unlinkAsync = promisify(fs.unlink);

const addTimeline = catchError(async (req, res, next) => {
  const { title, description, date } = req.body;
  const { error } = addContentSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }

  const requiredFields = [
    title?.ar,
    title?.en,
    description?.ar,
    description?.en,
    date,
  ];

  if (requiredFields.some((field) => field === undefined)) {
    return next(new AppError("Required fields are missing", 404));
  }

  if (!req.file) {
    return next(new AppError("No file uploaded", 400));
  }

  const timeline = new timelineModel({
    content: {
      title: {
        ar: title.ar,
        en: title.en,
      },
      description: {
        ar: description.ar,
        en: description.en,
      },
      date,
    },
    image: req.file.filename,
  });

  if (!timeline) {
    return next(new AppError("Something went wrong!", 400));
  }
  await timeline.save();

  res.status(200).json({
    message: `Timeline Added Successfully`,
    timeline,
  });
});

const getAllTimelines = handler.getAll(timelineModel, "Timeline");

const updateTimeline = catchError(async (req, res, next) => {
  const { id } = req.params;
  const { title, description, date } = req.body;
  const folderName = "timeline";

  // Find the timeline by ID
  let timeline = await timelineModel.findById(id);

  // If the timeline doesn't exist, return an error
  if (!timeline) {
    return next(new AppError("Timeline not found", 404));
  }

  // Update the title if provided
  if (title) {
    timeline.content.title = {
      ar: title.ar || timeline.content.title.ar,
      en: title.en || timeline.content.title.en,
    };
  }

  // Update the description if provided
  if (description) {
    timeline.content.description = {
      ar: description.ar || timeline.content.description.ar,
      en: description.en || timeline.content.description.en,
    };
  }

  // Update the date if provided
  if (date) {
    timeline.content.date = date;
  }

  // Update image if provided
  if (req.file) {
    // Handle file deletion if the image exists
    const filename = timeline.image.replace(
      process.env.BaseURL + "timeline/",
      ""
    );

    const imagePath = `uploads/${folderName}/${filename}`;

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
    timeline.image = req.file.filename;
  }

  // Save the updated timeline object
  timeline = await timeline.save();

  // Return the updated timeline object
  return res.status(200).json(timeline);
});

const deleteTimeline = catchError(async (req, res, next) => {
  const { id } = req.params;
  const folderName = "timeline";

  const timeline = await timelineModel.findByIdAndDelete(id);

  if (!timeline) {
    return next(new AppError(`Timeline Not Found`, 404));
  }

  // Handle file deletion if the image exists
  const filename = timeline.image.replace(
    process.env.BaseURL + "timeline/",
    ""
  );

  const imagePath = `uploads/${folderName}/${filename}`;

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
    message: `Timeline Deleted Successfully`,
  });
});

const getTimeline = handler.getOne(timelineModel, "Timeline");

export {
  addTimeline,
  getAllTimelines,
  updateTimeline,
  deleteTimeline,
  getTimeline,
};
