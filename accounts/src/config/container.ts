import { DataSourceOptions, Repository } from 'typeorm';
import { StartupService } from '../services/startupService';
import { GracefulShutdownService } from '../services/gracefulShutdownService';
import { DatasourceServiceTypeOrm } from '../services/datasourceService/typeorm/datasource.service.typeorm';
import { User } from '../modules/users/entities/user';
import { ICryptServiceName } from '../services/cryptService/crypt.service.interface';
import { CryptServiceBcrypt } from '../services/cryptService/crypt.service.bcrypt';
import { DataSourceTypeOrm } from '../services/datasourceService/typeorm/datasourceTypeOrm';
import { IDataSourceServiceName } from '../services/datasourceService/datasource.service.interface';
import { ILoggerServiceName } from '../framework/interfaces/logger';
import { ShutdownSignalsTracking } from '../framework/services/shutdownSignalsTracking';
import { LoggerNullableService } from '../framework/services/loggerService/loggerWinstonService/logger.nullable.service';
import { Logger as LoggerWinston, createLogger as createLoggerWinston } from 'winston';
import { LoggerWinstonService } from '../framework/services/loggerService/loggerWinstonService/logger.winston.service';
import { winstonOptions } from '../framework/services/loggerService/loggerWinstonService/options/winstonOptions';
import { ContainerBinds } from '../framework/interfaces/containerBinds';
import {
  ChangeUserInformationUseCase,
  ChangeUserPasswordUseCase,
  CreateUserUseCase,
  FindAllUsersUseCase,
  FindUserByIdUseCase,
} from '../modules/users/useCases';
import { ValidateUserUseCase } from '../modules/validateUser/useCases';
import { IUserRepositoryName, UserRepositoryTypeOrm } from '../modules/users/repositories';

export const getContainerToBind = (datasourceOptions: DataSourceOptions): ContainerBinds => ({
  bind: [
    /* Generic Services */
    { identifier: StartupService, singleton: true },
    { identifier: GracefulShutdownService, singleton: true },
    { identifier: ShutdownSignalsTracking, singleton: true },

    /* TypeORM */
    { identifier: DatasourceServiceTypeOrm, singleton: true },
    { identifier: UserRepositoryTypeOrm },

    /* Loggers */
    { identifier: LoggerNullableService },
    { identifier: LoggerWinstonService },

    /* Use cases */
    { identifier: CreateUserUseCase },
    { identifier: FindAllUsersUseCase },
    { identifier: FindUserByIdUseCase },
    { identifier: ChangeUserInformationUseCase },
    { identifier: ChangeUserPasswordUseCase },
    { identifier: ValidateUserUseCase },
  ],
  bindConstant: [],
  bindDynamic: [
    {
      identifier: ICryptServiceName,
      target: () => new CryptServiceBcrypt(),
    },

    {
      identifier: LoggerWinston,
      target: () => createLoggerWinston(winstonOptions),
    },
    {
      identifier: ILoggerServiceName,
      target: (context) => context.container.get(LoggerNullableService),
      singleton: true,
    },
    {
      identifier: IDataSourceServiceName,
      target: (context) => context.container.get(DatasourceServiceTypeOrm),
      singleton: true,
    },
    {
      identifier: DataSourceTypeOrm,
      target: () => new DataSourceTypeOrm(datasourceOptions),
      singleton: true,
    },
    {
      identifier: Repository<User>,
      target: (context) => {
        return context.container
          .get<DatasourceServiceTypeOrm>(IDataSourceServiceName)
          .getDatasource()
          .getRepository(User);
      },
    },
    {
      identifier: IUserRepositoryName,
      target: (context) => context.container.get(UserRepositoryTypeOrm),
    },
  ],
});
