import { Controller, Get, Logger, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { CachedApiProxyService } from './cached-api-proxy.service';

@Controller("api")
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService, private readonly cachedApiProxyService: CachedApiProxyService) { }
  
  @Get("dummy")
  async getHello(@Req() request: Request): Promise<string> {
    this.logger.log(`Dummy endpoint hit ${request.url}`);
    return this.appService.getHello();
  }
  
  @Get("*")
  async default(@Req() request: Request): Promise<string> {
    this.logger.log('Default api proxy endpoint hit');
    return await this.cachedApiProxyService.get(request.url);
  }
}
