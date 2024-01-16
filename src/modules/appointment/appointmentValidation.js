import Joi from "joi";

const appointmentSchema = Joi.object({
  mainType: Joi.string()
    .valid("Administrative", "Medical", "Commercial")
    .required(),

  secondaryType: Joi.object({
    ar: Joi.string(),
    en: Joi.string(),
  })
    .or("ar", "en")
    .required(),

  name: Joi.string().required().min(3).max(50),
  message: Joi.string().required().min(5).max(450),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .required(),
  phone: Joi.string()
    .pattern(/^\+?([0-9] ?){6,14}[0-9]$/)
    .required(),
});

export { appointmentSchema };
