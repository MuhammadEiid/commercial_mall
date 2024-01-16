import Joi from "joi";

const idValidation = Joi.string().hex().length(24).required();

const passwordValidationPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/;

const pwValidation = Joi.string()
  .pattern(passwordValidationPattern)
  .required()
  .min(5)
  .max(30);

const changePasswordToOthers = Joi.object({
  id: idValidation,
  newPassword: pwValidation,
});

const nameSchema = Joi.object({
  en: Joi.string(),
  ar: Joi.string(),
});

const addUser = Joi.object({
  name: nameSchema.required(),
  email: Joi.string()
    .required()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
  gender: Joi.string().valid("male", "female").required(),
  phone: Joi.string()
    .required()
    .pattern(/^[+0-9\s.-]+$/)
    .min(8)
    .max(15),
  password: pwValidation,
  role: Joi.string().valid("user", "admin"),
  address: Joi.string(),
  DOB: Joi.string()
});

const changeRole = Joi.object({
  role: Joi.string().valid("user", "admin").required(),
  id: idValidation,
});

const checkID = Joi.object({
  id: idValidation,
});

const changePasswordValidation = Joi.object({
  oldPassword: pwValidation,
  repeat_password: Joi.ref("newPassword"),
  newPassword: pwValidation,
  id: idValidation,
}).with("newPassword", "repeat_password");

export {
  changePasswordValidation,
  addUser,
  changePasswordToOthers,
  changeRole,
  checkID,
};
