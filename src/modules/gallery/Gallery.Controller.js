import { galleryModel } from "../../../Database/models/Gallery.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import * as handler from "../controllersHandler.js";
import { promisify } from "util";
import fs from "fs";

// Function to promisify fs.unlink
const unlinkAsync = promisify(fs.unlink);

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

  // Find the gallery document and push the new image to the "images" array
  let gallery = await galleryModel.findOne({});

  if (!gallery) {
    // Create a new gallery document
    gallery = new galleryModel({});
    await gallery.save();
  }

  const updatedGallery = await galleryModel.findOneAndUpdate(
    {},
    { $push: { images: newImage } },
    { new: true }
  );

  res.json(updatedGallery.images);
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

  // Find the gallery document and push the new video to the "videos" array
  let gallery = await galleryModel.findOne({});

  if (!gallery) {
    // Create a new gallery document
    gallery = new galleryModel({});
    await gallery.save();
  }

  const updatedGallery = await galleryModel.findOneAndUpdate(
    {},
    { $push: { videos: newVideo } },
    { new: true }
  );

  res.json(updatedGallery.videos);
});

const getAllGallery = handler.getAll(galleryModel, "Gallery");
const getAllGalleryNoPagination = handler.getAllWithoutPaginationNoRole(
  galleryModel,
  "Gallery"
);

// Delete all images
const deleteAllImages = catchError(async (req, res, next) => {
  const gallery = await galleryModel.findOne({});

  if (!gallery) {
    return next(new AppError("Something went wrong!", 404));
  }

  // Extract all image filenames
  const imageFilenames = gallery.images.map((image) =>
    image.image.replace(process.env.BaseURL + "gallery/", "")
  );

  // Update the database to clear images
  await galleryModel.findOneAndUpdate({}, { $set: { images: [] } });

  // Delete all image files
  imageFilenames.forEach((filename) => {
    unlinkAsync(`uploads/gallery/${filename}`)
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
  const gallery = await galleryModel.findOne({});

  if (!gallery) {
    return next(new AppError("Something went wrong!", 404));
  }

  const videoFilenames = gallery.videos.map((video) =>
    video.video.replace(process.env.BaseURL + "gallery/", "")
  );

  await galleryModel.findOneAndUpdate({}, { $set: { videos: [] } });

  videoFilenames.forEach((filename) => {
    unlinkAsync(`uploads/gallery/${filename}`)
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

  const folderName = "gallery"; // Replace with the actual folderName

  // Use uploadMiddleware here for handling the request

  const gallery = await galleryModel.findOne({});

  if (!gallery) {
    return next(new AppError("Something went wrong!", 404));
  }

  const image = gallery.images.find((image) => image._id.toString() === id);

  if (!image) {
    return next(new AppError("Image not found", 404));
  }

  await galleryModel.findOneAndUpdate(
    {},
    { $pull: { images: { _id: id } } },
    { new: true }
  );

  // Handle file deletion
  const filename = image.image.replace(process.env.BaseURL + "gallery/", "");
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

  const folderName = "gallery"; // Replace with the actual folderName

  // Use uploadMiddleware here for handling the request

  const gallery = await galleryModel.findOne({});

  if (!gallery) {
    return next(new AppError("Something went wrong!", 404));
  }

  const video = gallery.videos.find((video) => video._id.toString() === id);

  if (!video) {
    return next(new AppError("Video not found", 404));
  }

  // Get the filename from the video object
  const filename = video.video.replace(process.env.BaseURL + "gallery/", "");

  await galleryModel.findOneAndUpdate(
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
  getAllGallery,
  deleteImage,
  getAllGalleryNoPagination,
};
