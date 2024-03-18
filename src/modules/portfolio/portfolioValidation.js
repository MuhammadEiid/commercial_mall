import Joi from "joi";

// Joi Schema for adding a portfolio item
const addPortfolioSchema = Joi.object({
  pdf: Joi.string(),
  category: Joi.string().valid(
    "Administrative",
    "Medical",
    "Commercial",
    "Home"
  ),
});

// Joi Schema for updating a portfolio item
const updatePortfolioSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
  pdf: Joi.string(),
  category: Joi.string().valid(
    "Administrative",
    "Medical",
    "Commercial",
    "Home"
  ),
}).min(1); // Ensure at least one field is provided for the update

// Joi Schema for getting or deleting a portfolio item
const getOrDeletePortfolioSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

// Joi Schema for getting portfolio items by category
const getPortfolioByCategorySchema = Joi.object({
  category: Joi.string()
    .valid("Administrative", "Medical", "Commercial", "Home")
    .required(),
});
export {
  addPortfolioSchema,
  updatePortfolioSchema,
  getOrDeletePortfolioSchema,
  getPortfolioByCategorySchema,
};
