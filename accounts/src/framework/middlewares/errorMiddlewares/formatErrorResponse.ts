import { StatusCodes } from 'http-status-codes';
import { IErrorResponse } from './errorResponse';

/**
 * Format the response when error occurs.
 *
 * @param error
 */
export const formatErrorResponse = (error: any): IErrorResponse => {
  const messages =
    error.messages && Array.isArray(error.messages)
      ? error.messages
      : [error.message];

  const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  const response: IErrorResponse = {
    statusCode,
    messages,
  };

  return response;
};
