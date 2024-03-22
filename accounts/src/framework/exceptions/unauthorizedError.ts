import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export class UnauthorizedError extends Error {
  statusCode = StatusCodes.UNAUTHORIZED;
  metadata?: { [key: string]: any }

  constructor(message?: string, metadata?: { [key: string]: any }) {
    super(message ?? ReasonPhrases.UNAUTHORIZED);
    this.metadata = metadata;
  }
}
