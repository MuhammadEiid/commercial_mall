import Joi from "joi";

// const passwordValidationPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

const pwValidation = Joi.string()
  // .pattern(passwordValidationPattern)
  .required()
  .min(5)
  .max(30);

const nameSchema = Joi.object({
  en: Joi.string(),
  ar: Joi.string(),
}).or("en", "ar");

const passwordRepeatValidation = Joi.string()
  .valid(Joi.ref("password"))
  .required();

const registerSchema = Joi.object({
  name: nameSchema.required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  gender: Joi.string().valid("male", "female"),
  phone: Joi.string()
    .length(11)
    .pattern(/^[0-9]+$/)
    .required(),
  password: pwValidation,
  repeat_password: passwordRepeatValidation,
});

const loginSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: pwValidation,
});

export { registerSchema, loginSchema };
