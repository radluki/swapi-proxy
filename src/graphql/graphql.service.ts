import { Injectable } from '@nestjs/common';
import { createLogger } from '../utils/logger-factory';
import { CachedApiProxyService } from '../cached-api/cached-api-proxy.service';

export const enum ResourceType {
  People = 'people',
  Planets = 'planets',
  Starships = 'starships',
}

@Injectable()
export class GraphqlService {
  private logger = createLogger(GraphqlService.name);
  constructor(private cachedApiService: CachedApiProxyService) {}

  async getResources(
    resourceTyoe: ResourceType,
    name?: string,
    page?: number,
  ): Promise<any> {
    const queries: string[] = [];
    name && queries.push(`search=${name}`);
    page && queries.push(`page=${page}`);
    const queryStr = queries.length ? `?${queries.join('&')}` : '';
    const url = `/api/${resourceTyoe}/${queryStr}`;
    this.logger.debug(`resource url: ${url}`);
    const response = JSON.parse(await this.cachedApiService.get(url));
    this.logger.debug(`resource response: ${JSON.stringify(response)}`);
    return response;
  }

  async getSingleResource(
    resourceType: ResourceType,
    id: number,
  ): Promise<any> {
    const url = `/api/${resourceType}/${id}`;
    this.logger.debug(`resource url: ${url}`);
    const serilizedResp = await this.cachedApiService.get(url);
    const response = JSON.parse(serilizedResp);
    this.logger.debug(`resource response: ${JSON.stringify(response)}`);
    return response;
  }
}
