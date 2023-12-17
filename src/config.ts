import { LogLevel } from '@nestjs/common';

type Config = {
  logLevel: LogLevel[];
  disableLogs?: boolean;
};

function getLogLevel(logLevelEnvVar: string): LogLevel[] {
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
    : <LogLevel>'log';
  const LEVELS = LOG_LEVELS.slice(0, LOG_LEVELS.indexOf(logLevel) + 1);
  return LEVELS;
}

const config: Config = {
  logLevel: getLogLevel(process.env.LOG_LEVEL),
  disableLogs: process.env.DISABLE_LOGS === '1',
};

export default config;
