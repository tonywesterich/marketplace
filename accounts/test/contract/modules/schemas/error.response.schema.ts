import joi from 'joi';

export const responseErrorSchema = joi.object().keys({
  statusCode: joi
    .number()
    .integer()
    .required(),
  messages: joi
    .array()
    .items(joi.string())
    .required()
});
