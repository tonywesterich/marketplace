import { AnySchema, ValidationError, ValidationErrorItem } from 'joi';
import { UnprocessableEntityError } from '../framework/exceptions';

export const formatException = (exception: ValidationError) => {
  const data = exception.details.reduce(
    (acc: { [key: string]: string[] }, detail: ValidationErrorItem) => {
      if (detail.context) {
        const key = detail.context.key ?? detail.context.label ?? 'value';

        if (!acc[key]) {
          acc[key] = [];
        }

        acc[key].push(detail.message);
      }

      return acc;
    },
    {},
  );

  return new UnprocessableEntityError(data, 'Invalid parameters');
};

export const validation = <T>(input: unknown, schema: AnySchema) => {
  const { value, error } = schema.validate(input, { abortEarly: false });

  if (error) {
    throw formatException(error);
  }

  return value as T;
};
