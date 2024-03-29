import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import * as handler from "../controllersHandler.js";
import { promisify } from "util";
import fs from "fs";
import { mallModel } from "../../../Database/models/Mall.model.js";

// Function to promisify fs.unlink
const unlinkAsync = promisify(fs.unlink);

// ---------------------------------------------------------------- //
// ----------------------- Add new Model ------------------------- //
const addModel = catchError(async (req, res, next) => {
  const {
    mainType,
    secondaryType,
    length,
    width,
    height,
    squareMeter,
    description,
    unitIdentifier,
    availability,
  } = req.body;

  if (!unitIdentifier) {
    return next(new AppError("Please enter valid unit identifier", 400));
  }
  // Check if mainType is among the specified enum values
  const validMainTypes = ["Administrative", "Medical", "Commercial"];
  if (!validMainTypes.includes(mainType)) {
    return next(new AppError("Invalid Main Type value", 400));
  }

  const requiredFields = [
    mainType,
    secondaryType?.ar,
    secondaryType?.en,
    req.files?.images,
    length,
    width,
    height,
    squareMeter,
    description?.ar,
    description?.en,
    unitIdentifier,
  ];

  if (requiredFields.some((field) => field === undefined)) {
    return next(new AppError("Required fields are missing", 404));
  }

  const images = req.files.images.map((file) => file.filename);

  const newModel = {
    mainType,
    secondaryType: {
      ar: secondaryType.ar,
      en: secondaryType.en,
    },
    details: {
      unitIdentifier,
      images,
      length,
      width,
      height,
      squareMeter,
      description: {
        ar: description.ar,
        en: description.en,
      },
      availability,
    },
  };

  const mall = await mallModel.create({
    model: newModel,
  });

  res.status(201).json(mall.model);
});

// ----------------------- Get All Models Without Images ------------------------- //

const getAllWithoutImages = catchError(async (req, res, next) => {
  // Find the document by id
  const mall = await mallModel.find({}, { "model.details.images": 0 });
  if (!mall || mall.length === 0) {
    return next(new AppError("Model not found", 404));
  }
  // Send the response without images
  res.status(200).json({ mall });
});

// ---------------------------------------------------------------- //
// ----------------------- Get All Models ------------------------- //

const getAllModels = handler.getAll(mallModel, "Models");

const getlAllModelsNoPagination = handler.getAllWithoutPaginationNoRole(
  mallModel,
  "Models"
);

// ---------------------------------------------------------------- //
// ----------------------- Get One Model ------------------------- //

const getOneModel = handler.getOne(mallModel, "Model");
// ---------------------------------------------------------------- //
// ----------------------- Update Model -------------------------- //
const updateModel = catchError(async (req, res, next) => {
  const { id } = req.params;
  const { mainType, secondaryType, description } = req.body;

  // Find the document by id
  const mall = await mallModel.findById(id);
  if (!mall) {
    return next(new AppError("Model not found", 404));
  }

  // Validate MainType
  if (mainType) {
    const validMainTypes = ["Administrative", "Medical", "Commercial"];
    if (mainType && !validMainTypes.includes(mainType)) {
      return next(new AppError("Invalid Main Type value", 400));
    }
    mall.model.mainType = mainType;
  }

  // Update specific fields
  const updateSecondaryType = (key) => {
    mall.model.secondaryType[key] =
      secondaryType?.[key] !== undefined
        ? secondaryType[key]
        : mall.model.secondaryType[key];
  };

  ["ar", "en"].forEach(updateSecondaryType);

  const updateDescription = (key) => {
    mall.model.details.description[key] =
      description?.[key] !== undefined
        ? description[key]
        : mall.model.details.description[key];
  };

  ["ar", "en"].forEach(updateDescription);

  [
    "length",
    "width",
    "height",
    "squareMeter",
    "unitIdentifier",
    "availability",
  ].forEach((field) => {
    if (req.body[field] !== undefined) {
      mall.model.details[field] = req.body[field];
    }
  });

  // Delete old images if new images are provided
  if (req.files && req.files.images) {
    // Delete old images
    const oldImages = mall.model.details.images;
    for (const oldImage of oldImages) {
      // Check if the image exists in the database
      const imageExistsInDatabase =
        mall.model.details.images.includes(oldImage);
      if (imageExistsInDatabase) {
        const filename = oldImage.replace(
          process.env.BaseURL + "mall/models/",
          ""
        );
        try {
          await unlinkAsync(`uploads/mall/models/${filename}`);
          console.log(`File ${filename} deleted successfully`);
        } catch (err) {
          console.error("Error deleting file:", err);
          // Pass the error to the global error handler
          return next(new AppError("Error deleting file", 500));
        }
      }
    }

    // Update with new images
    mall.model.details.images = req.files.images.map((file) => file.filename);
  }

  // Check if there is any updated data
  if (!isDataUpdated(req.body, mall) && !req.files) {
    return next(new AppError("No data updated", 404));
  }

  // Save the updated document
  const updatedModel = await mall.save();

  res.status(200).json(updatedModel);
});

// Helper function to check if there is any updated data
function isDataUpdated(updatedData, mall) {
  return Object.keys(updatedData).some((key) => {
    return JSON.stringify(updatedData[key]) !== JSON.stringify(mall[key]);
  });
}

// ---------------------------------------------------------------- //
// ----------------------- Delete Model -------------------------- //
const deleteModel = catchError(async (req, res, next) => {
  const { id } = req.params;

  // Find the document by id and delete it
  const deletedModel = await mallModel.findByIdAndDelete(id);

  if (!deletedModel) {
    return next(new AppError("Model not found", 404));
  }

  // Handle file deletion for images
  const folderName = "mall/models"; // Replace with the actual folderName
  const images = deletedModel.model.details.images;

  if (images && images.length > 0) {
    images.forEach(async (image) => {
      const filename = image.replace(
        process.env.BaseURL + folderName + "/",
        ""
      );
      await unlinkAsync(`uploads/${folderName}/${filename}`, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          // Pass the error to the global error handler
          return next(new AppError("Error deleting file", 500));
        }
        // File deleted successfully
        console.log(`File ${filename} deleted successfully`);
      });
    });
  }

  return res.status(200).json({ message: "Deleted Successfully" });
});

const searchForUnit = async (req, res, next) => {
  const { unitIdentifier } = req.body;

  const result = await mallModel.find({
    "model.details.unitIdentifier": unitIdentifier,
  });

  if (result.length > 0) {
    res.status(200).json({
      message: `Unit Found Successfully`,
      result,
    });
  } else {
    next(new AppError(`Unit Not Found`, 404));
  }
};

const searchByMainType = async (req, res, next) => {
  const { mainType } = req.body;

  // Check if mainType is among the specified enum values
  const validMainTypes = ["Administrative", "Medical", "Commercial"];
  if (!validMainTypes.includes(mainType)) {
    return next(new AppError("Invalid Main Type value", 400));
  }
  const units = await mallModel.find(
    { "model.mainType": mainType },
    {
      "model.mainType": mainType,
      "model.details.unitIdentifier": 1,
      "model.details.availability": 1,
      _id: 0,
    }
  );

  if (units.length > 0) {
    return res.status(200).json({ message: `Units Found Successfully`, units });
  } else {
    return next(new AppError(`No Units Available`, 404));
  }
};

export {
  searchByMainType,
  addModel,
  updateModel,
  getAllModels,
  getOneModel,
  deleteModel,
  getlAllModelsNoPagination,
  getAllWithoutImages,
  searchForUnit,
};
