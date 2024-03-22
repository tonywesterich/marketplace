import joi from 'joi';

export const changeUserPasswordSchema = joi.object().keys({
  password: joi
    .string()
    .required()
    .min(6)
    .max(18)
    .regex(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
    .message('Password too weak'),
});
