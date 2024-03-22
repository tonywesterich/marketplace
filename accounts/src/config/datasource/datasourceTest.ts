import { DataSourceOptions } from 'typeorm';
import { commonOptions } from './commonOptions';

export const datasourceTest: DataSourceOptions = {
  type: 'sqlite',
  database: ':memory:',
  ...commonOptions,
  synchronize: true,
};
