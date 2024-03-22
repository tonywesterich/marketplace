import joi from 'joi';

export const validateUserSchema = joi.object().keys({
  email: joi
    .string()
    .required()
    .email()
    .max(60),
  password: joi
    .string()
    .required(),
});
