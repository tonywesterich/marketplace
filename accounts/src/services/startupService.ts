import { inject, injectable } from 'inversify';
import { GracefulShutdownService } from './gracefulShutdownService';
import {
  IDataSourceService,
  IDataSourceServiceName
} from './datasourceService/datasource.service.interface';
import { ILoggerService, ILoggerServiceName } from '../framework/interfaces';
import { InversifyExpressApplication } from '../framework/inversifyExpressApplication';

@injectable()
export class StartupService {
  @inject(ILoggerServiceName)
  private readonly logger: ILoggerService;

  @inject(GracefulShutdownService)
  private readonly shutdownService: GracefulShutdownService;

  @inject(IDataSourceServiceName)
  private readonly datasourceService: IDataSourceService;

  private async connectDatabase(): Promise<void> {
    this.logger.info('Connecting to database');
    try {
      await this.datasourceService.initialize();
      this.logger.info('Database successfully connected');
    } catch (error: any) {
      this.logger.critical('Unable to connect to database', error);
      throw error;
    }
  }

  public async start(app: InversifyExpressApplication): Promise<void> {
    this.logger.info(
      `Application is runnig at http://localhost:${
        app.app?.get('port')
      } in ${
        app.app?.get('env')
      } mode`
    )
    this.logger.info('Caching requests until application is ready to process it');
    this.shutdownService.startListeners();
    await this.connectDatabase();
    this.logger.info('Application is ready to process requests');
  }
}
