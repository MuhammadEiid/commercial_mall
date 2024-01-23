import Joi from "joi";

const idValidation = Joi.string().hex().length(24).required();

const passwordValidationPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/;

const pwalidation = Joi.string()
  .pattern(passwordValidationPattern)
  .required()
  .min(5)
  .max(30);

const checkID = Joi.object({
  id: idValidation,
});

const changePasswordValidation = Joi.object({
  oldPassword: pwalidation,
  newPassword: pwalidation,
  repeat_password: Joi.ref("newPassword"),
}).with("newPassword", "repeat_password");

export { changePasswordValidation, checkID };
