import { Controller, Get, Logger, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller("dummy")
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Req() request: Request): string {
    console.log(request.url)
    this.logger.log('Some log message');
    this.logger.error('Error message');
    this.logger.warn('Warning message');
    this.logger.debug('Debug message');
    this.logger.verbose('Verbose message');
    return this.appService.getHello();
  }
}
