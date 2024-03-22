import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export class UnprocessableEntityError extends Error {
  statusCode: number = StatusCodes.UNPROCESSABLE_ENTITY;
  messages: string[];
  metadata?: { [key: string]: any }

  constructor(
    fields: { [key: string]: string[] },
    message?: string,
    metadata?: { [key: string]: any },
  ) {
    super(message ?? ReasonPhrases.UNPROCESSABLE_ENTITY);

    this.messages = ([] as string[]).concat(
      Object
        .values(fields)
        .map((value: string[]) => value.join(', '))
    );

    this.metadata = metadata;
  }
}
