import {
  Controller,
  Get,
  Req,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
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
    try {
      return await this.openingCrawlService.countWords();
    } catch (err) {
      this.logger.error(
        `Error films/opening-crawls-counted-words: ${JSON.stringify(err)}`,
      );
      throw toHttpException(err);
    }
  }

  @Get('people/full-names-most-mentioned')
  async getNames() {
    try {
      return await this.openingCrawlService.getNamesWithTheMostOccurences();
    } catch (err) {
      this.logger.error(
        `Error people/full-names-most-mentioned: ${JSON.stringify(err)}`,
      );
      throw toHttpException(err);
    }
  }

  // TODO: Add documentation
  @Get(':category(films|species|vehicles|starships|people|planets)*')
  async proxy(@Req() request: Request) {
    this.logger.log(
      `API proxy endpoint accessed for category: ${request.params.category}`,
    );

    try {
      return await this.cachedApiProxyService.get(request.url);
    } catch (err) {
      this.logger.error(`Error getting data from API: ${JSON.stringify(err)}`);
      throw toHttpException(err);
    }
  }
}

function toHttpException(err: any) {
  return new HttpException(
    err.message || 'Internal server error',
    err.status || HttpStatus.INTERNAL_SERVER_ERROR,
  );
}
