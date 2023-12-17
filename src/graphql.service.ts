import { Injectable } from '@nestjs/common';
import { createLogger } from './logger-factory';
import { CachedApiProxyService } from './cached-api-proxy.service';

@Injectable()
export class GraphqlService {
  private logger = createLogger(GraphqlService.name);
  constructor(private cachedApiService: CachedApiProxyService) {}

  async getPeople(name?: string, page?: number): Promise<any> {
    const queries: string[] = [];
    name && queries.push(`search=${name}`);
    page && queries.push(`page=${page}`);
    const queryStr = queries.length ? `?${queries.join('&')}` : '';
    const url = `/api/people/${queryStr}`;
    this.logger.debug(`people url: ${url}`);
    const response = JSON.parse(await this.cachedApiService.get(url));
    this.logger.debug(`people response: ${JSON.stringify(response)}`);
    return response;
  }

  async getPerson(id: number): Promise<any> {
    const url = `/api/people/${id}`;
    this.logger.debug(`person url: ${url}`);
    const serilizedResp = await this.cachedApiService.get(url);
    const response = JSON.parse(serilizedResp);
    this.logger.debug(`person response: ${JSON.stringify(response)}`);
    return response;
  }
}
