import { StatusCodes } from 'http-status-codes';

export class AlreadyExistsError extends Error {
  statusCode = StatusCodes.CONFLICT;
  metadata?: { [key: string]: any }

  constructor(message?: string, metadata?: { [key: string]: any }) {
    super(message ?? 'Already exists');
    this.metadata = metadata;
  }
}
