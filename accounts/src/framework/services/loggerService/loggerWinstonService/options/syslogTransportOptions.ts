import { format } from 'winston';
import { SyslogTransportOptions } from 'winston-syslog';
import { join } from 'path';

const packageJson = require(join(process.cwd(), 'package.json'));

export const SYSLOG_HOST = process.env.SYSLOG_HOST || 'localhost';
export const SYSLOG_PORT = parseInt(process.env.SYSLOG_PORT || '514', 10);
export const SYSLOG_PROTOCOL = process.env.SYSLOG_PROTOCOL || 'udp4';
export const SYSLOG_FACILITY = process.env.SYSLOG_FACILITY || 'local0';
export const SYSLOG_TYPE = process.env.SYSLOG_TYPE || 'RFC5424';

export const syslogTransportOptions: SyslogTransportOptions = {
  host: SYSLOG_HOST,
  port: SYSLOG_PORT,
  protocol: SYSLOG_PROTOCOL,
  facility: SYSLOG_FACILITY,
  type: SYSLOG_TYPE,
  app_name: packageJson.name,
  format: format.combine(
    format.errors({ stack: true }),
    format.timestamp(),
    format.metadata(),
    format.printf((info) => JSON.stringify(info)),
  ),
};
