import joi from 'joi';

export const changeUserInformationSchema = joi.object().keys({
  name: joi
    .string()
    .optional()
    .min(3)
    .max(50),
});
