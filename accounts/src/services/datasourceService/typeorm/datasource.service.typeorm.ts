import { inject, injectable } from 'inversify';
import { IDataSourceService } from '../datasource.service.interface';
import { DataSourceTypeOrm } from './datasourceTypeOrm';

@injectable()
export class DatasourceServiceTypeOrm implements IDataSourceService {
  @inject(DataSourceTypeOrm)
  private readonly datasource: DataSourceTypeOrm;

  public getDatasource(): DataSourceTypeOrm {
    return this.datasource;
  }

  public async initialize(): Promise<DataSourceTypeOrm> {
    return await this.datasource.initialize();
  }

  public async disconnect(): Promise<void> {
    await this.datasource.destroy();
  }
}
