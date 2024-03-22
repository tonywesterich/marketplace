import bodyParser from 'body-parser';
import { errorMiddleware } from '../framework/middlewares/errorMiddlewares/errorMiddleware';

export const middleware = {
  default: [
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
  ],
  error: [
    errorMiddleware(),
  ],
};
