import { Controller, Get, Inject, Req } from '@nestjs/common';
import { CachedApiProxyService } from './cached-api-proxy.service';
import { Request } from 'express';
import { IOpeningCrawlsService } from './opening-crawl.service';

@Controller('api')
export class AppController {
  constructor(
    private readonly cachedApiProxyService: CachedApiProxyService,
    @Inject('IOpeningCrawlsService')
    private readonly openingCrawlsService: IOpeningCrawlsService,
  ) {}

  @Get('healthcheck')
  async healthcheck(): Promise<string> {
    return 'swapi-proxy is up and running';
  }

  @Get('films/opening-crawls/word-counts')
  async getCountedWordsFromOpeningCrawls() {
    return await this.openingCrawlsService.countWords();
  }

  @Get('/films/opening-crawls/people/most-appearances')
  async getMostMentionedNamesInOpeningCrawls() {
    return await this.openingCrawlsService.getNamesWithTheMostOccurences();
  }

  @Get(':resource(films|species|vehicles|starships|people|planets)*')
  async proxy(@Req() request: Request) {
    return await this.cachedApiProxyService.get(request.url);
  }
}
