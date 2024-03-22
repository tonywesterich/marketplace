import joi from 'joi';
import { responseUserSchema } from './user.response.schema';

export const responseUserListSchema = joi.array().items(responseUserSchema).required();
