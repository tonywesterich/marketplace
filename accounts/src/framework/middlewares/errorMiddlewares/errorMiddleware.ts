import { Request, Response, NextFunction } from 'express';
import { formatErrorResponse } from './formatErrorResponse';

/**
 * Middleware that converts the error into a friendly
 * message and sends it as a response.
 *
 * @param error
 * @param request
 * @param response
 */
export const errorMiddleware =
  () => (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      return next(error);
    }

    const errorResponse = formatErrorResponse(error);

    return res.status(errorResponse.statusCode).json(errorResponse);
  };
