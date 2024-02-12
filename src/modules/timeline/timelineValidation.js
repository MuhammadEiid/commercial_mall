import Joi from "joi";

const addContentSchema = Joi.object({
  title: Joi.object({
    en: Joi.string().min(3),
    ar: Joi.string().min(3),
  }),
  description: Joi.object({
    en: Joi.string().min(3),
    ar: Joi.string().min(3),
  }),
  date: Joi.string(),

  image: Joi.string(),
});

const updateContentSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
  content: Joi.array().items(
    Joi.object({
      title: Joi.object({
        en: Joi.string().min(3),
        ar: Joi.string().min(3),
      }),
      description: Joi.object({
        en: Joi.string().min(3),
        ar: Joi.string().min(3),
      }),
      date: Joi.string(),
    })
  ),
  image: Joi.string(),
});
export { addContentSchema, updateContentSchema };
