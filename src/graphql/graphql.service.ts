import { Injectable } from '@nestjs/common';
import { createLogger } from '../utils/logger-factory';
import { CachedApiProxyService } from '../cached-api/cached-api-proxy.service';

const enum SwapiResourceType {
  People = 'people',
  Planets = 'planets',
  Starships = 'starships',
}

export interface IGraphqlService {
  getPerson(id: number): Promise<any>;
  getPlanet(id: number): Promise<any>;
  getStarship(id: number): Promise<any>;
  getPeople(name?: string, page?: number): Promise<any>;
  getPlanets(name?: string, page?: number): Promise<any>;
  getStarships(name?: string, page?: number): Promise<any>;
}

@Injectable()
export class GraphqlService {
  private logger = createLogger(GraphqlService.name);
  constructor(private cachedApiService: CachedApiProxyService) {}

  async getPerson(id: number): Promise<any> {
    return await this.getSingleResource(SwapiResourceType.People, id);
  }

  async getPlanet(id: number): Promise<any> {
    return await this.getSingleResource(SwapiResourceType.Planets, id);
  }

  async getStarship(id: number): Promise<any> {
    return await this.getSingleResource(SwapiResourceType.Starships, id);
  }

  async getPeople(name?: string, page?: number): Promise<any> {
    return await this.getResources(SwapiResourceType.People, name, page);
  }

  async getPlanets(name?: string, page?: number): Promise<any> {
    return await this.getResources(SwapiResourceType.Planets, name, page);
  }

  async getStarships(name?: string, page?: number): Promise<any> {
    return await this.getResources(SwapiResourceType.Starships, name, page);
  }

  private async getResources(
    resourceTyoe: SwapiResourceType,
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

  private async getSingleResource(
    resourceType: SwapiResourceType,
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
