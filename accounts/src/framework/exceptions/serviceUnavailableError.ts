import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export class ServiceUnavailableError extends Error {
  statusCode = StatusCodes.SERVICE_UNAVAILABLE;

  constructor(message?: string) {
    super(message ?? ReasonPhrases.SERVICE_UNAVAILABLE);
  }
}
