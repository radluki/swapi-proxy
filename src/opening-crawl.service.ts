import { Injectable } from '@nestjs/common';
import { createLogger } from './logger-factory';
import { getCounterObj } from './utils';
import { CachedApiProxyService } from './cached-api-proxy.service';

export interface IOpeningCrawlsService {
  countWords(): Promise<string>;
  getNamesWithTheMostOccurences(): Promise<string>;
}

@Injectable()
export class OpeningCrawlsService implements IOpeningCrawlsService {
  private readonly logger = createLogger(OpeningCrawlsService.name);
  private readonly filmsUrl: string = '/api/films/';
  private readonly peopleUrl: string = '/api/people/';

  constructor(private readonly cachedApiProxyService: CachedApiProxyService) {}

  async countWords(): Promise<string> {
    const mergedOpeningCrawls = await this.getCleanedMergedOpeningCrawls();
    const words = mergedOpeningCrawls.split(/\s+/);
    const counterObj = getCounterObj(words);
    return JSON.stringify(counterObj);
  }

  async getNamesWithTheMostOccurences(): Promise<string> {
    const counterObj = await this.countNameOccurencesInOpeningCrawls();
    const maxValue = Math.max(...Object.values(counterObj));
    const hasMaxCount = (name: string) => counterObj[name] === maxValue;
    const maxNames = Object.keys(counterObj).filter(hasMaxCount);
    return JSON.stringify(maxNames);
  }

  private async getCleanedLowercaseNames(): Promise<string[]> {
    const response = await this.getAllPages(this.peopleUrl);
    return response.map((person) =>
      person.name
        .replaceAll(/[^\w\s]+/g, '')
        .toLowerCase()
        .trim(),
    );
  }

  private async getAllPages(url: string): Promise<any[]> {
    let nextUrl = url;
    let results = [];
    while (nextUrl) {
      const response = JSON.parse(
        await this.cachedApiProxyService.get(nextUrl),
      );

      results = results.concat(response.results);

      this.logger.debug(`Progress: ${results.length}/${response.count}`);
      this.logger.debug(`Fetched ${nextUrl}: ${JSON.stringify(response)}`);

      nextUrl = response.next
        ? response.next.replace('https://swapi.dev', '')
        : null;
    }
    return results;
  }

  private async getCleanedMergedOpeningCrawls(): Promise<string> {
    const response = await this.getAllPages(this.filmsUrl);
    const openingCrawls = response
      .map((film) => film.opening_crawl)
      .join('\n')
      .replaceAll(/[^\w\s]+/g, '')
      .replaceAll(/\s+/g, ' ')
      .toLowerCase()
      .trim();
    return openingCrawls;
  }

  private async countNameOccurencesInOpeningCrawls(): Promise<{
    [key: string]: number;
  }> {
    const [names, text] = await Promise.all([
      this.getCleanedLowercaseNames(),
      this.getCleanedMergedOpeningCrawls(),
    ]);
    const countObj: { [key: string]: number } = {};
    for (const name of names) {
      countObj[name] = text.split(name).length - 1;
    }
    return countObj;
  }
}
