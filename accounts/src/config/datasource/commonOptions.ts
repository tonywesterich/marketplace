import path from 'path';

const entities = {
  entities: [
    path.join(__dirname, '../../modules/users/entities/**/*.entity.{js,ts}'),
  ],
};

const subscribers = {
  subscribers: [
    path.join(__dirname, '../../modules/users/entities/**/*.subscriber.{js,ts}'),
  ],
};

export const commonOptions = {
  ...entities,
  ...subscribers,
};
