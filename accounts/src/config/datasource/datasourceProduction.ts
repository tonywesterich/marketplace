import { DATABASE_NAME, DATABASE_HOST, DATABASE_PASSWORD, DATABASE_PORT, DATABASE_USER } from '../environment';
import { DataSourceOptions } from 'typeorm';
import { commonOptions } from './commonOptions';

export const datasourceProduction: DataSourceOptions = {
  type: 'postgres',
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  username: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  ...commonOptions,
  synchronize: false,
};
