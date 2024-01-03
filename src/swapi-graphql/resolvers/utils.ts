import { LoggerService } from '@nestjs/common';

export function getPromiseRejectionHandler(logger: LoggerService) {
  return (err: Error) => {
    logger.error(err);
    return null;
  };
}
