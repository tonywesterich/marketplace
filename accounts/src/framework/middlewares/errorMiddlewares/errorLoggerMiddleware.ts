import { Request, Response, NextFunction } from 'express';
import { formatErrorResponse } from './formatErrorResponse';
import {
  AlreadyExistsError,
  NotFoundError,
  UnauthorizedError,
  UnprocessableEntityError
} from '../../exceptions';
import { ILoggerService } from '../../interfaces';

let logger: ILoggerService;

export const setLogger = (value: ILoggerService) => {
  logger = value;
}

const errorIsInWhitelist = (error: Error): boolean => {
  return error instanceof AlreadyExistsError ||
    error instanceof NotFoundError ||
    error instanceof UnauthorizedError ||
    error instanceof UnprocessableEntityError;
}

/**
 * Middleware that logs the error to the LoggerService.
 *
 * @param error
 * @param request
 * @param response
 */
export const errorLoggerMiddleware =
  () => (error: Error, req: Request, res: Response, next: NextFunction) => {
    const errorResponse = formatErrorResponse(error);

    if (errorIsInWhitelist(error)) {
      logger.notice(error.message, (error as any).metadata);
      return next(error);
    }

    logger.error(error, {
      errorName: error.constructor.name,
      statusCode: errorResponse.statusCode,
      messages: errorResponse.messages,
    });

    return next(error);
  };
