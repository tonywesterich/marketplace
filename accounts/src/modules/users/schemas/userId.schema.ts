import joi from 'joi';

export const userIdSchema = joi.string().required().uuid().label('id');
