import joi from 'joi';

export const responseHelthCheckSchema = joi.object().keys({
  name: joi
    .string()
    .required(),
  date: joi
    .date()
    .required()
    .iso(),
});
