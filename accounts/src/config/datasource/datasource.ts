import { DataSourceOptions } from 'typeorm';
import { NODE_ENV, NodeEnv } from '../environment';
import { datasourceDevelopment } from './datasourceDevelopment';
import { datasourceProduction } from './datasourceProduction';

export const datasource: DataSourceOptions = NODE_ENV === NodeEnv.DEVELOPMENT
  ? datasourceDevelopment
  : datasourceProduction;
