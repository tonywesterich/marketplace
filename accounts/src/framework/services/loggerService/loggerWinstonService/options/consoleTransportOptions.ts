import { format } from 'winston';
import { ConsoleTransportOptions } from 'winston/lib/winston/transports';

const paddingDependigOnColor = (level: string) => level.length <= 7 ? 7 : 17;

export const consoleTransportOptions: ConsoleTransportOptions = {
  format: format.combine(
    format.errors({ stack: true }),
    format.colorize({ all: true }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    format.printf((info) => {
      return `${
        info.timestamp
      } [${info.level.padEnd(paddingDependigOnColor(info.level), ' ')}] ${
        info.message
      }${
        info.stack ? '\n  ' + info.stack : ''
      }`
    }),
  ),
};
