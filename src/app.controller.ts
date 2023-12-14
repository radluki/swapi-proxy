import { Controller, Get, Req, HttpStatus, Res } from '@nestjs/common';
import { CachedApiProxyService } from './cached-api-proxy.service';
import { createLogger } from './logger-factory';
import { Request, Response } from 'express';
import { OpeningCrawlService } from './opening-crawl.service';

@Controller('api')
export class AppController {
  private readonly logger = createLogger(AppController.name);

  constructor(
    private readonly cachedApiProxyService: CachedApiProxyService,
    private readonly openingCrawlService: OpeningCrawlService,
  ) { }

  @Get('healthcheck')
  async healthcheck(@Req() request: Request): Promise<string> {
    this.logger.log(`healthcheck endpoint hit ${request.url}`);
    return "<h1>HealthCheck</h1><h3>server is alive</h3>";
  }

  @Get('films/opening-crawls-counted-words')
  async countWords(@Res() res: Response) {
    try {
      const data = await this.openingCrawlService.countWords();
      return res.status(HttpStatus.OK).send(data);
    } catch (err) {
      this.logger.error(`Error films/opening-crawls-counted-words: ${JSON.stringify(err)}`);
      return res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR).send(err.message || 'Internal server error');
    }
  }

  @Get('people/full-names-most-mentioned')
  async getNames(@Res() res: Response) {
    try {
      const data = await this.openingCrawlService.getNamesWithTheMostOccurences();
      return res.status(HttpStatus.OK).send(data);
    } catch (err) {
      this.logger.error(`Error people/full-names-most-mentioned: ${JSON.stringify(err)}`);
      return res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR).send(err.message || 'Internal server error');
    }
  }

  // TODO: Add documentation
  @Get(':category(films|species|vehicles|starships|people|planets)*')
  async proxy(@Req() request: Request, @Res() res: Response) {
    this.logger.log(`API proxy endpoint accessed for category: ${request.params.category}`);

    try {
      const data = await this.cachedApiProxyService.get(request.url);
      return res.status(HttpStatus.OK).send(data);
    } catch (err) {
      this.logger.error(`Error getting data from API: ${JSON.stringify(err)}`);
      return res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR).send(err.message || 'Internal server error');
    }
  }
  //TODO: GraphQL
}
