import { Logger } from '@nestjs/common';
import config from './config';

class LoggerFake extends Logger {
  override log(_message: string) {} // eslint-disable-line
  override debug(_message: string) {} // eslint-disable-line
  override error(_message: string) {} // eslint-disable-line
}

export function createLogger(className: string): Logger {
  return config.disableLogs ? new LoggerFake() : new Logger(className);
}
