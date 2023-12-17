import { Controller, Get, Req } from '@nestjs/common';
import { CachedApiProxyService } from './cached-api-proxy.service';
import { createLogger } from './logger-factory';
import { Request } from 'express';
import { OpeningCrawlService } from './opening-crawl.service';

@Controller('api')
export class AppController {
  constructor(
    private readonly cachedApiProxyService: CachedApiProxyService,
    private readonly openingCrawlService: OpeningCrawlService,
  ) {}

  @Get('healthcheck')
  async healthcheck(): Promise<string> {
    return '<h1>HealthCheck</h1><h3>server is alive</h3>';
  }

  @Get('films/opening-crawls/word-counts')
  async getCountedWordsFromOpeningCrawls() {
    return await this.openingCrawlService.countWords();
  }

  @Get('/films/opening-crawls/people/most-appearances')
  async getMostMentionedNamesInOpeningCrawls() {
    return await this.openingCrawlService.getNamesWithTheMostOccurences();
  }

  @Get(':resource(films|species|vehicles|starships|people|planets)*')
  async proxy(@Req() request: Request) {
    return await this.cachedApiProxyService.get(request.url);
  }
}
