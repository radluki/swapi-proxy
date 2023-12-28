import { Controller, Get, Inject } from '@nestjs/common';
import { IOpeningCrawlsService } from '../swapi-custom/opening-crawl.service';

@Controller('api')
export class SwapiCustomController {
  constructor(
    @Inject('IOpeningCrawlsService')
    private readonly openingCrawlsService: IOpeningCrawlsService,
  ) {}

  @Get('films/opening-crawls/word-counts')
  async getCountedWordsFromOpeningCrawls() {
    return await this.openingCrawlsService.countWords();
  }

  @Get('/films/opening-crawls/people/most-appearances')
  async getMostMentionedNamesInOpeningCrawls() {
    return await this.openingCrawlsService.getNamesWithTheMostOccurences();
  }
}
