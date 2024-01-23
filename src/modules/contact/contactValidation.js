import Joi from "joi";

const contactSchema = Joi.object({
  name: Joi.string().required().min(3).max(50),
  message: Joi.string().required().min(5).max(350),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .required(),
  phone: Joi.string()
    .pattern(/^\+?([0-9] ?){6,14}[0-9]$/)
    .required(),
});

export { contactSchema };
