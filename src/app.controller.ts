import { Controller, Get, Inject, Req } from '@nestjs/common';
import { CachedApiProxyService } from './cached-api-proxy.service';
import { Request } from 'express';
import { IOpeningCrawlsService } from './opening-crawl.service';
import { createLogger } from './logger-factory';

@Controller('api')
export class AppController {
  private readonly logger = createLogger(AppController.name);

  constructor(
    private readonly cachedApiProxyService: CachedApiProxyService,
    @Inject('IOpeningCrawlsService')
    private readonly openingCrawlsService: IOpeningCrawlsService,
  ) {}

  @Get('healthcheck')
  async healthcheck(): Promise<string> {
    return 'swapi-proxy is up and running';
  }

  @Get('/')
  async getRoot() {
    return {
      people: 'http://localhost:3000/api/people/',
      planets: 'http://localhost:3000/api/planets/',
      films: 'http://localhost:3000/api/films/',
      species: 'http://localhost:3000/api/species/',
      vehicles: 'http://localhost:3000/api/vehicles/',
      starships: 'http://localhost:3000/api/starships/',
    };
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
    this.logger.log(`proxying ${request.url}`);
    return await this.cachedApiProxyService.get(request.url);
  }
}
