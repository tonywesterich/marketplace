import { LoggerOptions, config } from 'winston';
import { join } from 'path';

const packageJson = require(join(process.cwd(), 'package.json'));

export const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

export const winstonOptions: LoggerOptions = {
  levels: config.syslog.levels,
  level: LOG_LEVEL,
  defaultMeta: { service: packageJson.name },
};
