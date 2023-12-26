import { LogLevel } from '@nestjs/common';

export function getNestLogLevels(logLevelEnvVar: string): LogLevel[] {
  const LOG_LEVELS: LogLevel[] = [
    'fatal',
    'error',
    'warn',
    'log',
    'debug',
    'verbose',
  ];
  const logLevel: LogLevel = (<string[]>LOG_LEVELS).includes(logLevelEnvVar)
    ? <LogLevel>logLevelEnvVar
    : <LogLevel>'debug';
  const LEVELS = LOG_LEVELS.slice(0, LOG_LEVELS.indexOf(logLevel) + 1);
  return LEVELS;
}
