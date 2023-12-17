import { Injectable } from '@nestjs/common';
import { HttpRequestSender } from './http-request-sender';
import { createLogger } from './logger-factory';
import { getCounterObj } from './utils';

@Injectable()
export class OpeningCrawlService {
  private readonly logger = createLogger(OpeningCrawlService.name);
  private readonly apiDomainUrl: string = 'http://localhost:3000';
  private filmsUrl: string;
  private peopleUrl: string;

  constructor(private readonly httpSender: HttpRequestSender) {
    this.filmsUrl = `${this.apiDomainUrl}/api/films/`;
    this.peopleUrl = `${this.apiDomainUrl}/api/people/`;
  }

  private async getAllPages(url: string): Promise<any[]> {
    let nextUrl = url;
    let results = [];
    while (nextUrl) {
      const response = await this.httpSender.get(nextUrl);
      results = results.concat(response.results);

      this.logger.debug(`Progress: ${results.length}/${response.count}`);
      this.logger.debug(`Fetched ${nextUrl}: ${JSON.stringify(response)}`);

      nextUrl = response.next ? this.substituteDomain(response.next) : null;
    }
    return results;
  }

  private substituteDomain(url: string): string {
    return url.replace('https://swapi.dev', this.apiDomainUrl);
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

  async countWords(): Promise<string> {
    const mergedOpeningCrawls = await this.getCleanedMergedOpeningCrawls();
    const words = mergedOpeningCrawls.split(/\s+/);
    const counterObj = getCounterObj(words);
    return JSON.stringify(counterObj);
  }

  private countNameOccurences(
    text: string,
    names: string[],
  ): { [key: string]: number } {
    const countObj: { [key: string]: number } = {};
    for (const element of names) {
      const count = text.split(element).length - 1;
      if (count > 0) countObj[element] = count;
    }
    return countObj;
  }

  async getNamesWithTheMostOccurences(): Promise<string> {
    const response = await this.getAllPages(this.peopleUrl);
    const names = response
      .map((film) =>
        film.name
          .replaceAll(/[^\w\s]+/g, '')
          .toLowerCase()
          .trim(),
      )
      .sort();
    this.logger.debug(`namesSize: ${names.length}`);
    const mergedOpeningCrawls = await this.getCleanedMergedOpeningCrawls();
    const nameOccuranceCounter = this.countNameOccurences(
      mergedOpeningCrawls,
      names,
    );

    const maxValue = Math.max(...Object.values(nameOccuranceCounter));
    const hasMaxCount = (name: string) =>
      nameOccuranceCounter[name] === maxValue;
    const maxNames = Object.keys(nameOccuranceCounter).filter(hasMaxCount);
    return JSON.stringify(maxNames);
  }
}
