import { Logger } from '@nestjs/common';

class LoggerFake extends Logger {
  override log(_message: string) {} // eslint-disable-line
  override debug(_message: string) {} // eslint-disable-line
  override error(_message: string) {} // eslint-disable-line
}

export function createLogger(className: string): Logger {
  return process.env.DISABLE_LOGS === '1'
    ? new LoggerFake()
    : new Logger(className);
}
