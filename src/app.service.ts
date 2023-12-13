import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getHello(): string {
    this.logger.log('Some log message');
    this.logger.debug('Debug message');
    return 'Hello World!';
  }
}
