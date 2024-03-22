import joi from 'joi';

export const responseUserSchema = joi.object().keys({
  id: joi
    .string()
    .required()
    .uuid(),
  email: joi
    .string()
    .required()
    .email()
    .max(60),
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
