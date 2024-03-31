import Joi from "joi";

const addContentSchema = Joi.object({
  page: Joi.string().min(3),
  image: Joi.string(),
});

const updateContentSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
  page: Joi.string().min(3),
  image: Joi.string(),
});

export { addContentSchema, updateContentSchema };
