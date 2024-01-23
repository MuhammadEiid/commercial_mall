import Joi from "joi";

const addContentSchema = Joi.object({
  title: Joi.object({
    en: Joi.string().required().min(3),
    ar: Joi.string().required().min(3),
  }),
  description: Joi.object({
    en: Joi.string().required().min(3),
    ar: Joi.string().required().min(3),
  }),
  section: Joi.array().items(
    Joi.object({
      title: Joi.object({
        en: Joi.string().required().min(3),
        ar: Joi.string().required().min(3),
      }),
      content: Joi.object({
        en: Joi.string().required().min(3),
        ar: Joi.string().required().min(3),
      }),
    })
  ),
  imageCover: Joi.string(),
});
export { addContentSchema };
