import { inject, injectable } from 'inversify';
import { ILoggerService } from '../../../interfaces';
import { Logger as LoggerWinston } from 'winston';
import TransportStream from 'winston-transport';

@injectable()
export class LoggerWinstonService implements ILoggerService {
  @inject(LoggerWinston)
  private logger: LoggerWinston;

  add(transport: TransportStream): void {
    this.logger.add(transport);
  }

  emergency(message: string, ...meta: any[]): void {
    this.logger.emerg(message, ...meta);
  }

  alert(message: string, ...meta: any[]): void {
    this.logger.alert(message, ...meta);
  }

  critical(message: string, ...meta: any[]): void {
    this.logger.crit(message, ...meta);
  }

  error(message: any, ...meta: any[]): void {
    this.logger.error(message, ...meta);
  }

  warning(message: string, ...meta: any[]): void {
    this.logger.warning(message, ...meta);
  }

  notice(message: string, ...meta: any[]): void {
    this.logger.notice(message, ...meta);
  }

  info(message: string, ...meta: any[]): void {
    this.logger.info(message, ...meta);
  }

  debug(message: string, ...meta: any[]): void {
    this.logger.debug(message, ...meta);
  }

  /**
   * When the application is closed, the `winston-syslog` is
   * unable to send to the syslog server the last log messages
   * it received. Therefore, they are lost.
   *
   * Apparently, the buffer of the `winston-syslog` is not
   * flushed when the application ends, however, if you wait
   * a few moments, the flush happens.
   *
   * In a similar way, when running tests with Jest, using
   * `winston-syslog`, at the end of the tests appears the
   * below message indicated that, possibly, some promise was
   * left pending:
   *
   * ``Jest did not exit one second after the test run has
   * completed. 'This usually means that there are asynchronous
   * operations that weren't stopped in your tests. Consider
   * running Jest with `--detectOpenHandles` to troubleshoot
   * this issue.``
   *
   * For now, the solution was to use a 1000ms delay. It's not
   * the most elegant way, but it works. When the bug of the
   * `winston-syslog` was be fixed this workaround can be
   * removed.
   */
  private async forceDelayToWinstonSyslogFlush(): Promise<void> {
    await new Promise<void>(
      (resolve) => setTimeout(() => resolve(), 1000)
    );
  }

  async end(): Promise<void> {
    await this.forceDelayToWinstonSyslogFlush();
  }
}
