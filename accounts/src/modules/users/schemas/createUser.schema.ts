import joi from 'joi';

export const createUserSchema = joi.object().keys({
  email: joi
    .string()
    .required()
    .email()
    .max(60),
  password: joi
    .string()
    .required()
    .min(6)
    .max(18)
    .regex(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
    .message('Password too weak'),
  name: joi
    .string()
    .required()
    .min(3)
    .max(50),
  role: joi
    .string()
    .required()
    .lowercase()
    .valid('admin', 'customer', 'partner'),
});
