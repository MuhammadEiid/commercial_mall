import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import * as handler from "../controllersHandler.js";
import { promisify } from "util";
import fs from "fs";
import { homeModel } from "../../../Database/models/Homepage.model.js";

// Function to promisify fs.unlink
const unlinkAsync = promisify(fs.unlink);

const updateLayerText = catchError(async (req, res, next) => {
  const { en, ar } = req.body;

  if (!en && !ar) {
    return next(
      new AppError("you must provide layer text with arabic and english", 400)
    );
  }

  let home = await homeModel.findOne({});

  if (!home) {
    return next(new AppError("Home document not found", 404));
  }

  if (en) home.layerText.en = en;
  if (ar) home.layerText.ar = ar;

  const updatedHome = await home.save();

  if (!updatedHome) {
    return next(new AppError("Failed to update layer text", 500));
  }

  res.json({
    layerText: updatedHome.layerText,
  });
});

const deleteLayerText = catchError(async (req, res, next) => {
  let home = await homeModel.findOne({});

  if (!home || !home.layerText) {
    return next(new AppError("Layer text not found", 404));
  }

  home.layerText = undefined;

  const updatedHome = await home.save();

  if (!updatedHome) {
    return next(new AppError("Failed to delete layer text", 500));
  }

  res.json({ message: "Layer text deleted successfully" });
});

// Add images
const addImages = catchError(async (req, res, next) => {
  // Assuming you're using multer to upload the image
  if (!req.file) {
    return next(new AppError("No image file provided", 400));
  }

  if (!req.body.en || !req.body.ar) {
    return next(
      new AppError("Both English and Arabic titles are required", 400)
    );
  }
  // Create a new image object
  const newImage = {
    image: req.file.filename, // The name of the uploaded image file
    alt: {
      en: req.body.en, // English title
      ar: req.body.ar, // Arabic title
    },
  };

  // Find the home document and push the new image to the "images" array
  let home = await homeModel.findOne({});

  if (!home) {
    // Create a new home document
    home = new homeModel({});
    await home.save();
  }

  const updatedHome = await homeModel.findOneAndUpdate(
    {},
    { $push: { images: newImage } },
    { new: true }
  );
  if (!updatedHome) {
    return next(new AppError("Failed to add the image", 500));
  } else {
    return res.json(updatedHome.images);
  }
});

// Add Video
const addVideos = catchError(async (req, res, next) => {
  // Assuming you're using multer to upload the video
  if (!req.file) {
    return next(new AppError("No video file provided", 400));
  }

  if (!req.body.en || !req.body.ar) {
    return next(
      new AppError("Both English and Arabic titles are required", 400)
    );
  }
  // Create a new video object
  const newVideo = {
    video: req.file.filename, // The name of the uploaded video file
    alt: {
      en: req.body.en, // English title
      ar: req.body.ar, // Arabic title
    },
  };

  // Find the home document and push the new video to the "videos" array
  let home = await homeModel.findOne({});

  if (!home) {
    // Create a new home document
    home = new homeModel({});
    await home.save();
  }

  const updatedHome = await homeModel.findOneAndUpdate(
    {},
    { $push: { videos: newVideo } },
    { new: true }
  );

  if (!updatedHome) {
    return next(new AppError("Failed to add the video", 500));
  } else {
    return res.json(updatedHome.videos);
  }
});

const getAllHome = handler.getAll(homeModel, "Data");
const getAllHomeNoPagination = handler.getAllWithoutPaginationNoRole(
  homeModel,
  "Home"
);

// Delete all images
const deleteAllImages = catchError(async (req, res, next) => {
  const home = await homeModel.findOne({});

  if (!home) {
    return next(new AppError("Something went wrong!", 404));
  }

  // Extract all image filenames
  const imageFilenames = home.images.map((image) =>
    image.image.replace(process.env.BaseURL + "backend/home/", "")
  );

  // Update the database to clear images
  await homeModel.findOneAndUpdate({}, { $set: { images: [] } });

  // Delete all image files
  imageFilenames.forEach((filename) => {
    unlinkAsync(`uploads/home/${filename}`)
      .then(() => {})
      .catch((err) => {
        console.error("Error deleting file:", err);
        return next(new AppError("Error deleting file", 500));
      });
  });

  return res.status(200).json({ message: "Images have been cleared" });
});
// Delete all videos
const deleteAllVideos = catchError(async (req, res, next) => {
  const home = await homeModel.findOne({});

  if (!home) {
    return next(new AppError("Something went wrong!", 404));
  }

  const videoFilenames = home.videos.map((video) =>
    video.video.replace(process.env.BaseURL + "backend/home/", "")
  );

  await homeModel.findOneAndUpdate({}, { $set: { videos: [] } });

  videoFilenames.forEach((filename) => {
    unlinkAsync(`uploads/home/${filename}`)
      .then(() => {})
      .catch((err) => {
        console.error("Error deleting file:", err);
        return next(new AppError("Error deleting file", 500));
      });
  });

  return res.status(200).json({ message: "Videos have been cleared" });
});

const deleteImage = catchError(async (req, res, next) => {
  const { id } = req.params;

  const folderName = "home"; // Replace with the actual folderName

  // Use uploadMiddleware here for handling the request

  const home = await homeModel.findOne({});

  if (!home) {
    return next(new AppError("Something went wrong!", 404));
  }

  const image = home.images.find((image) => image._id.toString() === id);

  if (!image) {
    return next(new AppError("Image not found", 404));
  }

  await homeModel.findOneAndUpdate(
    {},
    { $pull: { images: { _id: id } } },
    { new: true }
  );

  // Handle file deletion
  const filename = image.image.replace(
    process.env.BaseURL + "backend/home/",
    ""
  );
  unlinkAsync(`uploads/${folderName}/${filename}`, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      // Pass the error to the global error handler
      return next(new AppError("Error deleting file", 500));
    }
    // File deleted successfully
    return res.status(200).json({ message: "Image Deleted Successfully" });
  });
});

// Delete specific video
const deleteVideo = catchError(async (req, res, next) => {
  const { id } = req.params;

  const folderName = "home"; // Replace with the actual folderName

  // Use uploadMiddleware here for handling the request

  const home = await homeModel.findOne({});

  if (!home) {
    return next(new AppError("Something went wrong!", 404));
  }

  const video = home.videos.find((video) => video._id.toString() === id);

  if (!video) {
    return next(new AppError("Video not found", 404));
  }

  // Get the filename from the video object
  const filename = video.video.replace(
    process.env.BaseURL + "backend/home/",
    ""
  );

  await homeModel.findOneAndUpdate(
    {},
    { $pull: { videos: { _id: id } } },
    { new: true }
  );

  // Delete the file from the folder
  unlinkAsync(`uploads/${folderName}/${filename}`)
    .then(() => {
      // File deleted successfully
      return res.status(200).json({ message: "Video Deleted Successfully" });
    })
    .catch((err) => {
      console.error("Error deleting file:", err);
      // Pass the error to the global error handler
      return next(new AppError("Error deleting file", 500));
    });
});

export {
  addImages,
  addVideos,
  deleteAllVideos,
  deleteAllImages,
  deleteVideo,
  getAllHome,
  deleteImage,
  getAllHomeNoPagination,
  updateLayerText,
  deleteLayerText,
};
