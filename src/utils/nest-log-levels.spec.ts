import { getNestLogLevels } from './nest-log-levels';

describe('nest-log-levels', () => {
  it('invalid level string should set debug level', async () => {
    const levels = getNestLogLevels('invalid');
    expect(levels).toEqual(['fatal', 'error', 'warn', 'log', 'debug']);
  });

  it('fatal level string should set correct level', async () => {
    const levels = getNestLogLevels('fatal');
    expect(levels).toEqual(['fatal']);
  });

  it('error level string should set correct level', async () => {
    const levels = getNestLogLevels('error');
    expect(levels).toEqual(['fatal', 'error']);
  });

  it('warn level string should set correct level', async () => {
    const levels = getNestLogLevels('warn');
    expect(levels).toEqual(['fatal', 'error', 'warn']);
  });

  it('log level string should set correct level', async () => {
    const levels = getNestLogLevels('log');
    expect(levels).toEqual(['fatal', 'error', 'warn', 'log']);
  });

  it('debug level string should set correct level', async () => {
    const levels = getNestLogLevels('debug');
    expect(levels).toEqual(['fatal', 'error', 'warn', 'log', 'debug']);
  });

  it('verbose level string should set correct level', async () => {
    const levels = getNestLogLevels('verbose');
    expect(levels).toEqual([
      'fatal',
      'error',
      'warn',
      'log',
      'debug',
      'verbose',
    ]);
  });

  it('null level string should set debug level', async () => {
    const levels = getNestLogLevels(null);
    expect(levels).toEqual(['fatal', 'error', 'warn', 'log', 'debug']);
  });

  it('undefined level string should set debug level', async () => {
    const levels = getNestLogLevels(undefined);
    expect(levels).toEqual(['fatal', 'error', 'warn', 'log', 'debug']);
  });

  it('info (alias for log) level string should set log level', async () => {
    const levels = getNestLogLevels('info');
    expect(levels).toEqual(['fatal', 'error', 'warn', 'log']);
  });
});
