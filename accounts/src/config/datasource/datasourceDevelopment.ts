import { DataSourceOptions } from 'typeorm';
import { commonOptions } from './commonOptions';

export const datasourceDevelopment: DataSourceOptions = {
  type: 'sqlite',
  database: 'development.sqlite',
  ...commonOptions,
  synchronize: true,
};
