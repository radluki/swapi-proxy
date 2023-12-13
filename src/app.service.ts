import { Injectable } from '@nestjs/common';
import { createLogger } from './logger-factory';

@Injectable()
export class AppService {
  private readonly logger = createLogger(AppService.name);

  getHello(): string {
    this.logger.log('Some log message');
    this.logger.debug('Debug message');
    return 'Hello World!';
  }
}
