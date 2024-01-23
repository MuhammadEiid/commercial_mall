import Joi from "joi";

const addContentSchema = Joi.object({
  question: Joi.object({
    ar: Joi.string().required().min(3),
    en: Joi.string().required().min(3),
  }),
  answer: Joi.object({
    ar: Joi.string().required().min(3),
    en: Joi.string().required().min(3),
  }),
});
const updateContentSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
  question: Joi.object({
    ar: Joi.string().min(3),
    en: Joi.string().min(3),
  }),
  answer: Joi.object({
    ar: Joi.string().min(3),
    en: Joi.string().min(3),
  }),
});
export { addContentSchema, updateContentSchema };
