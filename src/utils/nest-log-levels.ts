import { LogLevel } from '@nestjs/common';

const LOG_LEVELS: LogLevel[] = [
  'fatal',
  'error',
  'warn',
  'log',
  'debug',
  'verbose',
];

export function getNestLogLevels(level_str: string): LogLevel[] {
  if (level_str === 'info') {
    level_str = 'log';
  }
  const logLevel: LogLevel = LOG_LEVELS.includes(<LogLevel>level_str)
    ? <LogLevel>level_str
    : 'debug';
  return LOG_LEVELS.slice(0, LOG_LEVELS.indexOf(logLevel) + 1);
}
