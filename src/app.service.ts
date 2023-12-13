import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getHello(): string {
    this.logger.log('Some log message');
    this.logger.error('Error message');
    this.logger.warn('Warning message');
    this.logger.debug('Debug message');
    this.logger.verbose('Verbose message');
    return 'Hello World!';
  }
}
