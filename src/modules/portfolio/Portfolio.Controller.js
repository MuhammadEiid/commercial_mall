import { portfolioModel } from "../../../Database/models/Portfolio.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import * as handler from "../controllersHandler.js";
import { unlink } from "fs/promises";
import fs from "fs";

const addPortfolio = catchError(async (req, res, next) => {
  const { category } = req.body;

  if (!req.file) {
    return next(new AppError("No PDF file provided", 400));
  }
  // Check if category is among the specified enum values
  const validCategory = ["Administrative", "Medical", "Commercial", "Home"];
  if (!validCategory.includes(category)) {
    return next(new AppError("Invalid Category value", 400));
  }

  const pdf = req.file.filename;

  const newPortfolioItem = {
    portfolio: {
      pdf,
      category,
    },
  };

  const portfolioItem = await portfolioModel.create(newPortfolioItem);

  // Create a new Portfolio object
  if (!portfolioItem) {
    return next(new AppError("Something went wrong", 404));
  }

  res.status(200).json({
    message: `Portfolio added successfully`,
    portfolioItem,
  });
});

const getAllPortfolios = handler.getAll(portfolioModel, "Portfolios");

const getPortfolioByCategory = catchError(async (req, res, next) => {
  const { category } = req.params;

  if (!category) {
    return next(new AppError("Category is required", 400));
  }

  const portfolio = await portfolioModel.find({
    "portfolio.category": category,
  });

  if (!portfolio) {
    return next(
      new AppError("No portfolio found for the specified category", 404)
    );
  }

  res.status(200).json({
    status: "success",
    portfolio,
  });
});

const updatePortfolio = catchError(async (req, res, next) => {
  const { id } = req.params;
  const { category } = req.body;

  // Check if portfolio item exists
  const existingPortfolio = await portfolioModel.findById(id);
  if (!existingPortfolio) {
    return next(new AppError("Portfolio item not found", 404));
  }

  // Initialize updateFields with an empty object
  const updateFields = {};

  // If PDF file was uploaded
  if (req.file) {
    const pdf = req.file.filename;

    // Check if the uploaded file name is different from the existing one
    if (existingPortfolio.portfolio.pdf !== pdf) {
      // Remove the old PDF file if it exists
      if (existingPortfolio.portfolio.pdf) {
        const folderName = "portfolio"; // Replace with the actual folderName

        const filename = existingPortfolio.portfolio.pdf.replace(
          process.env.BaseURL + "portfolio/",
          ""
        );

        const filePath = `uploads/${folderName}/${filename}`;

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        } else {
          console.warn("File not found:", filePath);
        }
      }

      // Add the new PDF file
      updateFields["portfolio.pdf"] = pdf;
    }
  }

  // If category was provided, add it to updateFields
  if (category) {
    // Check if category is among the specified enum values
    const validCategory = ["Administrative", "Medical", "Commercial", "Home"];
    if (!validCategory.includes(category)) {
      return next(new AppError("Invalid Category value", 400));
    }
    updateFields["portfolio.category"] = category;
  }

  // Update the portfolio item
  const updatedPortfolio = await portfolioModel.findByIdAndUpdate(
    id,
    updateFields,
    { new: true }
  );

  res
    .status(200)
    .json({ message: "Portfolio item updated successfully", updatedPortfolio });
});

const deletePortfolio = catchError(async (req, res, next) => {
  const { id } = req.params;

  // Find the portfolio item by its ID
  const portfolio = await portfolioModel.findById(id);
  if (!portfolio) {
    return next(new AppError("Portfolio item not found", 404));
  }

  // If the portfolio item has a PDF file, check if it exists in the folder and delete it
  if (portfolio.portfolio.pdf) {
    const folderName = "portfolio"; // Replace with the actual folderName

    const filename = portfolio.portfolio.pdf.replace(
      process.env.BaseURL + "portfolio/",
      ""
    );

    const filePath = `uploads/${folderName}/${filename}`;

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  // Delete the portfolio item from the database
  await portfolioModel.findByIdAndDelete(id);

  res.status(200).json({ message: "Portfolio item deleted successfully" });
});

export {
  addPortfolio,
  getAllPortfolios,
  getPortfolioByCategory,
  deletePortfolio,
  updatePortfolio,
};
