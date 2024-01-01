import { LoggerService, Logger } from '@nestjs/common';

/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
class LoggerFake implements LoggerService {
  error(message: any, stack?: string, context?: string): void {}
  log(message: any, context?: string): void {}
  warn(message: any, context?: string): void {}
  debug(message: any, context?: string): void {}
  verbose(message: any, context?: string): void {}
  fatal(message: any, context?: string): void {}
}
/* eslint-enable @typescript-eslint/no-empty-function */
/* eslint-enable @typescript-eslint/no-unused-vars */

export function createLogger(className: string): LoggerService {
  return process.env.DISABLE_LOGS === '1'
    ? new LoggerFake()
    : new Logger(className);
}
