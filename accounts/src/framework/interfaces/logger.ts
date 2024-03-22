import * as stream from 'stream';

export const ILoggerServiceName = 'ILoggerService';
export interface ILoggerService {
  add(transport: stream.Writable): void;

  emergency(message: string, ...meta: any[]): void;

  alert(message: string, ...meta: any[]): void;

  critical(message: string, ...meta: any[]): void;

  error(message: string, ...meta: any[]): void;
  error(error: Error, ...meta: any[]): void;

  warning(message: string, ...meta: any[]): void;

  notice(message: string, ...meta: any[]): void;

  info(message: string, ...meta: any[]): void;

  debug(message: string, ...meta: any[]): void;

  end(): Promise<void>;
}
