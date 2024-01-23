import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import * as handler from "../controllersHandler.js";
import { promisify } from "util";
import fs from "fs";
import { brandModel } from "../../../Database/models/Brand.model.js";

// Function to promisify fs.unlink
const unlinkAsync = promisify(fs.unlink);

// Add images
const addBrands = catchError(async (req, res, next) => {
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

  let brand = await brandModel.findOne({});

  if (!brand) {
    // Create a new brand document
    brand = new brandModel({});
    await brand.save();
  }

  const updatedBrand = await brandModel.findOneAndUpdate(
    {},
    { $push: { images: newImage } },
    { new: true }
  );

  res.json(updatedBrand.images);
});

const getAllBrands = handler.getAll(brandModel, "Brands");
const getAllBrandsNoPagination = handler.getAllWithoutPaginationNoRole(
  brandModel,
  "Brands"
);

// Delete all images
const deleteAllBrands = catchError(async (req, res, next) => {
  const brands = await brandModel.findOne({});

  if (!brands) {
    return next(new AppError("Something went wrong!", 404));
  }

  // Extract all image filenames
  const imageFilenames = brands.images.map((image) =>
    image.image.replace(process.env.BaseURL + "mall/brands/", "")
  );

  // Update the database to clear images
  await brandModel.findOneAndUpdate({}, { $set: { images: [] } });

  // Delete all image files
  imageFilenames.forEach((filename) => {
    unlinkAsync(`uploads/mall/brands/${filename}`)
      .then(() => {})
      .catch((err) => {
        console.error("Error deleting file:", err);
        return next(new AppError("Error deleting file", 500));
      });
  });

  return res.status(200).json({ message: "Brands have been cleared" });
});

const deleteBrand = catchError(async (req, res, next) => {
  const { id } = req.params;

  const folderName = "mall/brands"; // Replace with the actual folderName

  // Use uploadMiddleware here for handling the request

  const brand = await brandModel.findOne({});

  if (!brand) {
    return next(new AppError("Something went wrong!", 404));
  }

  console.log(brand);

  const image = brand.images.find((image) => image._id.toString() === id);

  console.log(image);
  if (!image) {
    return next(new AppError("Image not found", 404));
  }

  await brandModel.findOneAndUpdate(
    {},
    { $pull: { images: { _id: id } } },
    { new: true }
  );

  // Handle file deletion
  const filename = image.image.replace(
    process.env.BaseURL + "mall/brands/",
    ""
  );
  unlinkAsync(`uploads/${folderName}/${filename}`, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      // Pass the error to the global error handler
      return next(new AppError("Error deleting file", 500));
    }
    // File deleted successfully
    return res.status(200).json({ message: "Brand Deleted Successfully" });
  });
});

export {
  addBrands,
  deleteAllBrands,
  getAllBrands,
  deleteBrand,
  getAllBrandsNoPagination,
};
