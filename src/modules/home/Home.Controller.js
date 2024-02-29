import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import * as handler from "../controllersHandler.js";
import { promisify } from "util";
import fs from "fs";
import { homeModel } from "../../../Database/models/Homepage.model.js";

// Function to promisify fs.unlink
const unlinkAsync = promisify(fs.unlink);

// Add images
const addImages = catchError(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("No image file provided", 400));
  }

  // Initialize the newImage object with the uploaded image filename
  const newImage = {
    image: req.file.filename, // The name of the uploaded image file
  };

  // Dynamically add properties to the newImage object based on the provided request body
  if (req.body.alt || req.body.text || req.body.title || req.body.description) {
    newImage.alt = {
      en: req.body.alt ? req.body.alt.en : "", // Provide default values or leave blank if not provided
      ar: req.body.alt ? req.body.alt.ar : "",
    };
    newImage.button = {
      hyperlink: req.body.hyperlink || "", // Provide a default or leave blank
      text: {
        en: req.body.text ? req.body.text.en : "",
        ar: req.body.text ? req.body.text.ar : "",
      },
    };
    newImage.layerText = {
      title: {
        en: req.body.title ? req.body.title.en : "",
        ar: req.body.title ? req.body.title.ar : "",
      },
      description: {
        en: req.body.description ? req.body.description.en : "",
        ar: req.body.description ? req.body.description.ar : "",
      },
    };
  }

  // Find or create the home document
  let home = await homeModel.findOne({});
  if (!home) {
    home = new homeModel({});
    await home.save();
  }

  // Add the new image to the home document
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
  if (!req.file) {
    return next(new AppError("No video file provided", 400));
  }

  // Initialize the newVideo object with the uploaded video filename
  const newVideo = {
    video: req.file.filename, // The name of the uploaded video file
  };

  // Dynamically add properties to the newVideo object based on the provided request body
  if (req.body.alt || req.body.text || req.body.title || req.body.description) {
    newVideo.alt = {
      en: req.body.alt ? req.body.alt.en : "", // Provide default values or leave blank if not provided
      ar: req.body.alt ? req.body.alt.ar : "",
    };
    newVideo.button = {
      hyperlink: req.body.hyperlink || "", // Provide a default or leave blank
      text: {
        en: req.body.text ? req.body.text.en : "",
        ar: req.body.text ? req.body.text.ar : "",
      },
    };
    newVideo.layerText = {
      title: {
        en: req.body.title ? req.body.title.en : "",
        ar: req.body.title ? req.body.title.ar : "",
      },
      description: {
        en: req.body.description ? req.body.description.en : "",
        ar: req.body.description ? req.body.description.ar : "",
      },
    };
  }

  // Find or create the home document
  let home = await homeModel.findOne({});
  if (!home) {
    home = new homeModel({});
    await home.save();
  }

  // Add the new video to the home document
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
  // updateLayerText,
  // deleteLayerText,
};

// const updateLayerText = catchError(async (req, res, next) => {
//   const { en, ar } = req.body;

//   if (!en && !ar) {
//     return next(
//       new AppError("you must provide layer text with arabic and english", 400)
//     );
//   }

//   let home = await homeModel.findOne({});

//   if (!home) {
//     return next(new AppError("Home document not found", 404));
//   }

//   if (en) home.layerText.en = en;
//   if (ar) home.layerText.ar = ar;

//   const updatedHome = await home.save();

//   if (!updatedHome) {
//     return next(new AppError("Failed to update layer text", 500));
//   }

//   res.json({
//     layerText: updatedHome.layerText,
//   });
// });

// const deleteLayerText = catchError(async (req, res, next) => {
//   let home = await homeModel.findOne({});

//   if (!home || !home.layerText) {
//     return next(new AppError("Layer text not found", 404));
//   }

//   home.layerText = undefined;

//   const updatedHome = await home.save();

//   if (!updatedHome) {
//     return next(new AppError("Failed to delete layer text", 500));
//   }

//   res.json({ message: "Layer text deleted successfully" });
// })
