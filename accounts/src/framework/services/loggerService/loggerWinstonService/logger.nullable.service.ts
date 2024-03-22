import { injectable } from 'inversify';
import { ILoggerService } from '../../../interfaces';
import * as stream from 'stream';

@injectable()
export class LoggerNullableService implements ILoggerService {
  add(transport: stream.Writable): void {
    /* Do nothing. Just ignores logger */
  }

  emergency(message: string, ...meta: any[]): void {
    /* Do nothing. Just ignores logger */
  }

  alert(message: string, ...meta: any[]): void {
    /* Do nothing. Just ignores logger */
  }

  critical(message: string, ...meta: any[]): void {
    /* Do nothing. Just ignores logger */
  }

  error(message: any, ...meta: any[]): void {
    /* Do nothing. Just ignores logger */
  }

  warning(message: string, ...meta: any[]): void {
    /* Do nothing. Just ignores logger */
  }

  notice(message: string, ...meta: any[]): void {
    /* Do nothing. Just ignores logger */
  }

  info(message: string, ...meta: any[]): void {
    /* Do nothing. Just ignores logger */
  }

  debug(message: string, ...meta: any[]): void {
    /* Do nothing. Just ignores logger */
  }

  async end(): Promise<void> {
    /* Do nothing. Just ignores logger */
  }
}
