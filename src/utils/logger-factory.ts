import { Logger } from '@nestjs/common';
import getConfig from '../config/configuration';

class LoggerFake extends Logger {
  override log(_message: string) {} // eslint-disable-line
  override debug(_message: string) {} // eslint-disable-line
  override error(_message: string) {} // eslint-disable-line
}

export function createLogger(className: string): Logger {
  const { disableLogs } = getConfig();
  return disableLogs ? new LoggerFake() : new Logger(className);
}
