import { Injectable } from '@nestjs/common';
import { HttpRequestSender } from "./http-request-sender";
import { createLogger } from "./logger-factory";


@Injectable()
export class OpeningCrawlService {
    private readonly logger = createLogger(OpeningCrawlService.name);
    private readonly apiDomainUrl: string = "http://localhost:3000";
    private filmsUrl: string;

    constructor(
        private readonly httpSender: HttpRequestSender
    ) {
        this.filmsUrl = `${this.apiDomainUrl}/api/films/`;
    }

    async getAllPages(url: string): Promise<any[]> {
        let nextUrl = url;
        let results = [];
        while (nextUrl) {
            const response = await this.httpSender.get(nextUrl);
            nextUrl = response.next;
            results = results.concat(response.results);

            const responseStr = JSON.stringify(response);
            this.logger.log(`Fetched ${nextUrl}: ${responseStr}`);
        }
        return results;
    }

    getCounterObj(array: string[]): { [key: string]: number } {
        let countObj: { [key: string]: number } = {};
        for (const element of array) {
            if (countObj.hasOwnProperty(element)) {
                countObj[element]++;
            } else {
                countObj[element] = 1;
            }
        }
        return countObj;
    }

    async countWords(): Promise<string> {
        const response = await this.getAllPages(this.filmsUrl);
        const openingCrawls = response
            .map(film => film.opening_crawl)
            .join('\n')
            .replaceAll(/[^\w\s]+/g, "")
            .toLowerCase()
            .split(/\s+/);
        const counterObj = this.getCounterObj(openingCrawls)
        const sortedDeys = Object.keys(counterObj).sort();
        return JSON.stringify(counterObj);
    }
}