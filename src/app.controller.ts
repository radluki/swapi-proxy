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
  ) {}

  @Get('healthcheck')
  async healthcheck(@Req() request: Request): Promise<string> {
    this.logger.log(`healthcheck endpoint hit ${request.url}`);
    return "<h1>HealthCheck</h1><h3>server is alive</h3>";
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

  @Get('opening-crawl/count-words')
  async countWords(@Req() request: Request, @Res() res: Response) {
    this.logger.log(`Opening crawl endpoint accessed`);
    try {
      const data = await this.openingCrawlService.countWords();
      return res.status(HttpStatus.OK).send(data);
    } catch (err) {
      this.logger.error(`Error getting opening crawl data: ${JSON.stringify(err)}`);
      return res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR).send(err.message || 'Internal server error');
    }
  }

  /*
    Each film entry returned from the /films/ API has an opening_crawl property which
    contains a short film plot description. Write an endpoint that will return:

        A. an array of pairs of unique words from all films openings paired with their
        number of occurrences in the text. Words should not be empty and should be
        separated by space or any number of consecutive control characters (i.e
        carriage return, line feed).
    TODO: Add endpoints:
        B. a name of a character from the /people API that appears the most often
        across all of the openings of the film (or an array of names if there are more
        characters with the same number). We are interested only in exact name
        matches excluding eventual control characters in between when the name is
        longer than a single word.
  */

  //TODO: GraphQL
}
