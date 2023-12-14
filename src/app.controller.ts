import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { CachedApiProxyService } from './cached-api-proxy.service';
import { createLogger } from './logger-factory';

@Controller('api')
export class AppController {
  private readonly logger = createLogger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private readonly cachedApiProxyService: CachedApiProxyService,
  ) {}

  @Get('dummy')
  async getHello(@Req() request: Request): Promise<string> {
    this.logger.log(`Dummy endpoint hit ${request.url}`);
    return this.appService.getHello();
  }

  // TODO: Add documentation
  @Get('films|species|vehicles|starships|people|planets')
  async default(@Req() request: Request): Promise<string> {
    this.logger.log('Default api proxy endpoint hit');
    return await this.cachedApiProxyService.get(request.url);
  }

  //TODO: Add endpoints:
  /*
    Each film entry returned from the /films/ API has an opening_crawl property which
    contains a short film plot description. Write an endpoint that will return:

        A. an array of pairs of unique words from all films openings paired with their
        number of occurrences in the text. Words should not be empty and should be
        separated by space or any number of consecutive control characters (i.e
        carriage return, line feed).
        B. a name of a character from the /people API that appears the most often
        across all of the openings of the film (or an array of names if there are more
        characters with the same number). We are interested only in exact name
        matches excluding eventual control characters in between when the name is
        longer than a single word.
  */

  //TODO: GraphQL
}
