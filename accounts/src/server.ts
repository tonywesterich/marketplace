import { getContainerToBind, middleware, datasource } from './config';
import { ILoggerServiceName } from './framework/interfaces';
import { LoggerWinstonService } from './framework/services/loggerService/loggerWinstonService/logger.winston.service';
import { transports } from 'winston';
import { consoleTransportOptions } from './framework/services/loggerService/loggerWinstonService/options/consoleTransportOptions';
import { Syslog } from 'winston-syslog';
import { syslogTransportOptions } from './framework/services/loggerService/loggerWinstonService/options/syslogTransportOptions';
import { framework } from './framework';
import * as errorLoggerMiddleware from './framework/middlewares/errorMiddlewares/errorLoggerMiddleware';

const containerToBind = getContainerToBind(datasource);

middleware.error.unshift(errorLoggerMiddleware.errorLoggerMiddleware())

containerToBind.bindDynamic
  .filter(value => value.identifier === ILoggerServiceName)[0]
  .target = (context) => {
    const loggerService = context.container.get(LoggerWinstonService)
    loggerService.add(new transports.Console(consoleTransportOptions));
    loggerService.add(new Syslog(syslogTransportOptions));

    errorLoggerMiddleware.setLogger(loggerService);

    return loggerService;
  }

framework
  .bind(containerToBind.bind)
  .bindConstant(containerToBind.bindConstant)
  .bindDynamic(containerToBind.bindDynamic)
  .middlewareError(middleware.error)
  .build()
  .up();

console.log('Test CI');
