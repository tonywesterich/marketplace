import { inject, injectable } from 'inversify';
import { AppListenerService } from '../framework/services/appListenerService';
import {
  IDataSourceService,
  IDataSourceServiceName
} from './datasourceService/datasource.service.interface';
import { ILoggerService, ILoggerServiceName } from '../framework/interfaces';

@injectable()
export class GracefulShutdownService {
  @inject(AppListenerService)
  private readonly appListener: AppListenerService;

  @inject(ILoggerServiceName)
  private readonly logger: ILoggerService;

  @inject(IDataSourceServiceName)
  private readonly datasourceService: IDataSourceService;

  private async disconnectDatabase() {
    this.logger.info('Gracefully shutdown database connection');
    try {
      await this.datasourceService.disconnect();
      this.logger.info('Database connection is shut down');
    } catch (error: any) {
      this.logger.error('Unable to shutdown database connection', {
        errorMessage: error.message,
      });
    }
  }

  private async closeDatabase() {
    if (this.datasourceService.getDatasource().isInitialized) {
      await this.disconnectDatabase();
    }
  }

  public startListeners(): void {
    this.appListener.on('exit', async () => {
      await this.closeDatabase();
      this.logger.info('Application is shut down');
      this.logger.info('Flushing logger buffer');
      await this.logger.end();
    });
  }
}
