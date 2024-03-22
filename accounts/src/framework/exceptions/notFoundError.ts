import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export class NotFoundError extends Error {
  statusCode = StatusCodes.NOT_FOUND;
  metadata?: { [key: string]: any }

  constructor(message?: string, metadata?: { [key: string]: any }) {
    super(message ?? ReasonPhrases.NOT_FOUND);
    this.metadata = metadata;
  }
}
