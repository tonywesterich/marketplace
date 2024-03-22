import { DataSourceTypeOrm } from './typeorm/datasourceTypeOrm';

export const IDataSourceServiceName = 'IDataSourceService';
export interface IDataSourceService {
  getDatasource(): DataSourceTypeOrm;
  initialize(): Promise<DataSourceTypeOrm>;
  disconnect(): Promise<void>;
}
