import { Controller, Get, Req } from '@nestjs/common';
import { CachedApiProxyService } from './cached-api-proxy.service';
import { createLogger } from './logger-factory';
import { Request } from 'express';
import { OpeningCrawlService } from './opening-crawl.service';

@Controller('api')
export class AppController {
  private readonly logger = createLogger(AppController.name);

  constructor(
    private readonly cachedApiProxyService: CachedApiProxyService,
    private readonly openingCrawlService: OpeningCrawlService,
  ) {}

  @Get('healthcheck')
  async healthcheck(@Req() request: Request): Promise<string> {
    this.logger.log(`healthcheck endpoint hit ${request.url}`);
    return '<h1>HealthCheck</h1><h3>server is alive</h3>';
  }

  @Get('films/opening-crawls-counted-words')
  async countWords() {
    return await this.openingCrawlService.countWords();
  }

  @Get('people/full-names-most-mentioned')
  async getNames() {
    return await this.openingCrawlService.getNamesWithTheMostOccurences();
  }

  // TODO: Add documentation
  @Get(':category(films|species|vehicles|starships|people|planets)*')
  async proxy(@Req() request: Request) {
    this.logger.log(`API proxy for category: ${request.params.category}`);
    return await this.cachedApiProxyService.get(request.url);
  }
}
