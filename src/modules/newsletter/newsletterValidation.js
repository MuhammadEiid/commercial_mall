import Joi from "joi";

const emailCheck = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .required(),
});

export { emailCheck };
